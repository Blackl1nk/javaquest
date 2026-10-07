// Игровая механика: XP, уровни, стрики, достижения.
// Чистые функции вынесены отдельно — их удобно тестировать (vitest).

import { db } from "@/lib/db";
import { computeCompleted, course } from "@/lib/course";

/* ---------- Уровни ---------- */

// Чтобы ДОСТИГНУТЬ уровень L, нужно накопить xpForLevel(L) XP.
// xpForLevel(1)=0, 2→100, 3→300, 4→600, 5→1000 …
export function xpForLevel(level: number): number {
  return 50 * (level - 1) * level;
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function levelProgress(xp: number): {
  level: number;
  xpInLevel: number;
  xpToNext: number;
  percent: number;
} {
  const level = levelForXp(xp);
  const currentFloor = xpForLevel(level);
  const nextFloor = xpForLevel(level + 1);
  const xpInLevel = xp - currentFloor;
  const span = nextFloor - currentFloor;
  return {
    level,
    xpInLevel,
    xpToNext: nextFloor - xp,
    percent: Math.min(100, Math.round((xpInLevel / span) * 100)),
  };
}

/* ---------- Даты (UTC) ---------- */

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Полных дней между датами YYYY-MM-DD (to - from). */
export function daysBetweenUtc(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

/* ---------- Стрик ---------- */

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  freezesAvailable: number;
}

/**
 * Чистая логика стрика: пользователь что-то решил «сегодня» (today).
 * — Активность в тот же день: без изменений.
 * — Активность через день: +1.
 * — Пропущен 1 день и есть заморозка: тратим заморозку, стрик продолжается.
 * — Иначе: сброс на 1.
 */
export function nextStreak(
  prev: StreakState | null,
  today: string
): StreakState & { changed: boolean } {
  if (!prev) {
    return { currentStreak: 1, longestStreak: 1, lastActiveDate: today, freezesAvailable: 1, changed: true };
  }
  if (prev.lastActiveDate === today) {
    return { ...prev, changed: false };
  }
  const gap = daysBetweenUtc(prev.lastActiveDate, today);

  let current = prev.currentStreak;
  let freezes = prev.freezesAvailable;

  if (gap === 1) {
    current += 1;
  } else if (gap === 2 && freezes > 0) {
    freezes -= 1;
    current += 1;
  } else {
    current = 1;
  }

  return {
    currentStreak: current,
    longestStreak: Math.max(prev.longestStreak, current),
    lastActiveDate: today,
    freezesAvailable: freezes,
    changed: true,
  };
}

/* ---------- Достижения ---------- */

export interface AchievementDef {
  code: string;
  title: string;
  description: string;
  icon: string;
  check: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalXp: number;
  currentStreak: number;
  completedExerciseIds: string[];
  completedLessonCount: number;
  completedModuleIds: string[];
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    code: "first_program",
    title: "Первая программа",
    description: "Решил первое задание с кодом",
    icon: "🚀",
    check: (s) => s.completedExerciseIds.length >= 1,
  },
  {
    code: "xp_100",
    title: "Разогрев",
    description: "Накопил 100 XP",
    icon: "⚡",
    check: (s) => s.totalXp >= 100,
  },
  {
    code: "xp_1000",
    title: "Мастер XP",
    description: "Накопил 1000 XP",
    icon: "🌟",
    check: (s) => s.totalXp >= 1000,
  },
  {
    code: "streak_7",
    title: "Неделя огня",
    description: "Серия 7 дней подряд",
    icon: "🔥",
    check: (s) => s.currentStreak >= 7,
  },
  {
    code: "streak_30",
    title: "Месяц дисциплины",
    description: "Серия 30 дней подряд",
    icon: "🏆",
    check: (s) => s.currentStreak >= 30,
  },
  {
    code: "lessons_10",
    title: "Десяточка",
    description: "Пройдено 10 уроков",
    icon: "📚",
    check: (s) => s.completedLessonCount >= 10,
  },
  {
    code: "module_start",
    title: "Первые шаги сделаны",
    description: "Полностью пройден модуль «Первые шаги»",
    icon: "🥇",
    check: (s) => s.completedModuleIds.includes("start"),
  },
  {
    code: "half_course",
    title: "Экватор",
    description: "Решена половина всех заданий курса",
    icon: "⛰️",
    check: (s) => {
      const total = course.modules
        .filter((m) => m.published)
        .reduce((n, m) => n + m.lessons.reduce((k, l) => k + l.exercises.length, 0), 0);
      return total > 0 && s.completedExerciseIds.length >= Math.ceil(total / 2);
    },
  },
];

export function newlyUnlocked(stats: UserStats, alreadyOwned: Set<string>): string[] {
  return ACHIEVEMENTS.filter((a) => !alreadyOwned.has(a.code) && a.check(stats)).map((a) => a.code);
}

/* ---------- Запись результата в БД ---------- */

export interface RecordResult {
  alreadyCompleted: boolean;
  xpGranted: number;
  totalXp: number;
  level: number;
  streak: StreakState;
  dailyGoal: { targetXp: number; earnedXp: number };
  newAchievements: AchievementDef[];
}

const DEFAULT_DAILY_TARGET = 50;

/**
 * Идемпотентно фиксирует решение задания: первый успех даёт XP,
 * обновляет стрик, дневную цель и достижения. Повторное решение — no-op.
 */
