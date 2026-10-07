import { redirect } from "next/navigation";
import { Crown, Flame } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function startOfWeekUTC(): Date {
  const now = new Date();
  const day = (now.getUTCDay() + 6) % 7; // понедельник = 0
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - day));
}

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const monday = startOfWeekUTC();
  const sums = await db.xpEvent.groupBy({
    by: ["userId"],
    _sum: { amount: true },
    where: { createdAt: { gte: monday } },
    orderBy: { _sum: { amount: "desc" } },
    take: 20,
  });

  const users = await db.user.findMany({
    where: { id: { in: sums.map((s) => s.userId) } },
    select: { id: true, name: true },
  });
  const nameById = new Map(users.map((u) => [u.id, u.name]));

  const rows = sums.map((s) => ({
    userId: s.userId,
    name: nameById.get(s.userId) ?? "Игрок",
    weeklyXp: s._sum.amount ?? 0,
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Лидерборд недели</h1>
      <p className="mt-1 text-sm text-muted">
        XP, заработанный с понедельника (UTC). Новая неделя — новый забег.
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border-soft bg-surface p-6 text-center text-sm text-muted">
          На этой неделе ещё никто не заработал XP. Будь первым — реши любую миссию!
        </p>
      ) : (
        <ol className="mt-6 space-y-2">
          {rows.map((row, i) => {
            const isMe = row.userId === session.user.id;
            return (
              <li
                key={row.userId}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  isMe ? "border-accent/50 bg-accent/10" : "border-border-soft bg-surface"
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-lg text-sm font-bold ${
                    i === 0
                      ? "bg-flame/15 text-flame"
                      : i === 1
                        ? "bg-surface-2 text-foreground"
                        : i === 2
                          ? "bg-surface-2 text-muted"
                          : "bg-surface-2 text-muted"
                  }`}
                >
                  {i === 0 ? <Crown className="size-4" /> : i + 1}
                </span>
                <span className={`font-semibold ${isMe ? "text-accent" : "text-white"}`}>
                  {row.name}
                  {isMe && " (ты)"}
                </span>
                <span className="ml-auto flex items-center gap-1 text-sm font-bold text-flame">
                  <Flame className="size-4" /> {row.weeklyXp} XP
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}