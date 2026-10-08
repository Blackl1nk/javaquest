import { describe, expect, it } from "vitest";
import { course, findExercise, getPublishedModules } from "@/lib/course";

describe("целостность контента курса", () => {
  const published = getPublishedModules();

  it("все модули опубликованы и непусты", () => {
    expect(course.modules).toHaveLength(13);
    expect(published).toHaveLength(13);
    for (const m of published) {
      expect(m.lessons.length, `модуль ${m.id} без уроков`).toBeGreaterThan(0);
      for (const l of m.lessons) {
        expect(l.exercises.length, `урок ${m.id}/${l.id} без заданий`).toBeGreaterThan(0);
      }
    }
  });

  it("id заданий уникальны по всему курсу", () => {
    const ids = published.flatMap((m) => m.lessons.flatMap((l) => l.exercises.map((e) => e.id)));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("id уроков уникальны внутри каждого модуля", () => {
    for (const m of published) {
      const ids = m.lessons.map((l) => l.id);
      expect(new Set(ids).size, `модуль ${m.id}: дубли id уроков`).toBe(ids.length);
    }
  });

  it("code-задания: starterCode с Main и тест-кейсы; викторины: ответ в границах", () => {
    for (const m of published) {
      for (const l of m.lessons) {
        for (const e of l.exercises) {
          if (e.type === "code") {
            expect(e.testCases.length, `${e.id}: нет тест-кейсов`).toBeGreaterThan(0);
            expect(e.starterCode, `${e.id}: нет класса Main`).toContain("class Main");
          } else {
            expect(e.answerIndex, `${e.id}: answerIndex < 0`).toBeGreaterThanOrEqual(0);
            expect(e.answerIndex, `${e.id}: answerIndex вне options`).toBeLessThan(e.options.length);
          }
        }
      }
    }
  });

  it("findExercise находит каждое задание в своём уроке", () => {
    for (const m of published) {
      for (const l of m.lessons) {
        for (const e of l.exercises) {
          const found = findExercise(e.id);
          expect(found, `${e.id} не найден через findExercise`).toBeTruthy();
          expect(found?.lesson.id).toBe(l.id);
          expect(found?.module.id).toBe(m.id);
        }
      }
    }
  });

  it("у всех заданий осмысленный промпт и XP", () => {
    for (const m of published) {
      for (const l of m.lessons) {
        for (const e of l.exercises) {
          expect(e.prompt.trim().length, `${e.id}: пустой промпт`).toBeGreaterThan(5);
          expect(e.xpReward, `${e.id}: XP должен быть положительным`).toBeGreaterThan(0);
        }
      }
    }
  });
});