export async function recordCompletion(
  userId: string,
  exerciseId: string,
  xpAward: number
): Promise<RecordResult> {
  return db.$transaction(async (tx) => {
    const existing = await tx.userProgress.findUnique({
      where: { userId_exerciseId: { userId, exerciseId } },
    });

    const streakRow =
      (await tx.streak.findUnique({ where: { userId } })) ??
      undefined;
    const streakBefore: StreakState = streakRow ?? {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: "",
      freezesAvailable: 1,
    };

    const daily = await tx.dailyGoal.upsert({
      where: { userId_date: { userId, date: todayUTC() } },
      update: {},
      create: { userId, date: todayUTC(), targetXp: DEFAULT_DAILY_TARGET, earnedXp: 0 },
    });

    const finalize = async (granted: number, streak: StreakState): Promise<RecordResult> => {
      const totalAgg = await tx.xpEvent.aggregate({ _sum: { amount: true }, where: { userId } });
      const totalXp = totalAgg._sum.amount ?? 0;

      const owned = await tx.userAchievement.findMany({ where: { userId } });
      const ownedCodes = new Set(owned.map((o) => o.achievementCode));

      const progressRows = await tx.userProgress.findMany({ where: { userId } });
      const completedIds = progressRows.map((p) => p.exerciseId);
      const { completedLessonIds, completedModuleIds } = computeCompleted(new Set(completedIds));

      const stats: UserStats = {
        totalXp,
        currentStreak: streak.currentStreak,
        completedExerciseIds: completedIds,
        completedLessonCount: completedLessonIds.size,
        completedModuleIds: [...completedModuleIds],
      };

      const codes = newlyUnlocked(stats, ownedCodes);
      if (codes.length > 0) {
        await tx.userAchievement.createMany({
          data: codes.map((achievementCode) => ({ userId, achievementCode })),
        });
      }

      return {
        alreadyCompleted: false,
        xpGranted: granted,
        totalXp,
        level: levelForXp(totalXp),
        streak,
        dailyGoal: { targetXp: daily.targetXp, earnedXp: daily.earnedXp },
        newAchievements: ACHIEVEMENTS.filter((a) => codes.includes(a.code)),
      };
    };

    if (existing) {
      const result = await finalize(0, streakBefore);
      return { ...result, alreadyCompleted: true };
    }

    // XP за задание
    await tx.userProgress.create({
      data: { userId, exerciseId, xpEarned: xpAward },
    });
    await tx.xpEvent.create({
      data: { userId, amount: xpAward, reason: `exercise:${exerciseId}` },
    });
    const updatedDaily = await tx.dailyGoal.update({
      where: { userId_date: { userId, date: todayUTC() } },
      data: { earnedXp: { increment: xpAward } },
    });

    // Стрик
    const streakNext = nextStreak(streakRow ? streakBefore : null, todayUTC());
    const streak = await tx.streak.upsert({
      where: { userId },
      update: {
        currentStreak: streakNext.currentStreak,
        longestStreak: streakNext.longestStreak,
        lastActiveDate: streakNext.lastActiveDate,
        freezesAvailable: streakNext.freezesAvailable,
      },
      create: {
        userId,
        currentStreak: streakNext.currentStreak,
        longestStreak: streakNext.longestStreak,
        lastActiveDate: streakNext.lastActiveDate,
        freezesAvailable: streakNext.freezesAvailable,
      },
    });

    const result = await finalize(xpAward, {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActiveDate: streak.lastActiveDate,
      freezesAvailable: streak.freezesAvailable,
    });
    return { ...result, dailyGoal: { targetXp: updatedDaily.targetXp, earnedXp: updatedDaily.earnedXp } };
  });
}

/** Профиль пользователя одним запросом наружу. */
export async function getUserProfile(userId: string) {
  const [xpAgg, streak, achievements, progressRows] = await Promise.all([
    db.xpEvent.aggregate({ _sum: { amount: true }, where: { userId } }),
    db.streak.findUnique({ where: { userId } }),
    db.userAchievement.findMany({ where: { userId } }),
    db.userProgress.findMany({ where: { userId }, select: { exerciseId: true } }),
  ]);

  const totalXp = xpAgg._sum.amount ?? 0;
  const completedIds = progressRows.map((p) => p.exerciseId);
  const { completedLessonIds, completedModuleIds } = computeCompleted(new Set(completedIds));

  const stats: UserStats = {
    totalXp,
    currentStreak: streak?.currentStreak ?? 0,
    completedExerciseIds: completedIds,
    completedLessonCount: completedLessonIds.size,
    completedModuleIds: [...completedModuleIds],
  };

  const ownedCodes = new Set(achievements.map((a) => a.achievementCode));

  return {
    totalXp,
    levelProgress: levelProgress(totalXp),
    streak: {
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      lastActiveDate: streak?.lastActiveDate ?? null,
      freezesAvailable: streak?.freezesAvailable ?? 1,
    },
    completedExerciseIds: completedIds,
    completedLessonIds: [...completedLessonIds],
    completedModuleIds: [...completedModuleIds],
    achievements: ACHIEVEMENTS.map((a) => ({
      ...a,
      check: undefined,
      unlocked: ownedCodes.has(a.code),
    })),
    dailyGoal: await getDailyGoal(userId),
  };
}

async function getDailyGoal(userId: string) {
  const today = todayUTC();
  const goal =
    (await db.dailyGoal.findUnique({ where: { userId_date: { userId, date: today } } })) ??
    { targetXp: DEFAULT_DAILY_TARGET, earnedXp: 0 };
  return { targetXp: goal.targetXp, earnedXp: goal.earnedXp, date: today };
}