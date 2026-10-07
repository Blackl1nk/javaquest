import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Circle, Lock, Play, BookOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/gamification";
import { course, getPublishedModules, totalPublishedExercises } from "@/lib/course";
import { DailyGoalCard, LevelCard, StreakCard } from "@/components/stats";

export default async function LearnPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await getUserProfile(session.user.id);
  const doneExercises = new Set(profile.completedExerciseIds);
  const doneLessons = new Set(profile.completedLessonIds);
  const published = getPublishedModules();
  const totalEx = totalPublishedExercises();
  const overall = totalEx > 0 ? Math.round((doneExercises.size / totalEx) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{course.title}</h1>
          <p className="mt-1 text-sm text-muted">
            Пройдено {doneExercises.size} из {totalEx} заданий ({overall}%)
          </p>
        </div>
        {published[0] && (
          <Link
            href={`/learn/${published[0].id}/${published[0].lessons[0].id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-strong px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent"
          >
            <Play className="size-4" /> Продолжить
          </Link>
        )}
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <StreakCard
          currentStreak={profile.streak.currentStreak}
          longestStreak={profile.streak.longestStreak}
          freezes={profile.streak.freezesAvailable}
        />
        <LevelCard level={profile.levelProgress.level} xpInLevel={profile.levelProgress.xpInLevel} xpToNext={profile.levelProgress.xpToNext} percent={profile.levelProgress.percent} totalXp={profile.totalXp} />
        <DailyGoalCard earnedXp={profile.dailyGoal.earnedXp} targetXp={profile.dailyGoal.targetXp} />
      </div>

      <div className="space-y-6">
        {course.modules.map((m, idx) => {
          if (!m.published || m.lessons.length === 0) {
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-2xl border border-border-soft/60 bg-surface/40 p-4 opacity-60"
              >
                <Lock className="size-4 text-muted" />
                <div>
                  <p className="text-sm font-semibold text-muted">
                    {idx + 1}. {m.title}
                  </p>
                  <p className="text-xs text-muted/70">{m.description}</p>
                </div>
                <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted">
                  скоро
                </span>
              </div>
            );
          }
          return (
            <section key={m.id} className="rounded-2xl border border-border-soft bg-surface p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-accent-strong/15 text-sm font-bold text-accent">
                  {idx + 1}
                </span>
                <div>
                  <h2 className="font-bold text-white">{m.title}</h2>
                  <p className="text-xs text-muted">{m.description}</p>
                </div>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {m.lessons.map((lesson) => {
                  const key = `${m.id}/${lesson.id}`;
                  const isDone = doneLessons.has(key);
                  const href = `/learn/${m.id}/${lesson.id}`;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={href}
                        className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface-2/50 px-4 py-3 text-sm transition hover:border-accent/50 hover:bg-surface-2"
                      >
                        {isDone ? (
                          <CheckCircle2 className="size-5 shrink-0 text-success" />
                        ) : (
                          <Circle className="size-5 shrink-0 text-muted" />
                        )}
                        <span className={isDone ? "text-muted line-through decoration-muted/40" : "text-foreground"}>
                          {lesson.title}
                        </span>
                        <span className="ml-auto flex items-center gap-1 text-xs text-muted">
                          <BookOpen className="size-3.5" />
                          {lesson.exercises.length}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}