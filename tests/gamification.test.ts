import { describe, expect, it } from "vitest";
import {
  daysBetweenUtc,
  levelForXp,
  levelProgress,
  nextStreak,
  xpForLevel,
  type StreakState,
} from "@/lib/gamification";

describe("уровни и XP", () => {
  it("xpForLevel: 1→0, 2→100, 3→300, 4→600", () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(300);
    expect(xpForLevel(4)).toBe(600);
  });

  it("levelForXp на границах", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(299)).toBe(2);
    expect(levelForXp(300)).toBe(3);
  });

  it("levelProgress считает долю внутри уровня", () => {
    const p = levelProgress(150); // уровень 2, 50 из 200 внутри
    expect(p.level).toBe(2);
    expect(p.xpInLevel).toBe(50);
    expect(p.xpToNext).toBe(150);
    expect(p.percent).toBe(25);
  });
});

describe("даты UTC", () => {
  it("daysBetweenUtc", () => {
    expect(daysBetweenUtc("2026-01-01", "2026-01-02")).toBe(1);
    expect(daysBetweenUtc("2026-01-01", "2026-01-01")).toBe(0);
    expect(daysBetweenUtc("2026-02-28", "2026-03-01")).toBe(1); // не високосный 2026
    expect(daysBetweenUtc("2026-01-02", "2026-01-01")).toBe(-1);
  });
});

describe("стрик", () => {
  const base: StreakState = {
    currentStreak: 5,
    longestStreak: 7,
    lastActiveDate: "2026-01-10",
    freezesAvailable: 1,
  };

  it("первая активность создаёт стрик 1", () => {
    const s = nextStreak(null, "2026-01-10");
    expect(s.currentStreak).toBe(1);
    expect(s.longestStreak).toBe(1);
    expect(s.changed).toBe(true);
  });

  it("активность в тот же день не меняет стрик", () => {
    const s = nextStreak(base, "2026-01-10");
    expect(s.currentStreak).toBe(5);
    expect(s.changed).toBe(false);
  });

  it("активность на следующий день: +1 и рекорд", () => {
    const s = nextStreak(base, "2026-01-11");
    expect(s.currentStreak).toBe(6);
    expect(s.longestStreak).toBe(7);
    expect(s.freezesAvailable).toBe(1);
  });

  it("пропущен 1 день и есть заморозка: стрик продолжается, заморозка тратится", () => {
    const s = nextStreak(base, "2026-01-12");
    expect(s.currentStreak).toBe(6);
    expect(s.freezesAvailable).toBe(0);
    expect(s.longestStreak).toBe(7);
  });

  it("пропущен 1 день, заморозки нет: сброс на 1", () => {
    const s = nextStreak({ ...base, freezesAvailable: 0 }, "2026-01-12");
    expect(s.currentStreak).toBe(1);
  });

  it("пропущено 2+ дня: сброс даже с заморозкой", () => {
    const s = nextStreak(base, "2026-01-13");
    expect(s.currentStreak).toBe(1);
  });
});