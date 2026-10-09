import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Проверка готовности базы перед работой с данными.
 *
 * Раньше здесь предпринималась попытка создать таблицы через `npx prisma db push`
 * прямо в serverless-функции, но это ненадёжно: Prisma CLI не попадает в бандл
 * функции, и `npx` пытался бы скачивать пакет во время запроса пользователя.
 * Теперь схема применяется отдельной командой (`npm run db:push`), а здесь мы
 * только фиксируем понятную причину в логах, если таблиц ещё нет.
 */
let schemaChecked: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaChecked) {
    schemaChecked = (async () => {
      try {
        await db.user.count();
      } catch (e) {
        const message = (e as Error).message;
        if (/does not exist|no such table/i.test(message)) {
          console.error(
            "[db] Таблицы не найдены. Примени схему к базе командой: npm run db:push " +
              "(или npx prisma db push --schema prisma/schema.postgres.prisma) и перезапусти деплой."
          );
        } else {
          console.error("[db] База недоступна:", message.slice(0, 300));
        }
      }
    })();
  }
  return schemaChecked;
}
