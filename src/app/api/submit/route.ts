import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findExercise } from "@/lib/course";
import { recordCompletion } from "@/lib/gamification";
import { executeTests } from "@/lib/piston";
import { db } from "@/lib/db";

/**
 * Фиксация решения. Сервер честно перепроверяет код в песочнице —
 * клиентский «passed» не является доказательством.
 */
export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    exerciseId?: string;
    code?: string;
    answerIndex?: number;
  } | null;
  const exerciseId = body?.exerciseId;
  if (!exerciseId) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const found = findExercise(exerciseId);
  if (!found || !found.module.published) {
    return NextResponse.json({ error: "exercise_not_found" }, { status: 404 });
  }
  const { exercise } = found;

  if (exercise.type === "code") {
    const code = typeof body?.code === "string" ? body.code : null;
    if (code === null) return NextResponse.json({ error: "bad_request" }, { status: 400 });

    const run = await executeTests(code, exercise.testCases);
    if (run.kind === "runner_unavailable") {
      return NextResponse.json(
        { ok: false, kind: run.kind, message: run.message },
        { status: 503 }
      );
    }
    await db.submission.create({
      data: {
        userId,
        exerciseId,
        code,
        status: run.kind === "passed" ? "PASSED" : run.kind === "compile_error" ? "ERROR" : "FAILED",
        testResults: JSON.stringify(run.tests ?? []),
        runtimeMs: run.runtimeMs ?? null,
      },
    });
    if (!run.ok) {
      return NextResponse.json({ ok: false, kind: run.kind, compileError: run.compileError, tests: run.tests });
    }
  } else {
    // multiple_choice
    const answerIndex = body?.answerIndex;
    if (typeof answerIndex !== "number") {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    if (answerIndex !== exercise.answerIndex) {
      return NextResponse.json({ ok: false, kind: "wrong_answer" });
    }
  }

  const result = await recordCompletion(userId, exerciseId, exercise.xpReward);
  return NextResponse.json({
    ok: true,
    alreadyCompleted: result.alreadyCompleted,
    xpGranted: result.xpGranted,
    totalXp: result.totalXp,
    level: result.level,
    streak: result.streak,
    dailyGoal: result.dailyGoal,
    newAchievements: result.newAchievements.map((a) => ({ code: a.code, title: a.title, icon: a.icon })),
  });
}