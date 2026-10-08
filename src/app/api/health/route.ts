import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Диагностика окружения: помогает за минуту понять, почему на хостинге
 * не работает регистрация. Открывается в браузере: /api/health
 */
export async function GET() {
  const checks: Record<string, unknown> = {
    databaseUrlSet: Boolean(process.env.DATABASE_URL),
    authSecretSet: Boolean(process.env.AUTH_SECRET),
    authTrustHost: process.env.AUTH_TRUST_HOST ?? null,
    runnerBackend: process.env.RUNNER_BACKEND ?? "auto",
    pistonUrl: process.env.PISTON_API_URL ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  };

  try {
    // Пробуем реально достучаться до БД (без записи).
    const users = await db.user.count();
    checks.database = "ok";
    checks.usersCount = users;
  } catch (e) {
    checks.database = "error";
    checks.databaseError = (e as Error).message.slice(0, 300);
  }

  const healthy = checks.database === "ok";
  return NextResponse.json({ healthy, checks }, { status: healthy ? 200 : 503 });
}