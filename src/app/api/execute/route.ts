import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findExercise } from "@/lib/course";
import { checkRateLimit, executeOnce } from "@/lib/piston";

/**
 * Ручной прогон кода: пользователь сам задаёт stdin и смотрит, что выведет
 * программа. Тесты не проверяются, XP не начисляется — это «песочница»
 * перед нажатием «Проверить».
 */
export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    exerciseId?: string;
    code?: string;
    stdin?: string;
  } | null;

  const exerciseId = body?.exerciseId;
  const code = typeof body?.code === "string" ? body.code : null;
  const stdin = typeof body?.stdin === "string" ? body.stdin : "";
  if (!exerciseId || code === null) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const limit = checkRateLimit(userId);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        kind: "rate_limited",
        message: `Слишком много запусков. Подожди ${limit.retryAfterSec} с.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  const found = findExercise(exerciseId);
  if (!found || found.exercise.type !== "code") {
    return NextResponse.json({ error: "exercise_not_found" }, { status: 404 });
  }

  const result = await executeOnce(code, stdin);
  return NextResponse.json(result, { status: result.kind === "runner_unavailable" ? 503 : 200 });
}