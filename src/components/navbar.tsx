import Link from "next/link";
import { Flame } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserMenu } from "@/components/user-menu";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  let streak = 0;
  if (user) {
    const row = await db.streak.findUnique({ where: { userId: user.id } });
    streak = row?.currentStreak ?? 0;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-accent-strong text-sm font-black text-white">
            JQ
          </span>
          <span className="hidden sm:inline">
            Java<span className="text-accent">Quest</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm text-muted">
          <Link href="/learn" className="rounded-lg px-3 py-1.5 transition hover:bg-surface hover:text-foreground">
            Курс
          </Link>
          <Link href="/leaderboard" className="rounded-lg px-3 py-1.5 transition hover:bg-surface hover:text-foreground">
            Лидерборд
          </Link>
          {user && (
            <Link href="/profile" className="rounded-lg px-3 py-1.5 transition hover:bg-surface hover:text-foreground">
              Профиль
            </Link>
          )}
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-flame/10 px-2.5 py-1 text-sm font-semibold text-flame">
                <Flame className="size-4" />
                {streak}
              </span>
            )}
            <UserMenu name={user.name ?? "Игрок"} />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link href="/login" className="rounded-lg px-3 py-1.5 text-muted transition hover:text-foreground">
              Войти
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-accent-strong px-3 py-1.5 font-semibold text-white transition hover:bg-accent"
            >
              Начать
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}