// Локальный режим песочницы: компилирует и запускает Java установленным JDK
// (javac/java из PATH). Не требует Docker; изоляции контейнером нет, поэтому
// режим рассчитан на личный сайт/разработку. Для публичного продакшена —
// Piston в Docker (см. src/lib/piston.ts и README).

import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { TestCase } from "@/content/types";

const OUTPUT_CAP = 64 * 1024; // байт на stdout/stderr
const COMPILE_TIMEOUT_MS = 15_000;

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

let jdkCache: boolean | null = null;

/** Есть ли на машине javac/java (проверяем один раз за процесс). */
export function localJdkAvailable(): boolean {
  if (jdkCache === null) {
    try {
      const p = spawnSync("javac", ["-version"], { timeout: 5000, windowsHide: true });
      jdkCache = p.status === 0;
    } catch {
      jdkCache = false;
    }
  }
  return jdkCache;
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

interface RunOutcome {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

function execLimited(
  cmd: string,
  args: string[],
  opts: { cwd?: string; input?: string; timeoutMs: number }
): Promise<RunOutcome> {
  return new Promise((resolve) => {
    let child: ChildProcess;
    try {
      child = spawn(cmd, args, { cwd: opts.cwd, windowsHide: true });
    } catch (e) {
      resolve({ stdout: "", stderr: `[runner] ${(e as Error).message}`, exitCode: null, timedOut: false });
      return;
    }

    let out = "";
    let err = "";
    let timedOut = false;
    let settled = false;
    let timer: NodeJS.Timeout | undefined;

    const append = (buf: string, chunk: Buffer) =>
      buf.length >= OUTPUT_CAP ? buf : buf + chunk.toString("utf8");

    child.stdout?.on("data", (c: Buffer) => (out = append(out, c)));
    child.stderr?.on("data", (c: Buffer) => (err = append(err, c)));

    const killTree = () => {
      try {
        if (process.platform === "win32" && child.pid) {
          spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true });
        } else {
          child.kill("SIGKILL");
        }
      } catch {
        /* процесс уже завершён */
      }
    };

    timer = setTimeout(() => {
      timedOut = true;
      killTree();
    }, opts.timeoutMs);

    child.on("error", (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        stdout: out,
        stderr: `${err}\n[runner] ${e.message}`.trim(),
        exitCode: null,
        timedOut,
      });
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout: out, stderr: err, exitCode: code, timedOut });
    });

    try {
      if (opts.input !== undefined) child.stdin?.write(opts.input);
      child.stdin?.end();
    } catch {
      /* stdin уже закрыт */
    }
  });
}

/** Компилирует один раз и прогоняет все тест-кейсы локальным JDK. */
export async function runLocalJava(
  code: string,
  testCases: TestCase[],
  runTimeoutMs: number
): Promise<ExecuteResult> {
  if (!localJdkAvailable()) {
    return {
      ok: false,
      kind: "runner_unavailable",
      message:
        "На компьютере не найден JDK (javac). Установи Eclipse Temurin 21 или запусти Docker: docker compose up -d.",
    };
  }

  let dir: string | undefined;
  try {
    dir = await mkdtemp(path.join(tmpdir(), "jq-run-"));
    await writeFile(path.join(dir, "Main.java"), code, "utf8");

    const startedAt = Date.now();
    const comp = await execLimited(
      "javac",
      [
        "-encoding", "UTF-8",
        "-J-Duser.language=en",
        "-J-Dstdout.encoding=UTF-8",
        "-J-Dstderr.encoding=UTF-8",
        path.join(dir, "Main.java"),
      ],
      { timeoutMs: COMPILE_TIMEOUT_MS }
    );
    if (comp.exitCode !== 0 || comp.timedOut) {
      const raw = comp.stderr.trim() || "Ошибка компиляции (компилятор не вернул деталей).";
      return {
        ok: false,
        kind: "compile_error",
        compileError: dir ? raw.split(dir + path.sep).join("") : raw,
      };
    }

    const tests: TestResult[] = [];
    for (const tc of testCases) {
      const stdin = tc.stdin ?? "";
      const run = await execLimited(
        "java",
        [
          "-cp", dir,
          "-Dfile.encoding=UTF-8",
          "-Dstdout.encoding=UTF-8",
          "-Dstderr.encoding=UTF-8",
          "-Dstdin.encoding=UTF-8",
          "Main",
        ],
        { timeoutMs: runTimeoutMs, input: stdin }
      );

      const actual = run.stdout;
      const stderr = run.timedOut
        ? `⏱ Превышен лимит времени (${Math.round(runTimeoutMs / 1000)} с) — вероятно, бесконечный цикл или слишком долгая программа.`
        : run.stderr;
      const pass = !run.timedOut && normalizeOutput(actual) === normalizeOutput(tc.expectedOutput);
      tests.push({ stdin, expected: tc.expectedOutput, actual, pass, stderr });
    }

    const ok = tests.every((t) => t.pass);
    return { ok, kind: ok ? "passed" : "failed", tests, runtimeMs: Date.now() - startedAt };
  } catch (e) {
    return { ok: false, kind: "runner_unavailable", message: `Локальный запуск не удался: ${(e as Error).message}` };
  } finally {
    if (dir) {
      await rm(dir, { recursive: true, force: true }).catch(() => {
        /* файлы могли быть залочены убитым процессом */
      });
    }
  }
}