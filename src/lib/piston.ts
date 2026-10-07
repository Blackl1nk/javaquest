// Клиент серверной песочницы Piston: компилирует и запускает Java-код,
// прогоняет тест-кейсы (stdin → сравнение stdout).

import type { TestCase } from "@/content/types";

const API_URL = process.env.PISTON_API_URL ?? "http://localhost:2000";
const RUN_TIMEOUT_MS = Number(process.env.RUN_TIMEOUT_MS ?? 5000);

export interface TestResult {
  stdin: string;
  expected: string;
  actual: string;
  pass: boolean;
  stderr: string;
}

export interface ExecuteResult {
  ok: boolean;
  kind: "passed" | "failed" | "compile_error" | "runner_unavailable";
  compileError?: string;
  tests?: TestResult[];
  runtimeMs?: number;
  message?: string;
}

/** Убираем \r, хвостовые пробелы в строках и пустые строки в конце. */
export function normalizeOutput(raw: string): string {
  return raw
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "")
    .trim();
}

interface PistonResponse {
  compile?: { code: number | null; stdout: string; stderr: string; output: string };
  run?: { code: number | null; stdout: string; stderr: string; output: string; signal: string | null };
  message?: string;
}

async function callPiston(code: string, stdin: string): Promise<PistonResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000); // compile + run с запасом
  try {
    const res = await fetch(`${API_URL}/api/v2/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "java",
        version: "*",
        files: [{ name: "Main.java", content: code }],
        stdin,
        compile_timeout: 10_000,
        run_timeout: RUN_TIMEOUT_MS,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Piston ${res.status}: ${text.slice(0, 200)}`);
    }
    return (await res.json()) as PistonResponse;
  } finally {
    clearTimeout(timer);
  }
}

/** Прогоняет код по всем тест-кейсам, по одному запросу на кейс. */
export async function executeTests(code: string, testCases: TestCase[]): Promise<ExecuteResult> {
  const tests: TestResult[] = [];
  let runtimeMs = 0;

  for (const tc of testCases) {
    const stdin = tc.stdin ?? "";
    let response: PistonResponse;
    try {
      const startedAt = Date.now();
      response = await callPiston(code, stdin);
      runtimeMs += Date.now() - startedAt;
    } catch (err) {
      console.error("[piston] unavailable:", err);
      return {
        ok: false,
        kind: "runner_unavailable",
        message:
          "Песочница для запуска кода недоступна. Запустите Docker и выполните: docker compose up -d (подробнее — в README).",
      };
    }

    const compile = response.compile;
    if (compile && compile.code !== 0) {
      return {
        ok: false,
        kind: "compile_error",
        compileError: friendlyCompileError(compile.stderr || compile.output || "Неизвестная ошибка компиляции"),
      };
    }

    const run = response.run;
    if (!run) {
      return { ok: false, kind: "runner_unavailable", message: "Piston вернул пустой ответ." };
    }

    const actual = run.stdout ?? "";
    const pass = normalizeOutput(actual) === normalizeOutput(tc.expectedOutput);
    tests.push({ stdin, expected: tc.expectedOutput, actual, pass, stderr: run.stderr ?? "" });
  }

  const ok = tests.every((t) => t.pass);
  return { ok, kind: ok ? "passed" : "failed", tests, runtimeMs };
}

const COMPILE_HINTS: Array<[RegExp, string]> = [
  [/';' expected|<identifier> expected/i, "Проверь точку с запятой ; в конце инструкции."],
  [/cannot find symbol/i, "Java не знает такое имя. Проверь опечатки в названиях переменных и методов."],
  [/incompatible types/i, "Типы не совпадают: нельзя, например, положить дробное число в int без преобразования."],
  [/class .* is public, should be declared/i, "Имя файла должно совпадать с именем public-класса — используй Main."],
  [/unclosed string literal/i, "Забыта закрывающая кавычка в строке."],
  [/reached end of file while parsing/i, "Не хватает закрывающей фигурной скобки }."],
];

/** Добавляем человеческую подсказку к ошибке компилятора. */
export function friendlyCompileError(raw: string): string {
  const trimmed = raw.trim();
  const firstLines = trimmed.split("\n").slice(0, 6).join("\n");
  const hint = COMPILE_HINTS.find(([re]) => re.test(trimmed))?.[1];
  return hint ? `${firstLines}\n\n💡 ${hint}` : firstLines;
}

/* ---------- Rate limit (в памяти процесса, достаточно для v1) ---------- */

const WINDOW_MS = 5 * 60 * 1000;
const MAX_RUNS_PER_WINDOW = 40;
const hits = new Map<string, number[]>();

export function checkRateLimit(userId: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const list = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_RUNS_PER_WINDOW) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - list[0])) / 1000);
    hits.set(userId, list);
    return { allowed: false, retryAfterSec };
  }
  list.push(now);
  hits.set(userId, list);
  return { allowed: true, retryAfterSec: 0 };
}