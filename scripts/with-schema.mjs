// Выбирает Prisma-схему по виду DATABASE_URL:
//   file:…          → локальная SQLite-схема
//   всё остальное   → Postgres-схема (Vercel, Railway и т.п.)
//
// Логика намеренно «по умолчанию Postgres»: продакшен всегда на Postgres,
// SQLite — только локальная разработка. Так сборка не сломается, даже если
// переменная задана с кавычками, пробелами или нестандартным префиксом.
//
// Использование: node scripts/with-schema.mjs <generate|dbpush>

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const mode = process.argv[2];
const extraArgs = process.argv.slice(3);

/** Убирает кавычки и пробелы, которые часто попадают при копировании значения. */
function clean(value) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "").trim();
}

/**
 * DATABASE_URL в порядке приоритета Next.js: сначала окружение, затем .env.local,
 * затем .env. Иначе возможен рассинхрон: сборка сгенерирует клиент под одну базу,
 * а приложение в рантайме подключится к другой.
 */
function readFromEnvFile(file) {
  try {
    const envFile = readFileSync(file, "utf8");
    const match = envFile.match(/^\s*DATABASE_URL\s*=\s*(.+)$/m);
    return clean(match?.[1]);
  } catch {
    return "";
  }
}

function resolveDatabaseUrl() {
  return (
    clean(process.env.DATABASE_URL) || readFromEnvFile(".env.local") || readFromEnvFile(".env")
  );
}

const url = resolveDatabaseUrl();
const isSqlite = url.startsWith("file:");
const schema = isSqlite ? "prisma/schema.prisma" : "prisma/schema.postgres.prisma";

// Диагностика без утечки секретов: показываем только протокол.
function describeScheme(value) {
  if (!value) return "(пусто)";
  if (value.includes("://")) return `${value.split("://")[0]}://`;
  const colon = value.indexOf(":");
  return colon > 0 ? `${value.slice(0, colon + 1)}…` : `${value.slice(0, 12)}…`;
}

const scheme = describeScheme(url);
console.log(`[prisma] DATABASE_URL начинается с: ${scheme}`);
console.log(`[prisma] схема: ${schema} (${isSqlite ? "SQLite" : "PostgreSQL"})`);

if (!url) {
  console.warn(
    "[prisma] DATABASE_URL не задан. На хостинге обязательно добавь переменную " +
      "DATABASE_URL (PostgreSQL) и сделай Redeploy."
  );
} else if (!isSqlite && !/^postgres(ql)?:\/\//.test(url)) {
  console.warn(
    "[prisma] Похоже, DATABASE_URL задан неверно: ожидается postgresql://… " +
      "Проверь значение переменной в настройках хостинга (без кавычек и пробелов)."
  );
}

const commands = {
  generate: ["prisma", "generate", `--schema=${schema}`],
  dbpush: ["prisma", "db", "push", `--schema=${schema}`, "--skip-generate", "--accept-data-loss"],
};

const args = commands[mode];
if (!args) {
  console.error(`[prisma] неизвестный режим: ${mode} (ожидается generate или dbpush)`);
  process.exit(1);
}

const result = spawnSync("npx", [...args, ...extraArgs], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
