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
          explanation:
            "Нужно разделить все числа на два случая: делятся на 2 без остатка и все остальные. Оператор `%` возвращает **остаток** от деления, поэтому проверка звучит буквально: `x % 2 == 0` — «остаток от деления на 2 равен нулю». Дальше остаётся обернуть её в `if (условие) { ... } else { ... }` и вывести нужное слово в каждой ветке.\n\nОбрати внимание на тест с нулём: `0 % 2` тоже даёт `0`, так что ноль попадёт в ветку «чётное» — и это правильно.",
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
          explanation:
            "Задача про одну границу: возраст либо дотягивает до 18, либо нет. Используй `if (age >= 18)` — знак `>=` читается как «больше или равно» и включает само число 18 в первую ветку. В `else` попадут все остальные значения, включая 17 и меньше.\n\nПодводный камень здесь один: если написать `>` вместо `>=`, тест с ровно 18 годами провалится. Проверяй границу — это самый частый источник ошибок в условиях.",
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
          explanation:
            "Нужна цепочка `if / else if / else`: четыре диапазона, и каждому соответствует одна буква. Ключевая идея — проверять **от строгого условия к мягкому**: `if (score >= 90)`, затем `else if (score >= 75)`, затем `else if (score >= 60)` и `else` для всего остального.\n\nПочему так, а не наоборот? Java выполняет **первую** подошедшую ветку и пропускает остальные. Если начать с `score >= 60`, то балл 95 тоже подойдёт под это условие и получит неверную оценку `C`. Благодаря порядку сверху вниз второе условие можно писать коротко — до него дойдут только баллы меньше 90.",
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
          explanation:
            "Оба числа уже прочитаны в `a` и `b`, осталось выбрать большее. Сравнивай их оператором `>`: `if (a > b)` выводим `a`, `else` — `b`. Ветка `else` здесь работает как «во всех остальных случаях», поэтому отдельно проверять `b > a` не нужно.\n\nПроверь себя на втором тесте с отрицательными числами: `-1` действительно больше `-5`, и обычное `>` даёт верный ответ без всяких дополнительных условий. Если числа равны, `else` выведет `b` — но потери смысла нет, ведь значения одинаковые.",
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
          explanation:
            "Здесь удобнее `switch`, а не длинная цепочка `if`: одна переменная `day` сравнивается с конкретными числами. Пиши `case 1:` с нужным `println`, и так до `case 7:`, а в `default` — что-то на случай значения вне диапазона.\n\nГлавный подводный камень — **`break`**. Без него выполнение «провалится» в следующий `case` и напечатает несколько дней подряд. Ставь `break;` последней строкой каждой ветки.\n\nИ ещё: сравнивать нужно именно те значения, что придут на вход. День `1` — это `Понедельник`, а не `Воскресенье`, поэтому порядок `case` должен совпадать с привычной нумерацией дней недели.",
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
          explanation:
            "Символ операции уже лежит в переменной `op` типа `char`, осталось сделать `switch (op)` с четырьмя ветками `case '+':`, `case '-':`, `case '*'`, `case '/':` и вывести результат `a` и `b`.\n\nДве детали, на которых легко споткнуться:\n\n- В `case` для символа нужны **одинарные** кавычки: `case '+':`. Двойные кавычки сделают из этого строку `String`, и код просто не скомпилируется.\n- Деление целых чисел в Java **отбрасывает дробную часть**: `7 / 2` даёт `3`, а не `3.5`. Это ровно то, что ждёт тест — ничего дополнительно округлять не надо.",
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