// Бэкенд Judge0 CE — запуск Java на хостинге, где нет JDK (например, Vercel).
//
// Judge0 — открытая система исполнения кода (https://github.com/judge0/judge0).
// Публичный инстанс https://ce.judge0.com бесплатен и не требует ключа, но имеет
// ограничения по нагрузке, поэтому для серьёзного продакшена лучше поднять свой
// Piston/Judge0 и переключить RUNNER_BACKEND.
//
// Выбор бэкенда: RUNNER_BACKEND=judge0 (см. src/lib/piston.ts).
// Настройки: JUDGE0_URL (по умолчанию https://ce.judge0.com),
//            JUDGE0_JAVA_ID (по умолчанию 91 — Java JDK 17.0.6).

import type { TestCase } from "@/content/types";
import {
  normalizeOutput,
  type ExecuteOnceResult,
  type ExecuteResult,
  type TestResult,
} from "@/lib/local-java";

const JUDGE0_URL = (process.env.JUDGE0_URL ?? "https://ce.judge0.com").replace(/\/$/, "");
const JAVA_ID = Number(process.env.JUDGE0_JAVA_ID ?? 91);
const RUN_TIMEOUT_MS = Number(process.env.RUN_TIMEOUT_MS ?? 5000);

/** Статусы Judge0, которые нас интересуют. */
const STATUS = {
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT: 5,
  COMPILE_ERROR: 6,
} as const;

interface Judge0Response {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: { id: number; description: string } | null;
  time?: string | null;
  exit_code?: number | null;
}

/**
 * Judge0 на публичном инстансе работает в не-UTF-8 локали, поэтому любой текст
 * (код, ввод, вывод) передаём в base64 — иначе кириллица отклоняется с ошибкой
 * «cannot be converted to UTF-8».
 */
function encodeBase64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

function decodeBase64(value?: string | null): string {
  if (!value) return "";
  return Buffer.from(value, "base64").toString("utf8");
}

async function submit(code: string, stdin: string): Promise<Judge0Response> {
  const res = await fetch(`${JUDGE0_URL}/submissions?wait=true&base64_encoded=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_code: encodeBase64(code),
      language_id: JAVA_ID,
      stdin: encodeBase64(stdin),
      // Judge0 измеряет лимит в секундах (дробное число).
      cpu_time_limit: Math.max(1, Math.round(RUN_TIMEOUT_MS / 1000)),
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Judge0 ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as Judge0Response;
}

function unavailableMessage(): string {
  return (
    "Сервис запуска Java временно недоступен. Попробуй ещё раз через минуту — " +
    "если не помогает, сообщи администратору сайта."
  );
}

function timeoutText(): string {
  return `⏱ Превышен лимит времени (${Math.round(RUN_TIMEOUT_MS / 1000)} с) — вероятно, бесконечный цикл или слишком долгая программа.`;
}

/** Ручной прогон: сырой вывод программы без сверки с тестами. */
export async function executeOnceJudge0(code: string, stdin: string): Promise<ExecuteOnceResult> {
  let response: Judge0Response;
  try {
    const startedAt = Date.now();
    response = await submit(code, stdin);
    const runtimeMs = Date.now() - startedAt;

    const statusId = response.status?.id ?? 0;
    if (statusId === STATUS.COMPILE_ERROR) {
      return {
        kind: "compile_error",
        compileError: decodeBase64(response.compile_output).trim() || "Ошибка компиляции",
      };
    }
    const timedOut = statusId === STATUS.TIME_LIMIT;
    return {
      kind: "ok",
      stdout: decodeBase64(response.stdout),
      stderr: timedOut ? timeoutText() : decodeBase64(response.stderr),
      exitCode: response.exit_code ?? null,
      timedOut,
      runtimeMs,
    };
  } catch (err) {
    console.error("[judge0] unavailable:", err);
    return { kind: "runner_unavailable", message: unavailableMessage() };
  }
}

/** Проверка тестами: по одному запросу на тест-кейс. */
export async function executeTestsJudge0(
  code: string,
  testCases: TestCase[]
): Promise<ExecuteResult> {
  const tests: TestResult[] = [];
  let runtimeMs = 0;

  for (const tc of testCases) {
    const stdin = tc.stdin ?? "";
    let response: Judge0Response;
    try {
      const startedAt = Date.now();
      response = await submit(code, stdin);
      runtimeMs += Date.now() - startedAt;
    } catch (err) {
      console.error("[judge0] unavailable:", err);
      return { ok: false, kind: "runner_unavailable", message: unavailableMessage() };
    }

    const statusId = response.status?.id ?? 0;
    if (statusId === STATUS.COMPILE_ERROR) {
      return {
        ok: false,
        kind: "compile_error",
        compileError: decodeBase64(response.compile_output).trim() || "Ошибка компиляции",
      };
    }

    const actual = decodeBase64(response.stdout);
    const timedOut = statusId === STATUS.TIME_LIMIT;
    const pass = !timedOut && normalizeOutput(actual) === normalizeOutput(tc.expectedOutput);
    tests.push({
      stdin,
      expected: tc.expectedOutput,
      actual,
      pass,
      stderr: timedOut ? timeoutText() : decodeBase64(response.stderr),
    });
  }

  const ok = tests.every((t) => t.pass);
  return { ok, kind: ok ? "passed" : "failed", tests, runtimeMs };
}
