import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";

/**
 * Диагностика окружения: помогает за минуту понять, почему на хостинге
 * не работает регистрация или вход. Открывается в браузере: /api/health
 */
export async function GET() {
  const problems: string[] = [];

  const databaseUrlSet = Boolean(process.env.DATABASE_URL);
  const authSecretSet = Boolean(process.env.AUTH_SECRET);
  const isPostgresUrl = /^postgres(ql)?:\/\//.test(process.env.DATABASE_URL ?? "");
  const isSqliteUrl = /^file:/.test(process.env.DATABASE_URL ?? "");
  const isProduction = process.env.NODE_ENV === "production";

  if (!databaseUrlSet) problems.push("Не задан DATABASE_URL — база данных не подключена.");
  if (!authSecretSet)
    problems.push(
      "Не задан AUTH_SECRET — вход и регистрация не работают. Добавь переменную AUTH_SECRET в настройках хостинга."
    );
  if (isProduction && isSqliteUrl)
    problems.push(
      "DATABASE_URL указывает на SQLite (file:...) в продакшене — данные не сохранятся. Подключи PostgreSQL и укажи его URL."
    );

  const checks: Record<string, unknown> = {
    databaseUrlSet,
    databaseKind: isPostgresUrl ? "postgresql" : isSqliteUrl ? "sqlite" : "unknown",
    authSecretSet,
    authTrustHost: process.env.AUTH_TRUST_HOST ?? null,
    runnerBackend: process.env.RUNNER_BACKEND ?? "auto",
    pistonUrl: process.env.PISTON_API_URL ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  };

  try {
    // На Vercel таблиц может ещё не быть — пробуем создать их перед проверкой.
    await ensureSchema();
    const users = await db.user.count();
    checks.database = "ok";
    checks.usersCount = users;
  } catch (e) {
    const message = (e as Error).message.slice(0, 400);
    checks.database = "error";
    checks.databaseError = message;
    if (/does not exist|relation .* does not exist|no such table/i.test(message)) {
      problems.push(
        "Таблицы в базе не созданы. Проверь, что в настройках хостинга (Start Command) выполняется prisma db push --schema prisma/schema.postgres.prisma"
      );
    } else {
      problems.push(`База данных недоступна: ${message}`);
    }
  }

  const healthy = problems.length === 0;
  return NextResponse.json({ healthy, problems, checks }, { status: healthy ? 200 : 503 });
}