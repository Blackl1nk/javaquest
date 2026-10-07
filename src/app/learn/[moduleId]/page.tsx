import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/gamification";
import { getModule, lessonXp } from "@/lib/course";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const mod = getModule(moduleId);
  if (!mod || !mod.published) notFound();

  const profile = await getUserProfile(session.user.id);
  const doneLessons = new Set(profile.completedLessonIds);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/learn" className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition hover:text-foreground">
        <ArrowLeft className="size-4" /> Курс
      </Link>
      <h1 className="text-2xl font-bold text-white">{mod.title}</h1>
      <p className="mt-1 text-sm text-muted">{mod.description}</p>

      <ul className="mt-6 space-y-2">
        {mod.lessons.map((lesson, i) => {
          const isDone = doneLessons.has(`${mod.id}/${lesson.id}`);
          return (
            <li key={lesson.id}>
              <Link
                href={`/learn/${mod.id}/${lesson.id}`}
                className="flex items-center gap-3 rounded-xl border border-border-soft bg-surface px-4 py-4 transition hover:border-accent/50"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-surface-2 text-xs font-bold text-muted">
                  {i + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="size-5 text-success" />
                ) : (
                  <Circle className="size-5 text-muted" />
                )}
                <span className={isDone ? "text-muted line-through decoration-muted/40" : ""}>
                  {lesson.title}
                </span>
                <span className="ml-auto rounded-full bg-accent-strong/10 px-2 py-0.5 text-xs font-semibold text-accent">
                  {lessonXp(lesson)} XP
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}