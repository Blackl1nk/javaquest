"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  Loader2,
  Play,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { Exercise } from "@/content/types";
import type { TestResult } from "@/lib/piston";
import { CodeEditor } from "@/components/code-editor";
import { ClearConsoleButton, ConsolePanel, type ConsoleRun } from "@/components/console";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";

type RunResponse = {
  ok: boolean;
  kind: "passed" | "failed" | "compile_error" | "runner_unavailable" | "rate_limited";
  compileError?: string;
  tests?: Array<TestResult>;
  runtimeMs?: number;
  message?: string;
};

type ExecuteResponse = {
  kind: "ok" | "compile_error" | "runner_unavailable" | "rate_limited";
  stdout?: string;
  stderr?: string;
  exitCode?: number | null;
  compileError?: string;
  runtimeMs?: number;
  message?: string;
};

type SubmitResponse = {
  ok: boolean;
  alreadyCompleted?: boolean;
  xpGranted?: number;
  kind?: string;
  compileError?: string;
  tests?: Array<TestResult>;
  message?: string;
  newAchievements?: Array<{ title: string; icon: string }>;
};

export function ExerciseCard({
  exercise,
  done,
  onSolved,
}: {
  exercise: Exercise;
  done: boolean;
  onSolved: (exerciseId: string, xpGranted: number) => void;
}) {
  const router = useRouter();
  const [code, setCode] = useState(exercise.type === "code" ? exercise.starterCode : "");
  const [stdin, setStdin] = useState(
    exercise.type === "code" ? (exercise.testCases[0]?.stdin ?? "") : ""
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [busy, setBusy] = useState<"" | "run" | "check" | "submit">("");
  const [consoleRun, setConsoleRun] = useState<ConsoleRun | null>(null);
  const [runResult, setRunResult] = useState<RunResponse | null>(null);
  const [wrong, setWrong] = useState(false);
  const [solvedXp, setSolvedXp] = useState<number | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [explainOpen, setExplainOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hints = exercise.hints ?? [];

  /** Ручной запуск: смотрим вывод программы, ничего не проверяем. */
  async function runCode() {
    if (exercise.type !== "code") return;
    setBusy("run");
    setError(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise.id, code, stdin }),
      });
      const data = (await res.json()) as ExecuteResponse;

      if (data.kind === "runner_unavailable" || data.kind === "rate_limited") {
        setError(data.message ?? "Не удалось запустить код.");
        setConsoleRun(null);
        return;
      }
      setConsoleRun({
        stdin,
        stdout: data.stdout ?? "",
        stderr: data.stderr ?? "",
        compileError: data.compileError,
        exitCode: data.exitCode,
        runtimeMs: data.runtimeMs,
      });
    } catch {
      setError("Не удалось связаться с сервером. Попробуй ещё раз.");
    } finally {
      setBusy("");
    }
  }

  /** Проверка: прогон по тест-кейсам, при успехе — начисление XP. */
  async function checkCode() {
    if (exercise.type !== "code") return;
    setBusy("check");
    setError(null);
    setRunResult(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise.id, code }),
      });
      const data = (await res.json()) as RunResponse;
      if (!res.ok && !data.kind) {
        setError(`Ошибка проверки (${res.status})`);
        return;
      }
      setRunResult(data);
      if (data.kind === "passed") await submitCode(code);
    } catch {
      setError("Не удалось связаться с сервером. Попробуй ещё раз.");
    } finally {
      setBusy("");
    }
  }

  async function submitCode(codeValue: string) {
    setBusy("submit");
    try {
      const body =
        exercise.type === "code"
          ? { exerciseId: exercise.id, code: codeValue }
          : { exerciseId: exercise.id, answerIndex: selected };
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as SubmitResponse;
      if (data.ok) {
        setSolvedXp(data.xpGranted ?? 0);
        onSolved(exercise.id, data.xpGranted ?? 0);
        if (data.newAchievements?.length) {
          setTimeout(() => router.refresh(), 600);
        } else {
          router.refresh();
        }
      } else if (exercise.type === "code") {
        setRunResult({
          ok: false,
          kind: (data.kind as RunResponse["kind"]) ?? "failed",
          compileError: data.compileError,
          tests: data.tests,
        });
      } else {
        setWrong(true);
      }
    } catch {
      setError("Не удалось отправить решение. Попробуй ещё раз.");
    } finally {
      setBusy("");
    }
  }

  function answerMc() {
    if (exercise.type !== "multiple_choice" || selected === null) return;
    setWrong(false);
    void submitCode("");
  }

  const passed = runResult?.kind === "passed";

  return (
    <section
      className={cn(
        "rounded-2xl border bg-surface p-4 sm:p-5 transition-colors",
        done ? "border-success/40" : "border-border-soft"
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold",
              done ? "bg-success/15 text-success" : "bg-surface-2 text-muted"
            )}
          >
            {done ? <Check className="size-4" /> : "?"}
          </span>
          <Markdown className="max-w-2xl">{exercise.prompt}</Markdown>
        </div>
        <span className="shrink-0 rounded-full bg-accent-strong/15 px-2.5 py-1 text-xs font-bold text-accent">
          +{exercise.xpReward} XP
        </span>
      </header>

      {/* Подробное объяснение задания */}
      {exercise.explanation && (
        <div className="mb-3 overflow-hidden rounded-xl border border-aqua/25 bg-aqua/5">
          <button
            type="button"
            onClick={() => setExplainOpen((v) => !v)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-aqua"
          >
            <BookOpen className="size-3.5" />
            Как решать эту задачу
            <span className="ml-auto text-[10px] font-normal text-muted">
              {explainOpen ? "свернуть" : "показать"}
            </span>
          </button>
          {explainOpen && (
            <div className="border-t border-aqua/20 px-3 py-2.5">
              <Markdown className="text-[13px]">{exercise.explanation}</Markdown>
            </div>
          )}
        </div>
      )}

      {exercise.type === "code" && (
        <div className="space-y-3">
          <CodeEditor value={code} onChange={setCode} />

          <ConsolePanel
            stdin={stdin}
            onStdinChange={setStdin}
            run={consoleRun}
            running={busy === "run"}
            placeholderStdin={exercise.testCases[0]?.stdin ?? "данные для Scanner…"}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={runCode}
              disabled={busy !== "" || done}
              title="Запустить только у себя в консоли — без проверки и без XP"
              className="inline-flex items-center gap-2 rounded-lg border border-accent-strong/60 bg-accent-strong/15 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent-strong/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === "run" ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
              {busy === "run" ? "Запускаю…" : "Запустить"}
            </button>

            <button
              onClick={checkCode}
              disabled={busy !== "" || done}
              title="Проверить решение тестами и получить XP"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === "check" || busy === "submit" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              {busy === "check" || busy === "submit" ? "Проверяю…" : "Проверить"}
            </button>

            <ClearConsoleButton
              onClick={() => {
                setConsoleRun(null);
                setRunResult(null);
              }}
              disabled={!consoleRun && !runResult}
            />

            {done && <span className="text-sm text-success">Задание решено ✓</span>}
            {solvedXp !== null && !done && (
              <span className="animate-pulse text-sm font-semibold text-success">+{solvedXp} XP!</span>
            )}
          </div>

          <p className="text-[11px] leading-relaxed text-muted">
            <strong className="font-semibold text-foreground/80">Запустить</strong> — просто исполняет код с
            вводом из консоли, чтобы посмотреть, что получилось.{" "}
            <strong className="font-semibold text-foreground/80">Проверить</strong> — прогоняет программу по
            всем тестам задания и, если всё верно, начисляет XP.
          </p>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              <AlertTriangle className="size-4 shrink-0" /> {error}
            </div>
          )}

          {runResult?.kind === "runner_unavailable" && (
            <div className="rounded-lg border border-flame/30 bg-flame/10 px-3 py-2 text-sm text-flame">
              <p className="font-semibold flex items-center gap-2">
                <AlertTriangle className="size-4" /> Песочница кода недоступна
              </p>
              <p className="mt-1 text-foreground/80">{runResult.message}</p>
            </div>
          )}

          {runResult?.kind === "compile_error" && (
            <div className="rounded-lg border border-danger/30 bg-[#0d1117] p-3">
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-danger">
                <XCircle className="size-4" /> Ошибка компиляции
              </p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-foreground/80">
                {runResult.compileError}
              </pre>
            </div>
          )}

          {runResult?.tests && (
            <div className="overflow-hidden rounded-lg border border-border-soft">
              <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2/60 px-3 py-2 text-xs font-semibold">
                {passed ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-success" />
                    <span className="text-success">Все тесты пройдены</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-3.5 text-danger" />
                    <span className="text-danger">
                      Пройдено {runResult.tests.filter((t) => t.pass).length} из {runResult.tests.length}
                    </span>
                  </>
                )}
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-2 text-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">Вход</th>
                    <th className="px-3 py-2 font-medium">Ожидалось</th>
                    <th className="px-3 py-2 font-medium">Получилось</th>
                    <th className="px-3 py-2 font-medium">Тест</th>
                  </tr>
                </thead>
                <tbody>
                  {runResult.tests.map((t, i) => (
                    <tr key={i} className="border-t border-border-soft">
                      <td className="px-3 py-2 font-mono text-aqua">{t.stdin || "—"}</td>
                      <td className="whitespace-pre-wrap px-3 py-2 font-mono">{t.expected || "—"}</td>
                      <td className="whitespace-pre-wrap px-3 py-2 font-mono text-foreground/70">
                        {t.actual.trim() === "" ? <span className="text-muted">(пусто)</span> : t.actual.trimEnd()}
                        {t.stderr && <div className="mt-1 text-danger/80">{t.stderr.trimEnd()}</div>}
                      </td>
                      <td className="px-3 py-2">
                        {t.pass ? (
                          <CheckCircle2 className="size-4 text-success" />
                        ) : (
                          <XCircle className="size-4 text-danger" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {runResult?.kind === "failed" && (
            <p className="text-sm text-muted">
              Пока не всё. Сравни «Ожидалось» и «Получилось» — разница подскажет, что поправить.
            </p>
          )}
        </div>
      )}

      {exercise.type === "multiple_choice" && (
        <div className="space-y-2">
          {exercise.options.map((opt, i) => {
            const isCorrect = done && i === exercise.answerIndex;
            const isWrongPick = wrong && selected === i;
            return (
              <button
                key={i}
                onClick={() => !done && setSelected(i)}
                disabled={done}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                  selected === i && !wrong
                    ? "border-accent bg-accent/10"
                    : "border-border-soft bg-surface-2/50 hover:border-muted",
                  isCorrect && "border-success/50 bg-success/10",
                  isWrongPick && "border-danger/50 bg-danger/10"
                )}
              >
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full border",
                    selected === i ? "border-accent bg-accent text-white" : "border-muted"
                  )}
                >
                  {selected === i && <Check className="size-3" />}
                </span>
                <span className="font-mono">{opt}</span>
              </button>
            );
          })}
          {!done && (
            <button
              onClick={answerMc}
              disabled={selected === null || busy === "submit"}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === "submit" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Ответить
            </button>
          )}
          {done && exercise.explanation && (
            <p className="mt-2 rounded-lg bg-surface-2/60 px-3 py-2 text-sm text-muted">💡 {exercise.explanation}</p>
          )}
        </div>
      )}

      {hints.length > 0 && !done && (
        <div className="mt-3">
          {revealedHints > 0 && (
            <ul className="mb-2 space-y-1">
              {hints.slice(0, revealedHints).map((h, i) => (
                <li key={i} className="rounded-lg bg-surface-2/60 px-3 py-2 text-sm text-muted">
                  {h}
                </li>
              ))}
            </ul>
          )}
          {revealedHints < hints.length && (
            <button
              onClick={() => setRevealedHints((n) => n + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-flame transition hover:text-flame/80"
            >
              <Lightbulb className="size-3.5" />
              Подсказка {revealedHints + 1} из {hints.length}
              <ChevronDown className="size-3" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}