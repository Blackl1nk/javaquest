// Выбирает Prisma-схему по виду DATABASE_URL:
//   postgres://… или postgresql://…  → Postgres-схема (Vercel, Railway и т.п.)
//   file:…                           → локальная SQLite-схема
//
// Запускается из npm-скриптов build / db:push, чтобы не угадывать платформу вручную.
// Использование: node scripts/with-schema.mjs <generate|dbpush> [...доп. аргументы]

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const mode = process.argv[2];
const extraArgs = process.argv.slice(3);

/**
 * Читаем DATABASE_URL из окружения, а если его нет — из файла .env.
 * Так мы точно знаем, на какую базу собираемся, и не зависим от того,
 * успел ли Prisma CLI загрузить .env (в CI-сборке Vercel файла .env нет вовсе).
 */
function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const envFile = readFileSync(".env", "utf8");
    const match = envFile.match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?/m);
    return match?.[1] ?? "";
  } catch {
    return "";
  }
}

const url = resolveDatabaseUrl();
const isPostgres = /^postgres(ql)?:\/\//.test(url);
const schema = isPostgres ? "prisma/schema.postgres.prisma" : "prisma/schema.prisma";

if (!url) {
  console.warn(
    "[prisma] DATABASE_URL не задан — использую локальную SQLite-схему. " +
      "На хостинге обязательно добавь DATABASE_URL (PostgreSQL)."
  );
}

const commands = {
  generate: ["prisma", "generate", `--schema=${schema}`],
  dbpush: ["prisma", "db", "push", `--schema=${schema}`, "--skip-generate"],
};

const args = commands[mode];
if (!args) {
  console.error(`[prisma] неизвестный режим: ${mode} (ожидается generate или dbpush)`);
  process.exit(1);
}

console.log(`[prisma] схема: ${schema} (${isPostgres ? "PostgreSQL" : "SQLite"})`);

const result = spawnSync("npx", [...args, ...extraArgs], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
