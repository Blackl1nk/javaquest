import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findExercise } from "@/lib/course";
import { checkRateLimit, executeTests } from "@/lib/piston";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { exerciseId?: string; code?: string } | null;
  const exerciseId = body?.exerciseId;
  const code = typeof body?.code === "string" ? body.code : null;
  if (!exerciseId || code === null) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const limit = checkRateLimit(userId);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "rate_limited", kind: "rate_limited", message: `Слишком много запусков. Подожди ${limit.retryAfterSec} с.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  const found = findExercise(exerciseId);
  if (!found || found.exercise.type !== "code") {
    return NextResponse.json({ error: "exercise_not_found" }, { status: 404 });
  }

  const result = await executeTests(code, found.exercise.testCases);

  // Логируем попытку (кроме случая, когда раннер недоступен)
  if (result.kind !== "runner_unavailable") {
    await db.submission.create({
      data: {
        userId,
        exerciseId,
        code,
        status:
          result.kind === "passed" ? "PASSED" : result.kind === "compile_error" ? "ERROR" : "FAILED",
        testResults: JSON.stringify(result.tests ?? []),
        runtimeMs: result.runtimeMs ?? null,
      },
    });
  }

  return NextResponse.json(result, { status: result.kind === "runner_unavailable" ? 503 : 200 });
}