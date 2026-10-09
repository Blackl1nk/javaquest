// Диспетчер песочницы: прогоняет Java-код по тест-кейсам (stdin → сравнение stdout).
// Бэкенды:
//   local  — настоящий JDK с машины (javac/java), без Docker (локальная разработка)
//   piston — серверная песочница Piston в Docker (свой сервер/VPS)
//   judge0 — облачный Judge0 CE (для хостингов без JDK, например Vercel)
// Выбор: RUNNER_BACKEND=auto (по умолчанию) | local | piston | judge0.
// В режиме auto: локальный JDK, если он есть, иначе Judge0.

import type { TestCase } from "@/content/types";
import {
  localJdkAvailable,
  normalizeOutput,
  runLocalJava,
  runLocalOnce,
  type ExecuteOnceResult,
  type ExecuteResult,
  type TestResult,
} from "@/lib/local-java";
import { executeOnceJudge0, executeTestsJudge0 } from "@/lib/judge0";

export type { ExecuteOnceResult, ExecuteResult, TestResult };
export { normalizeOutput };

const API_URL = process.env.PISTON_API_URL ?? "http://localhost:2000";
const RUN_TIMEOUT_MS = Number(process.env.RUN_TIMEOUT_MS ?? 5000);

interface PistonResponse {
  compile?: { code: number | null; stdout: string; stderr: string; output: string };
  run?: { code: number | null; stdout: string; stderr: string; output: string; signal: string | null };
  message?: string;
}

async function callPiston(url: string, code: string, stdin: string): Promise<PistonResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000); // compile + run с запасом
  try {
    const res = await fetch(`${url}/api/v2/execute`, {
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

/** Piston-бэкенд: по одному запросу на тест-кейс. */
async function executeWithPiston(code: string, testCases: TestCase[]): Promise<ExecuteResult> {
  const tests: TestResult[] = [];
  let runtimeMs = 0;

  for (const tc of testCases) {
    const stdin = tc.stdin ?? "";
    let response: PistonResponse;
    try {
      const startedAt = Date.now();
      response = await callPiston(API_URL, code, stdin);
      runtimeMs += Date.now() - startedAt;
    } catch (err) {
      console.error("[piston] unavailable:", err);
      return {
        ok: false,
        kind: "runner_unavailable",
        message:
          "Песочница недоступна: нет ни локального JDK (javac), ни Piston в Docker. Установи Eclipse Temurin 21 или запусти `docker compose up -d` (подробнее — в README).",
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

/** Прогоняет код по всем тест-кейсам, выбирая доступный бэкенд. */
export async function executeTests(code: string, testCases: TestCase[]): Promise<ExecuteResult> {
  const backend = (process.env.RUNNER_BACKEND ?? "auto").toLowerCase();

  if (backend === "local") {
    const r = await runLocalJava(code, testCases, RUN_TIMEOUT_MS);
    if (r.kind === "compile_error" && r.compileError) r.compileError = friendlyCompileError(r.compileError);
    return r;
  }
  if (backend === "piston") {
    return executeWithPiston(code, testCases);
  }
  if (backend === "judge0") {
    const r = await executeTestsJudge0(code, testCases);
    if (r.kind === "compile_error" && r.compileError) r.compileError = friendlyCompileError(r.compileError);
    return r;
  }

  // auto: свой JDK, если он есть, иначе облачный Judge0
  if (localJdkAvailable()) {
    const local = await runLocalJava(code, testCases, RUN_TIMEOUT_MS);
    if (local.kind !== "runner_unavailable") {
      if (local.kind === "compile_error" && local.compileError) {
        local.compileError = friendlyCompileError(local.compileError);
      }
      return local;
    }
    console.warn("[runner] локальный JDK не сработал, перехожу на Judge0:", local.message);
  }
  const remote = await executeTestsJudge0(code, testCases);
  if (remote.kind === "compile_error" && remote.compileError) {
    remote.compileError = friendlyCompileError(remote.compileError);
  }
  return remote;
}

/** Ручной прогон кода с произвольным stdin (без сверки с тест-кейсами). */
export async function executeOnce(code: string, stdin: string): Promise<ExecuteOnceResult> {
  const backend = (process.env.RUNNER_BACKEND ?? "auto").toLowerCase();

  if (backend === "local") {
    const r = await runLocalOnce(code, stdin, RUN_TIMEOUT_MS);
    if (r.kind === "compile_error" && r.compileError) r.compileError = friendlyCompileError(r.compileError);
    return r;
  }

  if (backend === "judge0") {
    const r = await executeOnceJudge0(code, stdin);
    if (r.kind === "compile_error" && r.compileError) r.compileError = friendlyCompileError(r.compileError);
    return r;
  }

  if (backend !== "piston" && localJdkAvailable()) {
    const local = await runLocalOnce(code, stdin, RUN_TIMEOUT_MS);
    if (local.kind !== "runner_unavailable") {
      if (local.kind === "compile_error" && local.compileError) {
        local.compileError = friendlyCompileError(local.compileError);
      }
      return local;
    }
    console.warn("[runner] локальный JDK не сработал, перехожу на Judge0:", local.message);
    const remote = await executeOnceJudge0(code, stdin);
    if (remote.kind === "compile_error" && remote.compileError) {
      remote.compileError = friendlyCompileError(remote.compileError);
    }
    return remote;
  }
  if (backend === "auto") {
    const remote = await executeOnceJudge0(code, stdin);
    if (remote.kind === "compile_error" && remote.compileError) {
      remote.compileError = friendlyCompileError(remote.compileError);
    }
    return remote;
  }

  // Piston
  try {
    const response = await callPiston(API_URL, code, stdin);
    const compile = response.compile;
    if (compile && compile.code !== 0) {
      return {
        kind: "compile_error",
        compileError: friendlyCompileError(compile.stderr || compile.output || "Ошибка компиляции"),
      };
    }
    const run = response.run;
    if (!run) return { kind: "runner_unavailable", message: "Piston вернул пустой ответ." };
    return {
      kind: "ok",
      stdout: run.stdout ?? "",
      stderr: run.stderr ?? "",
      exitCode: run.code,
      timedOut: run.signal === "SIGKILL",
    };
  } catch (err) {
    console.error("[piston] unavailable:", err);
    return {
      kind: "runner_unavailable",
      message:
        "Песочница недоступна: нет ни локального JDK (javac), ни Piston в Docker. Установи Eclipse Temurin 21 или запусти `docker compose up -d`.",
    };
  }
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