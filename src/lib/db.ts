import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Vercel (serverless) не запускает команды деплоя вроде `prisma db push`,
 * поэтому при первом обращении аккуратно создаём недостающие таблицы.
 * Выполняется один раз на инстанс и не мешает локальной разработке.
 */
let schemaEnsured: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (process.env.NODE_ENV !== "production") return Promise.resolve();
  if (!schemaEnsured) {
    schemaEnsured = (async () => {
      try {
        await db.user.count(); // если таблицы есть — просто выходим
      } catch (e) {
        const message = (e as Error).message;
        if (/does not exist|no such table/i.test(message)) {
          console.warn("[db] таблицы не найдены — создаю схему через prisma db push");
          const { spawnSync } = await import("node:child_process");
          const result = spawnSync(
            "npx",
            ["prisma", "db", "push", "--schema", "prisma/schema.postgres.prisma", "--skip-generate", "--accept-data-loss"],
            { stdio: "inherit", shell: process.platform === "win32" }
          );
          if (result.status !== 0) {
            console.error("[db] не удалось создать схему — проверь DATABASE_URL в настройках Vercel");
          }
        }
      }
    })();
  }
  return schemaEnsured;
}