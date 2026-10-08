import type { CourseModule } from "@/content/types";

export const conditionsModule: CourseModule = {
  id: "conditions",
  title: "Условия: if, else, switch",
  description: "Научим программу принимать решения и вести себя по-разному в зависимости от данных.",
  published: true,
  lessons: [
    {
      id: "if",
      title: "if и else",
      theory: `Программа становится «умной», когда умеет выбирать. Оператор \`if\` выполняет блок кода, только если условие истинно:

\`\`\`java
int x = 7;
if (x % 2 == 0) {
    System.out.println("чётное");
} else {
    System.out.println("нечётное");
}
\`\`\`

Сравнения возвращают boolean: \`>\`, \`<\`, \`>=\`, \`<=\`, \`==\` (равно), \`!=\` (не равно). Оператор \`%\` даёт остаток — классическая проверка чётности это \`x % 2 == 0\`.

> Фигурные скобки \`{ }\` ограничивают тело ветки. Всегда пиши их, даже если внутри одна строка — так не ошибёшься.`,
      exercises: [
        {
          id: "if1",
          type: "code",
          prompt: "Прочитай целое число и выведи `чётное`, если оно делится на 2 без остатка, иначе `нечётное`.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        // проверь остаток от деления на 2
    }
}`,
          testCases: [
            { stdin: "4", expectedOutput: "чётное" },
            { stdin: "7", expectedOutput: "нечётное" },
            { stdin: "0", expectedOutput: "чётное" },
          ],
          hints: [
            "x % 2 == 0 — число чётное",
            "if (условие) { ... } else { ... }",
          ],
        },
        {
          id: "if2",
          type: "code",
          prompt: "Прочитай возраст (целое число) и выведи `взрослый`, если возраст 18 или больше, иначе `несовершеннолетний`.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        // сравни с 18
    }
}`,
          testCases: [
            { stdin: "20", expectedOutput: "взрослый" },
            { stdin: "16", expectedOutput: "несовершеннолетний" },
            { stdin: "18", expectedOutput: "взрослый" },
          ],
          hints: ["Оператор >= значит «больше или равно» — 18 подходит под «взрослый»."],
        },
        {
          id: "if-quiz",
          type: "multiple_choice",
          prompt: "Что выведет эта программа при x = 5?\n\n```java\nint x = 5;\nif (x > 5) {\n    System.out.println(\"больше\");\n}\nSystem.out.println(\"конец\");\n```",
          xpReward: 5,
          options: [
            "только «конец»",
            "«больше» и «конец»",
            "только «больше»",
            "ничего",
          ],
          answerIndex: 0,
          explanation:
            "5 > 5 — ложь, тело if пропускается. А println(\"конец\") стоит вне if и выполняется всегда.",
        },
      ],
    },
    {
      id: "elseif",
      title: "else if: несколько вариантов",
      theory: `Когда вариантов больше двух, ветки выстраиваются в цепочку:

\`\`\`java
if (score >= 90) {
    System.out.println("отлично");
} else if (score >= 75) {
    System.out.println("хорошо");
} else {
    System.out.println("надо доучить");
}
\`\`\`

Java проверяет условия **сверху вниз** и выполняет **первую** подошедшую ветку — остальные пропускает. Поэтому порядок проверок важен: поставь сначала самое строгое условие.`,
      exercises: [
        {
          id: "elseif1",
          type: "code",
          prompt: "Прочитай балл (0–100) и выведи оценку: `A` — если балл 90 или больше, иначе `B` — если 75 или больше, иначе `C` — если 60 или больше, иначе `D`.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
        // цепочка if / else if / else
    }
}`,
          testCases: [
            { stdin: "95", expectedOutput: "A" },
            { stdin: "80", expectedOutput: "B" },
            { stdin: "65", expectedOutput: "C" },
            { stdin: "50", expectedOutput: "D" },
          ],
          hints: [
            "Проверяй от самого высокого балла к низкому",
            "else if сработает, только если предыдущее условие ложно",
          ],
        },
        {
          id: "elseif2",
          type: "code",
          prompt: "Прочитай два целых числа (каждое с новой строки) и выведи большее из них.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // выведи большее
    }
}`,
          testCases: [
            { stdin: "3\n8", expectedOutput: "8" },
            { stdin: "-1\n-5", expectedOutput: "-1" },
          ],
          hints: ["if (a > b) вывести a, иначе — b."],
        },
        {
          id: "elseif-quiz",
          type: "multiple_choice",
          prompt: "Сколько веток цепочки `if / else if / else` может выполниться за один проход?",
          xpReward: 5,
          options: [
            "Ровно одна",
            "Все, чьи условия истинны",
            "Ни одной",
            "Две, если условия разные",
          ],
          answerIndex: 0,
          explanation:
            "Как только одна ветка выполнилась, вся остальная цепочка пропускается.",
        },
      ],
    },
    {
      id: "switch",
      title: "switch",
      theory: `Когда одна переменная сравнивается с набором конкретных значений, вместо длинной цепочки if удобен \`switch\`:

\`\`\`java
switch (day) {
    case 1:
        System.out.println("Понедельник");
        break;
    case 7:
        System.out.println("Воскресенье");
        break;
    default:
        System.out.println("Нет такого дня");
}
\`\`\`

\`break\` завершает switch. Без него выполнение «провалится» в следующий case. Ветка \`default\` срабатывает, если ничего не подошло.`,
      exercises: [
        {
          id: "switch1",
          type: "code",
          prompt: "Прочитай номер дня недели (1–7) и выведи его название через switch: `Понедельник`, `Вторник`, `Среда`, `Четверг`, `Пятница`, `Суббота`, `Воскресенье`.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int day = sc.nextInt();
        // switch (day) { case 1: ... }
    }
}`,
          testCases: [
            { stdin: "1", expectedOutput: "Понедельник" },
            { stdin: "7", expectedOutput: "Воскресенье" },
            { stdin: "4", expectedOutput: "Четверг" },
          ],
          hints: [
            "Не забудь break после каждого case",
            "default — на случай значения вне 1–7",
          ],
        },
        {
          id: "switch2",
          type: "code",
          prompt: "Прочитай символ операции (`+`, `-`, `*`, `/`), затем два целых числа (каждое с новой строки). Выведи результат операции.",
          xpReward: 15,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char op = sc.next().charAt(0);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // switch (op) { case '+': ... }
    }
}`,
          testCases: [
            { stdin: "+\n3\n4", expectedOutput: "7" },
            { stdin: "*\n5\n6", expectedOutput: "30" },
            { stdin: "/\n7\n2", expectedOutput: "3" },
          ],
          hints: [
            "Символ операции читается так: sc.next().charAt(0)",
            "case для символа пишется в одинарных кавычках: case '+':",
            "Для «/» подойдёт целочисленное деление из модуля про арифметику",
          ],
        },
        {
          id: "switch-quiz",
          type: "multiple_choice",
          prompt: "Что случится, если забыть `break` в `case`?",
          xpReward: 5,
          options: [
            "Выполнение «провалится» в следующий case",
            "Ошибка компиляции",
            "switch завершится сразу",
            "case выполнится дважды",
          ],
          answerIndex: 0,
          explanation:
            "Без break выполнение продолжается в следующем case (fall-through) — классическая ошибка новичка.",
        },
      ],
    },
  ],
};