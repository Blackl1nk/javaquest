// Типы контента курса. Контент живёт в коде (src/content) и версионируется
// вместе с сайтом; в БД хранится только прогресс пользователей (по id заданий).

export type ExerciseType = "code" | "multiple_choice";

export interface TestCase {
  /** stdin программы (может быть пустым) */
  stdin?: string;
  /** Ожидаемый stdout после нормализации */
  expectedOutput: string;
}

export interface ExerciseBase {
  id: string;
  prompt: string; // markdown
  xpReward: number;
  hints?: string[];
  /**
   * Подробный разбор: что нужно сделать и как это работает.
   * У кодовых заданий — сворачиваемый блок «Как решать эту задачу»,
   * у викторин — пояснение после ответа.
   */
  explanation?: string;
}

export interface CodeExercise extends ExerciseBase {
  type: "code";
  starterCode: string;
  testCases: TestCase[];
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multiple_choice";
  options: string[];
  answerIndex: number;
}

export type Exercise = CodeExercise | MultipleChoiceExercise;

export interface Lesson {
  id: string;
  title: string;
  theory: string; // markdown
  exercises: Exercise[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  published: boolean;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  modules: CourseModule[];
}