"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, PartyPopper, ScrollText } from "lucide-react";
import type { Lesson } from "@/content/types";
import { ExerciseCard } from "@/components/exercise-card";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";

export function LessonClient({
  moduleId,
  moduleTitle,
  lesson,
  initialDoneIds,
  initialAllDone,
  nextHref,
  nextTitle,
  theoryOpenInitially = true,
}: {
  moduleId: string;
  moduleTitle: string;
  lesson: Lesson;
  initialDoneIds: string[];
  initialAllDone: boolean;
  nextHref: string | null;
  nextTitle: string | null;
  theoryOpenInitially?: boolean;
}) {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set(initialDoneIds));
  const [xpGained, setXpGained] = useState(0);
  const [theoryOpen, setTheoryOpen] = useState(theoryOpenInitially);

  const allDone =
    lesson.exercises.length > 0 && lesson.exercises.every((e) => doneIds.has(e.id)) || initialAllDone;

  function handleSolved(exerciseId: string, xp: number) {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (!next.has(exerciseId)) {
        next.add(exerciseId);
        setXpGained((v) => v + xp);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
        {moduleTitle} · Урок
      </p>
      <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl">{lesson.title}</h1>

      {/* Теория — сворачиваемая, чтобы вернуться к практике */}
      <div className="mb-6 rounded-2xl border border-border-soft bg-surface">
        <button
          onClick={() => setTheoryOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
        >
          <span className="flex items-center gap-2">
            <ScrollText className="size-4 text-aqua" /> Теория
          </span>
          <span className="text-xs text-muted">{theoryOpen ? "свернуть" : "показать"}</span>
        </button>
        {theoryOpen && (
          <div className="border-t border-border-soft px-4 py-4 sm:px-5">
            <Markdown>{lesson.theory}</Markdown>
          </div>
        )}
      </div>

      {/* Задания */}
      <div className="space-y-4">
        {lesson.exercises.map((ex, i) => (
          <div key={ex.id}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Миссия {i + 1} из {lesson.exercises.length}
            </p>
            <ExerciseCard exercise={ex} done={doneIds.has(ex.id)} onSolved={handleSolved} />
          </div>
        ))}
      </div>

      {/* Урок пройден */}
      {allDone && (
        <div className="mt-8 rounded-2xl border border-success/30 bg-success/10 p-5 text-center">
          <PartyPopper className="mx-auto mb-2 size-8 text-success" />
          <h2 className="text-lg font-bold text-white">Урок пройден!</h2>
          <p className="mt-1 text-sm text-muted">
            Получено {xpGained > 0 ? `+${xpGained} XP` : "новый прогресс"} — серия растёт каждый день, когда решаешь хотя бы одну миссию.
          </p>
          {nextHref && (
            <Link
              href={nextHref}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Следующий урок: {nextTitle} <ArrowRight className="size-4" />
            </Link>
          )}
          {!nextHref && (
            <Link
              href="/learn"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent"
            >
              К карте курса <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      )}

      <div className={cn("mt-8 text-center")} />
      <Link
        href={`/learn/${moduleId}`}
        className="mt-2 block text-center text-sm text-muted transition hover:text-foreground"
      >
        ← Все уроки модуля
      </Link>
    </div>
  );
}