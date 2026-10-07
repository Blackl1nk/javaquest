import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLesson, getPublishedModules } from "@/lib/course";
import { LessonClient } from "@/components/lesson-client";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const found = getLesson(moduleId, lessonId);
  if (!found || !found.module.published) notFound();
  const mod = found.module;
  const lesson = found.lesson;

  const doneRows = await db.userProgress.findMany({
    where: { userId: session.user.id, exerciseId: { in: lesson.exercises.map((e) => e.id) } },
    select: { exerciseId: true },
  });
  const doneIds = doneRows.map((r) => r.exerciseId);
  const allDone = lesson.exercises.length > 0 && doneIds.length === lesson.exercises.length;

  // Следующий урок: внутри модуля или первый урок следующего опубликованного модуля
  let nextHref: string | null = null;
  let nextTitle: string | null = null;
  const idx = mod.lessons.findIndex((l) => l.id === lesson.id);
  if (idx >= 0 && idx + 1 < mod.lessons.length) {
    nextHref = `/learn/${mod.id}/${mod.lessons[idx + 1].id}`;
    nextTitle = mod.lessons[idx + 1].title;
  } else {
    const published = getPublishedModules();
    const mIdx = published.findIndex((m) => m.id === mod.id);
    const nextModule = published[mIdx + 1];
    if (nextModule?.lessons[0]) {
      nextHref = `/learn/${nextModule.id}/${nextModule.lessons[0].id}`;
      nextTitle = nextModule.lessons[0].title;
    }
  }

  return (
    <LessonClient
      moduleId={mod.id}
      moduleTitle={mod.title}
      lesson={lesson}
      initialDoneIds={doneIds}
      initialAllDone={allDone}
      nextHref={nextHref}
      nextTitle={nextTitle}
    />
  );
}