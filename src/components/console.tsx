"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eraser, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConsoleRun {
  /** Ввод, который передали программе */
  stdin: string;
  /** Вывод программы (stdout) */
  stdout: string;
  /** Ошибки (stderr) */
  stderr: string;
  /** Ошибка компиляции — если код не собрался */
  compileError?: string;
  /** Код возврата процесса */
  exitCode?: number | null;
  runtimeMs?: number;
}

/**
 * Встроенная консоль: поле ввода (stdin) и вывод программы.
 * Нужна, чтобы «поиграться» с кодом до нажатия «Проверить».
 */
export function ConsolePanel({
  stdin,
  onStdinChange,
  run,
  running,
  placeholderStdin,
}: {
  stdin: string;
  onStdinChange: (value: string) => void;
  run: ConsoleRun | null;
  running: boolean;
  placeholderStdin?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border-soft bg-[#0d1117]">
      {/* Заголовок */}
      <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2/60 px-3 py-2">
        <Terminal className="size-3.5 text-success" />
        <span className="text-xs font-semibold text-foreground">Консоль</span>
        <span className="text-[10px] text-muted">
          {running ? "выполняется…" : run ? "последний запуск" : "нажми «Запустить»"}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {run && (
            <span className="mr-1 hidden text-[10px] text-muted sm:inline">
              {run.runtimeMs !== undefined && `${run.runtimeMs} мс`}
              {run.exitCode !== undefined && run.exitCode !== null && ` · код ${run.exitCode}`}
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded p-1 text-muted transition hover:bg-surface-2 hover:text-foreground"
            aria-label={collapsed ? "Развернуть консоль" : "Свернуть консоль"}
          >
            {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="grid gap-0 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
          {/* Ввод */}
          <div className="border-b border-border-soft sm:border-b-0 sm:border-r">
            <label className="block px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Ввод программы
            </label>
            <textarea
              value={stdin}
              onChange={(e) => onStdinChange(e.target.value)}
              spellCheck={false}
              rows={4}
              placeholder={placeholderStdin ?? "данные для Scanner…"}
              className="w-full resize-y bg-transparent px-3 py-2 font-mono text-xs text-aqua outline-none placeholder:text-muted/50"
            />
          </div>

          {/* Вывод */}
          <div className="min-h-[92px] px-3 py-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Вывод</span>
              {run && (
                <span className="text-[10px] text-muted/60">очищается при следующем запуске</span>
              )}
            </div>

            {running && <p className="font-mono text-xs text-muted">компилирую и запускаю…</p>}

            {!running && !run && (
              <p className="font-mono text-xs text-muted/50">
                Здесь появится вывод программы.
              </p>
            )}

            {!running && run?.compileError && (
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-danger">
                {run.compileError}
              </pre>
            )}

            {!running && run && !run.compileError && (
              <>
                {run.stdout ? (
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-foreground/90">
                    {run.stdout.replace(/\n$/, "")}
                  </pre>
                ) : (
                  <p className="font-mono text-xs text-muted/60">
                    (программа ничего не напечатала)
                  </p>
                )}
                {run.stderr && (
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap border-t border-danger/20 pt-2 font-mono text-xs text-danger/90">
                    {run.stderr.replace(/\n$/, "")}
                  </pre>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Кнопка очистки консоли (используется в карточке задания). */
export function ClearConsoleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-2 text-sm font-medium text-muted transition",
        "hover:border-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      )}
    >
      <Eraser className="size-4" />
      Очистить
    </button>
  );
}