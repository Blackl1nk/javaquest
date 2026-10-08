import type { CourseModule } from "@/content/types";

export const stringsModule: CourseModule = {
  id: "strings-api",
  title: "Работа со строками",
  description: "length, substring, split и другие инструменты для текста.",
  published: true,
  lessons: [
    {
      id: "basics",
      title: "length и equals",
      theory: `Строка — это объект, и у неё есть методы:

\`\`\`java
String s = "JavaQuest";
System.out.println(s.length()); // 9 — длина

String t = "javaquest";
System.out.println(s.equals(t)); // false — точное сравнение
\`\`\`

Важно: строки сравниваются через **\`equals\`**, а не через \`==\`. Оператор \`==\` сравнивает ссылки на объекты в памяти, что для строк работает непредсказуемо.`,
      exercises: [
        {
          id: "s1",
          type: "code",
          prompt: "Дана строка `String s = \"JavaQuest\";` — выведи её длину.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        String s = "JavaQuest";
        // длина строки
    }
}`,
          testCases: [{ expectedOutput: "9" }],
          hints: ["s.length() — это метод, не забудь скобки"],
          explanation:
            "Строка `s` уже создана — напечатай количество символов в ней.\n\n" +
            "Длина строки берётся методом `s.length()` — со скобками, ведь у строки `length` это **метод**, а у массива `length` — свойство без скобок. Достаточно обернуть его в `System.out.println(...)`.\n\n" +
            "Подводный камень: в `\"JavaQuest\"` 9 символов, считаются все буквы подряд. И следи за регистром: тип пишется `String` с большой буквы — это имя класса, а не `int`.",
        },
        {
          id: "s2",
          type: "code",
          prompt: "Прочитай две строки (с новых строк ввода) и выведи `true`, если они совпадают, иначе `false`. Сравни через equals.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next();
        String b = sc.next();
        // сравни содержимое
    }
}`,
          testCases: [
            { stdin: "java\njava", expectedOutput: "true" },
            { stdin: "Java\njava", expectedOutput: "false" },
          ],
          hints: ["a.equals(b) вернёт boolean — его можно печатать сразу"],
          explanation:
            "Сравни содержимое строк `a` и `b` и напечатай `true` или `false`.\n\n" +
            "Метод `a.equals(b)` возвращает `boolean`, поэтому результат можно сразу отдать в `System.out.println(...)`, без `if`. Вызывай метод у той строки, которая точно не `null`.\n\n" +
            "Подводный камень: не сравнивай строки через `==` — он проверяет ссылки на объекты, а не текст, и одинаковые строки могут дать `false`. Ещё `equals` чувствителен к регистру: `\"Java\"` и `\"java\"` не равны.",
        },
        {
          id: "s-quiz1",
          type: "multiple_choice",
          prompt: "Почему строки сравнивают через `equals`, а не через `==`?",
          xpReward: 5,
          options: [
            "== сравнивает ссылки на объекты, а equals — содержимое",
            "== сравнивает содержимое, а equals — ссылки",
            "Разницы нет, это синонимы",
            "equals работает быстрее",
          ],
          answerIndex: 0,
          explanation:
            "Две одинаковые строки могут лежать в разных местах памяти — == скажет «не равны», хотя текст одинаков.",
        },
      ],
    },
    {
      id: "methods",
      title: "substring, toUpperCase, contains",
      theory: `Методы, которые решают 90% строковых задач:

\`\`\`java
String s = "Programming";

System.out.println(s.substring(0, 7)); // Program
System.out.println(s.toUpperCase());   // PROGRAMMING
System.out.println(s.contains("gram")); // true
\`\`\`

\`substring(начало, конец)\` берёт символы с индекса «начало» по «конец − 1». Помни: строки **неизменяемы** — любой метод возвращает новую строку, исходная не меняется.`,
      exercises: [
        {
          id: "s3",
          type: "code",
          prompt: "Дана строка `String s = \"Programming\";` — выведи первые 7 символов через substring.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        String s = "Programming";
        // вырежи первые 7 символов
    }
}`,
          testCases: [{ expectedOutput: "Program" }],
          hints: ["substring(0, 7) — символы с индекса 0 по 6 включительно"],
          explanation:
            "Вырежи из строки `\"Programming\"` первые семь символов и напечатай их.\n\n" +
            "Для этого есть `s.substring(начало, конец)`: он берёт символы с индекса `начало` **включительно** по `конец` **не включая**. Значит, первые семь символов — это `s.substring(0, 7)`, и результат сразу можно напечатать.\n\n" +
            "Подводный камень: отсчёт с нуля, поэтому седьмой символ имеет индекс 6, а второй аргумент — 7. С `substring(0, 6)` потеряется последняя буква. И помни: строки неизменяемы, метод возвращает новую строку, а `s` не меняется.",
        },
        {
          id: "s4",
          type: "code",
          prompt: "Прочитай слово и выведи его заглавными буквами.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String word = sc.next();
        // подними регистр
    }
}`,
          testCases: [
            { stdin: "java", expectedOutput: "JAVA" },
            { stdin: "Quest", expectedOutput: "QUEST" },
          ],
          hints: ["word.toUpperCase()"],
          explanation:
            "Слово уже прочитано в переменную `word` — напечатай его заглавными буквами.\n\n" +
            "Метод `word.toUpperCase()` возвращает новую строку в верхнем регистре, достаточно обернуть его в `System.out.println(...)`. Скобки обязательны — без них это не вызов метода.\n\n" +
            "Подводный камень: строки в Java **неизменяемы**. Запись `word.toUpperCase();` сама по себе ничего не делает со `word`, она лишь возвращает результат. Чтобы сохранить его, нужно присвоить: `word = word.toUpperCase();`.",
        },
        {
          id: "s5",
          type: "code",
          prompt: "Дана строка `String s = \"Hello, World\";` — выведи результат проверки `s.contains(\"World\")`.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        String s = "Hello, World";
        // есть ли «World» внутри?
    }
}`,
          testCases: [{ expectedOutput: "true" }],
          hints: ["contains возвращает boolean — печатай его напрямую"],
          explanation:
            "Проверь, встречается ли подстрока `\"World\"` внутри строки `s`, и напечатай результат.\n\n" +
            "Метод `s.contains(\"World\")` возвращает `boolean`, поэтому его можно сразу положить в `System.out.println(...)` — `if` не нужен.\n\n" +
            "Подводный камень: `contains` чувствителен к регистру и ищет точное вхождение — `\"world\"` со строчной буквы дал бы `false`. Кавычки вокруг искомого текста обязательны: без них Java примет `World` за имя переменной.",
        },
        {
          id: "s-quiz2",
          type: "multiple_choice",
          prompt: "Что произойдёт со строкой `s` после вызова `s.toUpperCase()`?",
          xpReward: 5,
          options: [
            "Ничего: метод вернёт НОВУЮ строку \"JAVA\", исходная не изменится",
            "Строка s изменится на \"JAVA\"",
            "Строка станет null",
            "Будет ошибка компиляции",
          ],
          answerIndex: 0,
          explanation:
            "Строки в Java неизменяемы (immutable). Результат метода нужно куда-то положить: s = s.toUpperCase();",
        },
      ],
    },
    {
      id: "split",
      title: "split: разбираем текст",
      theory: `\`split\` режет строку на массив кусков по разделителю:

\`\`\`java
String line = "Java Quest 2025";
String[] parts = line.split(" ");

System.out.println(parts.length);  // 3
System.out.println(parts[0]);      // Java
\`\`\`

Разделитель — тоже строка: можно резать по запятой \`split(",")\`, по дефису и т.д. Результат — обычный массив, который можно перебирать циклом.`,
      exercises: [
        {
          id: "s6",
          type: "code",
          prompt: "Прочитай строку из нескольких слов через пробел и выведи количество слов.",
          xpReward: 15,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine(); // читает всю строку целиком
        // разрежь и посчитай
    }
}`,
          testCases: [
            { stdin: "один два три", expectedOutput: "3" },
            { stdin: "java", expectedOutput: "1" },
          ],
          hints: [
            'line.split(" ") вернёт массив слов',
            "words.length — это и есть количество",
          ],
          explanation:
            "Строка прочитана целиком через `sc.nextLine()` — посчитай, сколько в ней слов, разделённых пробелами.\n\n" +
            "Разбей строку методом `line.split(\" \")`: он вернёт массив `String[]` из кусков. Количество слов даст `words.length` — у массива длина это **свойство без скобок**, в отличие от `length()` у строки.\n\n" +
            "Подводный камень: читай строку именно `nextLine()`, а не `next()`. `next()` вернёт только первое слово, и на тесте `один два три` получится `1` вместо `3`.",
        },
        {
          id: "s7",
          type: "code",
          prompt: "Прочитай строку и выведи только её первое слово.",
          xpReward: 10,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        // первое слово
    }
}`,
          testCases: [
            { stdin: "Java Quest 2025", expectedOutput: "Java" },
            { stdin: "привет", expectedOutput: "привет" },
          ],
          hints: ["После split первое слово — элемент с индексом 0"],
          explanation:
            "Выведи только первое слово введённой строки.\n\n" +
            "Разрежь строку через `line.split(\" \")` — получится массив слов. Первое слово лежит в элементе с индексом `0`, ведь нумерация в Java начинается с нуля: обращайся к `words[0]` и печатай его.\n\n" +
            "Подводный камень: не путай индекс с порядковым номером — «первое» это `0`, а не `1`; обращение к несуществующему индексу даст ошибку во время выполнения. И `split` возвращает массив, а не строку, так что без индекса результат не вывести.",
        },
        {
          id: "s-quiz3",
          type: "multiple_choice",
          prompt: "Что вернёт выражение `\"a b c\".split(\" \")`?",
          xpReward: 5,
          options: [
            'Массив {"a", "b", "c"}',
            'Строку "abc"',
            'Массив {"a b c"}',
            "Число 3",
          ],
          answerIndex: 0,
          explanation:
            "split всегда возвращает массив String[] — куски исходной строки между разделителями.",
        },
      ],
    },
  ],
};