import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/gamification";
import { DailyGoalCard, LevelCard, StreakCard } from "@/components/stats";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await getUserProfile(session.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-accent-strong text-2xl font-black text-white">
          {(session.user.name ?? "И").slice(0, 1).toUpperCase()}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-white">{session.user.name}</h1>
          <p className="text-sm text-muted">{session.user.email}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <StreakCard
          currentStreak={profile.streak.currentStreak}
          longestStreak={profile.streak.longestStreak}
          freezes={profile.streak.freezesAvailable}
        />
        <LevelCard level={profile.levelProgress.level} xpInLevel={profile.levelProgress.xpInLevel} xpToNext={profile.levelProgress.xpToNext} percent={profile.levelProgress.percent} totalXp={profile.totalXp} />
        <DailyGoalCard earnedXp={profile.dailyGoal.earnedXp} targetXp={profile.dailyGoal.targetXp} />
      </div>

      <h2 className="mb-3 text-lg font-bold text-white">Достижения</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {profile.achievements.map((a) => (
          <div
            key={a.code}
            className={cn(
              "rounded-2xl border p-4 text-center transition",
              a.unlocked
                ? "border-accent/40 bg-accent/10"
                : "border-border-soft bg-surface/50 opacity-60"
            )}
          >
            <div className="text-3xl">{a.unlocked ? a.icon : <Lock className="mx-auto size-6 text-muted" />}</div>
            <h3 className="mt-2 text-sm font-semibold text-white">{a.title}</h3>
            <p className="mt-1 text-xs text-muted">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}