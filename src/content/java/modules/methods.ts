import type { CourseModule } from "@/content/types";

export const methodsModule: CourseModule = {
  id: "methods",
  title: "Методы",
  description: "Разбиваем программу на переиспользуемые блоки с параметрами и результатом.",
  published: true,
  lessons: [
    {
      id: "intro",
      title: "Объявление и вызов",
      theory: `**Метод** — это именованный блок кода, который можно вызывать многократно. Пока все наши методы будут \`static\` — это позволяет вызывать их из \`main\` напрямую:

\`\`\`java
static int doubleIt(int x) {
    return x * 2;   // вернуть результат
}

public static void main(String[] args) {
    System.out.println(doubleIt(21)); // 42
}
\`\`\`

Разбор сигнатуры: \`static\` — вызов без создания объекта, \`int\` — тип результата, \`(int x)\` — параметр. \`return\` завершает метод и отдаёт значение.`,
      exercises: [
        {
          id: "m1",
          type: "code",
          prompt: "Допиши метод `doubleIt(int x)`, возвращающий x * 2, и убедись, что программа выводит `doubleIt(21)` — то есть `42`.",
          xpReward: 10,
          starterCode: `public class Main {
    static int doubleIt(int x) {
        // верни x * 2
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(doubleIt(21));
    }
}`,
          testCases: [{ expectedOutput: "42" }],
          hints: ["Вместо return 0 напиши return x * 2;"],
        },
        {
          id: "m2",
          type: "code",
          prompt: "Напиши метод `static void greet(String name)`, печатающий `Привет, <name>!`, и вызови его в main для имени «Аня».",
          xpReward: 10,
          starterCode: `public class Main {
    static void greet(String name) {
        // напечатай приветствие
    }

    public static void main(String[] args) {
        greet("Аня");
    }
}`,
          testCases: [{ expectedOutput: "Привет, Аня!" }],
          hints: [
            "void означает «метод ничего не возвращает» — только делает действие",
            'System.out.println("Привет, " + name + "!");',
          ],
        },
        {
          id: "m-quiz1",
          type: "multiple_choice",
          prompt: "Что делает `return` в методе?",
          xpReward: 5,
          options: [
            "Завершает метод и отдаёт значение вызвавшему коду",
            "Печатает значение в консоль",
            "Объявляет переменную",
            "Ничего — это необязательное слово",
          ],
          answerIndex: 0,
          explanation:
            "return — выход из метода. После него код метода не выполняется, а значение уходит туда, откуда метод вызвали.",
        },
      ],
    },
    {
      id: "return",
      title: "Параметры и возвращаемое значение",
      theory: `Параметров может быть несколько, а результат — любого типа, включая \`boolean\`:

\`\`\`java
static int max(int a, int b) {
    if (a >= b) {
        return a;
    } else {
        return b;
    }
}

static boolean isEven(int x) {
    return x % 2 == 0;
}
\`\`\`

boolean-методы делают код читаемым: \`if (isEven(age)) ...\` — как предложение на английском.`,
      exercises: [
        {
          id: "m3",
          type: "code",
          prompt: "Напиши метод `static int max(int a, int b)`, возвращающий большее число. В main прочитай два целых числа (с новых строк) и выведи их max.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    static int max(int a, int b) {
        // верни большее
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(max(a, b));
    }
}`,
          testCases: [
            { stdin: "3\n8", expectedOutput: "8" },
            { stdin: "-2\n-9", expectedOutput: "-2" },
            { stdin: "4\n4", expectedOutput: "4" },
          ],
          hints: ["if (a >= b) return a; else return b;"],
        },
        {
          id: "m4",
          type: "code",
          prompt: "Напиши метод `static boolean isEven(int x)` (true для чётных). В main выведи `isEven(7)` и `isEven(10)` — каждый на своей строке.",
          xpReward: 10,
          starterCode: `public class Main {
    static boolean isEven(int x) {
        // true, если чётное
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isEven(7));
        System.out.println(isEven(10));
    }
}`,
          testCases: [{ expectedOutput: "false\ntrue" }],
          hints: ["return x % 2 == 0; — сравнение уже даёт boolean"],
        },
        {
          id: "m-quiz2",
          type: "multiple_choice",
          prompt: "Какой возвращаемый тип у метода, который ничего не возвращает?",
          xpReward: 5,
          options: ["void", "null", "empty", "int"],
          answerIndex: 0,
          explanation: "void — «пустота»: метод выполняет действия (печать, изменение данных), но не отдаёт результат.",
        },
      ],
    },
    {
      id: "overload",
      title: "Перегрузка методов",
      theory: `В одном классе может быть несколько методов с **одним именем**, но разными параметрами — это **перегрузка** (overloading):

\`\`\`java
static int add(int a, int b) {
    return a + b;
}

static int add(int a, int b, int c) {
    return a + b + c;
}

// add(2, 3) → 5,  add(2, 3, 4) → 9
\`\`\`

Java сама выбирает подходящий вариант по числу и типам аргументов. А вот два метода с одинаковым набором типов — ошибка компиляции.`,
      exercises: [
        {
          id: "m5",
          type: "code",
          prompt: "Создай два метода: `static int add(int a, int b)` и `static int add(int a, int b, int c)`. Выведи `add(2, 3)` и `add(2, 3, 4)` — каждый на своей строке.",
          xpReward: 10,
          starterCode: `public class Main {
    static int add(int a, int b) {
        return 0;
    }

    static int add(int a, int b, int c) {
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(add(2, 3));
        System.out.println(add(2, 3, 4));
    }
}`,
          testCases: [{ expectedOutput: "5\n9" }],
          hints: ["Java сама выберет нужный метод по числу аргументов", "В первом — a + b, во втором — a + b + c"],
        },
        {
          id: "m-quiz3",
          type: "multiple_choice",
          prompt: "Какая пара методов НЕ скомпилируется (оба в одном классе)?",
          xpReward: 5,
          options: [
            "`add(int a, int b)` и `add(int c, int d)`",
            "`add(int a, int b)` и `add(int a, int b, int c)`",
            "`add(int a, int b)` и `add(double a, double b)`",
            "`add(int a)` и `add(String s)`",
          ],
          answerIndex: 0,
          explanation:
            "Одинаковые типы и количество параметров — это дубликат, даже если имена переменных разные. Перегрузка различает методы по типам параметров, а не по их именам.",
        },
      ],
    },
  ],
};