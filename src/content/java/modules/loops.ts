import type { CourseModule } from "@/content/types";

export const loopsModule: CourseModule = {
  id: "loops",
  title: "Циклы: for и while",
  description: "Повторяем действия сотни раз тремя строками кода.",
  published: true,
  lessons: [
    {
      id: "while",
      title: "while",
      theory: `Цикл \`while\` повторяет блок кода, пока условие истинно:

\`\`\`java
int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}
\`\`\`

Здесь \`i++\` увеличивает счётчик на 1. Забудешь его — условие никогда не станет ложным, и цикл будет бесконечным (наш раннер остановит его по таймауту, но лучше не доводить!).`,
      exercises: [
        {
          id: "while1",
          type: "code",
          prompt: "Прочитай число n и выведи все числа от 1 до n, каждое на своей строке.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // цикл while от 1 до n
    }
}`,
          testCases: [
            { stdin: "5", expectedOutput: "1\n2\n3\n4\n5" },
            { stdin: "1", expectedOutput: "1" },
          ],
          hints: [
            "int i = 1; while (i <= n) { System.out.println(i); i++; }",
          ],
        },
        {
          id: "while2",
          type: "code",
          prompt: "Прочитай число n и выведи сумму всех чисел от 1 до n.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // накапливай сумму в переменной
    }
}`,
          testCases: [
            { stdin: "5", expectedOutput: "15" },
            { stdin: "100", expectedOutput: "5050" },
            { stdin: "0", expectedOutput: "0" },
          ],
          hints: [
            "Заведи int sum = 0 и на каждом шаге прибавляй i: sum = sum + i;",
            "После цикла выведи sum один раз",
          ],
        },
        {
          id: "while-quiz",
          type: "multiple_choice",
          prompt: "Сколько раз выполнится тело цикла?\n\n```java\nint i = 0;\nwhile (i < 3) {\n    System.out.println(i);\n    i++;\n}\n```",
          xpReward: 5,
          options: ["3 раза", "4 раза", "2 раза", "Бесконечно"],
          answerIndex: 0,
          explanation:
            "i принимает значения 0, 1, 2 — при i = 3 условие i < 3 ложно, цикл заканчивается.",
        },
      ],
    },
    {
      id: "for",
      title: "for",
      theory: `Когда количество повторов известно заранее, удобнее \`for\` — счётчик, условие и шаг собраны в одной строке:

\`\`\`java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
\`\`\`

Читается так: «начни с i = 1; работай, пока i <= 5; после каждого шага увеличивай i на 1». Переменная \`i\` существует только внутри цикла.`,
      exercises: [
        {
          id: "for1",
          type: "code",
          prompt: "Выведи все чётные числа от 2 до 10 включительно, каждое на своей строке.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        // for со шагом 2
    }
}`,
          testCases: [{ expectedOutput: "2\n4\n6\n8\n10" }],
          hints: [
            "for (int i = 2; i <= 10; i += 2)",
            "i += 2 — то же, что i = i + 2",
          ],
        },
        {
          id: "for2",
          type: "code",
          prompt: "Прочитай число n и выведи его факториал: n! = 1 · 2 · … · n.",
          xpReward: 15,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // result *= i в цикле
    }
}`,
          testCases: [
            { stdin: "5", expectedOutput: "120" },
            { stdin: "1", expectedOutput: "1" },
            { stdin: "0", expectedOutput: "1" },
          ],
          hints: [
            "Начни с int result = 1; — тогда факториал нуля получится сам",
            "В цикле от 1 до n: result = result * i;",
          ],
        },
        {
          id: "for3",
          type: "code",
          prompt: "Прочитай число n (1–9) и выведи таблицу умножения на n — от 1 до 10, в формате `n * i = результат`, каждая строка отдельно.",
          xpReward: 15,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // 10 строк таблицы
    }
}`,
          testCases: [
            {
              stdin: "3",
              expectedOutput:
                "3 * 1 = 3\n3 * 2 = 6\n3 * 3 = 9\n3 * 4 = 12\n3 * 5 = 15\n3 * 6 = 18\n3 * 7 = 21\n3 * 8 = 24\n3 * 9 = 27\n3 * 10 = 30",
            },
            {
              stdin: "1",
              expectedOutput:
                "1 * 1 = 1\n1 * 2 = 2\n1 * 3 = 3\n1 * 4 = 4\n1 * 5 = 5\n1 * 6 = 6\n1 * 7 = 7\n1 * 8 = 8\n1 * 9 = 9\n1 * 10 = 10",
            },
          ],
          hints: ['Формат строки: n + " * " + i + " = " + n * i'],
        },
        {
          id: "for-quiz",
          type: "multiple_choice",
          prompt: "Чему равен `i` после выполнения цикла `for (int i = 0; i < 5; i++) {}` и можно ли использовать `i` после него?",
          xpReward: 5,
          options: [
            "i = 5; нельзя — переменная объявлена внутри for",
            "i = 4; можно",
            "i = 5; можно",
            "i = 4; нельзя",
          ],
          answerIndex: 0,
          explanation:
            "Цикл завершается, когда i становится 5. Переменная, объявленная в заголовке for, живёт только внутри цикла.",
        },
      ],
    },
    {
      id: "break",
      title: "break и continue",
      theory: `Два слова-управленца для циклов:

\`\`\`java
for (int i = 1; i <= 10; i++) {
    if (i % 3 == 0) continue; // пропустить кратные 3
    if (i > 8) break;         // выйти из цикла совсем
    System.out.print(i + " ");
}
// выведет: 1 2 4 5 7 8
\`\`\`

\`continue\` — «пропусти остаток тела, переходи к следующей итерации». \`break\` — «выйди из цикла немедленно».`,
      exercises: [
        {
          id: "break1",
          type: "code",
          prompt: "Прочитай число n и выведи числа от 1 до n, пропуская кратные 3. Числа — в одну строку через пробел.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // continue пропустит кратные 3
    }
}`,
          testCases: [
            { stdin: "10", expectedOutput: "1 2 4 5 7 8 10" },
            { stdin: "3", expectedOutput: "1 2" },
          ],
          hints: [
            'Печатай через System.out.print(i + " ") — хвостовой пробел обрежется автоматически',
            "if (i % 3 == 0) continue;",
          ],
        },
        {
          id: "break2",
          type: "code",
          prompt: "Найди первое число от 1 до 100, которое делится и на 2, и на 7, и выведи его.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        // цикл и break
    }
}`,
          testCases: [{ expectedOutput: "14" }],
          hints: [
            "Условие: i % 2 == 0 && i % 7 == 0 (или i % 14 == 0)",
            "Как только нашёл — выведи и break",
          ],
        },
        {
          id: "break-quiz",
          type: "multiple_choice",
          prompt: "Чем `continue` отличается от `break` в цикле?",
          xpReward: 5,
          options: [
            "continue пропускает текущую итерацию, break выходит из цикла",
            "Ничем, это синонимы",
            "continue выходит из цикла, break пропускает итерацию",
            "break работает только в switch",
          ],
          answerIndex: 0,
          explanation:
            "continue — «к следующему шагу», break — «выйти из цикла совсем». Кстати, break используется и в switch.",
        },
      ],
    },
  ],
};