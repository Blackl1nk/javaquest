import { javaCourse } from "@/content/java";
import type { Course, CourseModule, Exercise, Lesson } from "@/content/types";

export const course: Course = javaCourse;

export function getPublishedModules(): CourseModule[] {
  return course.modules.filter((m) => m.published);
}

export function getModule(moduleId: string): CourseModule | undefined {
  return course.modules.find((m) => m.id === moduleId);
}

export function getLesson(
  moduleId: string,
  lessonId: string
): { module: CourseModule; lesson: Lesson } | undefined {
  const module = getModule(moduleId);
  if (!module) return undefined;
  const lesson = module.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  return { module, lesson };
}

export function findExercise(
  exerciseId: string
): { exercise: Exercise; lesson: Lesson; module: CourseModule } | undefined {
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      const exercise = lesson.exercises.find((e) => e.id === exerciseId);
      if (exercise) return { exercise, lesson, module };
    }
  }
  return undefined;
}

export function lessonXp(lesson: Lesson): number {
  return lesson.exercises.reduce((sum, e) => sum + e.xpReward, 0);
}

export function moduleXp(module: CourseModule): number {
  return module.lessons.reduce((sum, l) => sum + lessonXp(l), 0);
}

export function courseXp(): number {
  return course.modules.reduce((sum, m) => sum + moduleXp(m), 0);
}

export function totalPublishedExercises(): number {
  return getPublishedModules().reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.exercises.length, 0),
    0
  );
}

export function exerciseIdsOfLesson(lesson: Lesson): string[] {
  return lesson.exercises.map((e) => e.id);
}

export function exerciseIdsOfModule(module: CourseModule): string[] {
  return module.lessons.flatMap(exerciseIdsOfLesson);
}

/**
 * Считает, какие уроки/модули закрыты пользователем.
 * Урок пройден, когда решены все его задания; модуль — когда пройдены все уроки.
 */
export function computeCompleted(completedExerciseIds: Set<string>): {
  completedLessonIds: Set<string>;
  completedModuleIds: Set<string>;
} {
  const completedLessonIds = new Set<string>();
  const completedModuleIds = new Set<string>();

  for (const module of course.modules) {
    if (!module.published || module.lessons.length === 0) continue;
    for (const lesson of module.lessons) {
      const ids = exerciseIdsOfLesson(lesson);
      if (ids.length > 0 && ids.every((id) => completedExerciseIds.has(id))) {
        completedLessonIds.add(`${module.id}/${lesson.id}`);
      }
    }
    const moduleIds = exerciseIdsOfModule(module);
    if (moduleIds.length > 0 && moduleIds.every((id) => completedExerciseIds.has(id))) {
      completedModuleIds.add(module.id);
    }
  }

  return { completedLessonIds, completedModuleIds };
}