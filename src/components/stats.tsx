import { Flame, Target, Zap } from "lucide-react";

export function StreakCard({
  currentStreak,
  longestStreak,
  freezes,
}: {
  currentStreak: number;
  longestStreak: number;
  freezes: number;
}) {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
        <Flame className="size-4 text-flame" /> Стрик
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-flame">{currentStreak}</span>
        <span className="text-sm text-muted">
          {plural(currentStreak, "день", "дня", "дней")} подряд
        </span>
      </div>
      <p className="mt-1 text-xs text-muted">
        Рекорд: {longestStreak} · ❄️ заморозок: {freezes}
      </p>
    </div>
  );
}

export function LevelCard({
  level,
  xpInLevel,
  xpToNext,
  percent,
  totalXp,
}: {
  level: number;
  xpInLevel: number;
  xpToNext: number;
  percent: number;
  totalXp: number;
}) {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
        <Zap className="size-4 text-accent" /> Уровень {level}
      </div>
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-3xl font-black text-accent">{totalXp}</span>
        <span className="text-sm text-muted">XP всего</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-strong to-aqua transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted">
        {xpInLevel} / {xpInLevel + xpToNext} до уровня {level + 1}
      </p>
    </div>
  );
}

export function DailyGoalCard({ earnedXp, targetXp }: { earnedXp: number; targetXp: number }) {
  const percent = Math.min(100, Math.round((earnedXp / Math.max(targetXp, 1)) * 100));
  const done = earnedXp >= targetXp;
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
        <Target className={done ? "size-4 text-success" : "size-4 text-aqua"} /> Цель дня
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black ${done ? "text-success" : "text-aqua"}`}>
          {percent}%
        </span>
        <span className="text-sm text-muted">
          {earnedXp} / {targetXp} XP
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full transition-all ${done ? "bg-success" : "bg-aqua"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted">
        {done ? "Цель выполнена — серия в безопасности!" : "Реши миссии, чтобы закрыть цель"}
      </p>
    </div>
  );
}

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}