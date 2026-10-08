import type { CourseModule } from "@/content/types";

export const projectsModule: CourseModule = {
  id: "projects",
  title: "Мини-проекты",
  description: "Калькулятор, игра «Угадай число» и консольный todo-список.",
  published: true,
  lessons: [
    {
      id: "calculator",
      title: "Калькулятор",
      theory: `Ты дошёл до конца пути — время собрать всё изученное в рабочие программы.

**Калькулятор** объединяет: Scanner (ввод), char (символ операции), switch (выбор действия), double (дробные числа):

\`\`\`java
Scanner sc = new Scanner(System.in);
char op = sc.next().charAt(0);
double a = sc.nextDouble();
double b = sc.nextDouble();
// switch (op) — сложить, вычесть, умножить или разделить
\`\`\`

Не бойся подсматривать в прошлые модули — так делают все программисты.`,
      exercises: [
        {
          id: "pr1",
          type: "code",
          prompt: "Напиши калькулятор: прочитай символ операции (`+`, `-`, `*`, `/`), затем два дробных числа (с новых строк). Выведи результат как дробное число.",
          xpReward: 20,
          explanation:
            "Здесь собирается всё сразу: ввод, `char`, `switch` и дробные числа. Символ операции и два числа уже прочитаны за тебя — остался `switch (op)`.\n\nСделай четыре `case` с символами в **одинарных** кавычках (`'+'`, `'-'`, `'*'`, `'/'`) и не забудь `break` после каждого, иначе выполнение «провалится» в следующий case и результат будет неверным.\n\nЧисла объявлены как `double`, поэтому и результат дробный: `3 + 4` напечатается как `7.0`, а `10 / 4` — как `2.5`.",
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char op = sc.next().charAt(0);
        double a = sc.nextDouble();
        double b = sc.nextDouble();
        // switch по op
    }
}`,
          testCases: [
            { stdin: "+\n3\n4", expectedOutput: "7.0" },
            { stdin: "/\n10\n4", expectedOutput: "2.5" },
            { stdin: "-\n5\n8", expectedOutput: "-3.0" },
          ],
          hints: [
            "a и b — double, поэтому результат тоже дробный: 3 + 4 напечатается как 7.0",
            "В switch по char не забудь break; для «/» просто a / b",
          ],
        },
      ],
    },
    {
      id: "guess",
      title: "Игра «Угадай число»",
      theory: `Основа любой игры — сравнение и реакция. Компьютер «загадал» число (у нас это переменная), игрок вводит попытку, программа подсказывает направление:

\`\`\`java
int secret = 7;
int guess = sc.nextInt();

if (guess == secret) {
    System.out.println("угадал!");
} else if (secret > guess) {
    System.out.println("больше");   // секретное больше попытки
} else {
    System.out.println("меньше");
}
\`\`\`

Домашняя идея: оберни это в while — и получится настоящая игра с несколькими попытками.`,
      exercises: [
        {
          id: "pr2",
          type: "code",
          prompt: "Загадано число 7 (объяви `int secret = 7`). Прочитай попытку игрока и выведи: `угадал!` — если совпало; `больше` — если секретное число больше попытки; `меньше` — если меньше.",
          xpReward: 20,
          explanation:
            "Основа игры — цепочка сравнений. Секрет задан (`int secret = 7`), осталось прочитать попытку и ответить подсказкой.\n\nПроверяй по порядку: сначала равенство (`guess == secret`) — это победа; затем `secret > guess` — значит загаданное **больше** введённого; в оставшемся случае оно меньше.\n\nПорядок веток критичен: если начать с `secret > guess`, случай равенства попадёт туда, и «угадал!» никогда не сработает. Проверь в консоли все три варианта: 5, затем 9, затем 7.",
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int secret = 7;
        int guess = sc.nextInt();
        // сравни guess и secret
    }
}`,
          testCases: [
            { stdin: "5", expectedOutput: "больше" },
            { stdin: "9", expectedOutput: "меньше" },
            { stdin: "7", expectedOutput: "угадал!" },
          ],
          hints: [
            "Порядок: if (guess == secret) ... else if (secret > guess) ... else ...",
            "«больше» означает: попытка была меньше секретного числа",
          ],
        },
      ],
    },
    {
      id: "todo",
      title: "Консольный todo-список",
      theory: `Финальный босс курса — todo-список на ArrayList:

\`\`\`java
ArrayList<String> todos = new ArrayList<>();
todos.add("Купить молоко");
todos.add("Выучить Java");

System.out.println("Дел: " + todos.size());
for (String task : todos) {
    System.out.println("- " + task);
}
\`\`\`

Здесь работают и коллекции, и циклы, и строки. Дальше этот список можно расширять: удалять задачи, сохранять в файл, читать задачи от пользователя — у тебя уже есть все инструменты.`,
      exercises: [
        {
          id: "pr3",
          type: "code",
          prompt: "Создай `ArrayList<String>` с делами «Купить молоко» и «Выучить Java». Выведи количество дел, затем сами дела — каждое на своей строке (без префиксов).",
          xpReward: 20,
          explanation:
            "Финальный босс курса — маленькое приложение на списке. Добавь в `ArrayList<String>` два дела через `add`: сначала «Купить молоко», потом «Выучить Java» (порядок важен, он попадёт в вывод).\n\nСначала напечатай `todos.size()` — количество дел, а затем перебери список циклом `for (String task : todos)` и печатай каждое дело отдельной строкой.\n\nНикаких `- ` или нумерации добавлять не нужно: тест ждёт ровно три строки — `2`, «Купить молоко», «Выучить Java».",
          starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> todos = new ArrayList<>();
        // добавь два дела, выведи размер и список
    }
}`,
          testCases: [
            { expectedOutput: "2\nКупить молоко\nВыучить Java" },
          ],
          hints: [
            "Сначала println(list.size()), затем for-each с println(task)",
            "Каждое дело — отдельный println, без «- » и других префиксов",
          ],
        },
      ],
    },
  ],
};