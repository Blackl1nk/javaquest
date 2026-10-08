import type { Course } from "@/content/types";
import { conditionsModule } from "./modules/conditions";
import { loopsModule } from "./modules/loops";
import { arraysModule } from "./modules/arrays";
import { methodsModule } from "./modules/methods";
import { stringsModule } from "./modules/strings-api";
import { oopBasicsModule } from "./modules/oop-basics";
import { oopAdvancedModule } from "./modules/oop-advanced";
import { collectionsModule } from "./modules/collections";
import { exceptionsModule } from "./modules/exceptions";
import { projectsModule } from "./modules/projects";

export const javaCourse: Course = {
  slug: "java",
  title: "Java с нуля",
  description:
    "Интерактивный путь от первого «Hello, World!» до собственных классов и коллекций. Теория маленькими порциями, практика — сразу в редакторе кода.",
  modules: [
    {
      id: "start",
      title: "Первые шаги",
      description: "Твой первый запуск программы и вывод текста на экран.",
      published: true,
      lessons: [
        {
          id: "hello",
          title: "Hello, World!",
          theory: `Каждая программа на Java живёт внутри **класса**, а стартует из метода \`main\`. Пока воспринимай это как обязательную «обёртку» — её смысл раскроется в модуле про ООП.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

\`System.out.println(...)\` печатает текст в консоль и **переводит строку** после него. Текст заключается в двойные кавычки, а каждая инструкция заканчивается **точкой с запятой**.

> Твоя миссия: заставить консоль говорить. Пиши код — жми «Запустить» — смотри результат тестов.`,
          exercises: [
            {
              id: "hello-1",
              type: "code",
              prompt: "Выведи в консоль ровно одну строку: `Hello, Java!`",
              xpReward: 10,
              explanation:
                "Твоя первая программа. Внутри `main` уже есть пустое место — вставь туда команду вывода.\n\n`System.out.println(\"текст\")` печатает строку и переводит курсор на новую строку. Текст обязательно в **двойных кавычках**, а инструкция заканчивается **точкой с запятой** `;` — без неё Java не скомпилируется.\n\nЖми **«Запустить»** — увидишь свой текст в консоли. Когда всё верно, нажми **«Проверить»**, чтобы получить XP.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // напиши код здесь
    }
}`,
              testCases: [{ expectedOutput: "Hello, Java!" }],
              hints: [
                "Используй System.out.println(\"Hello, Java!\");",
                "Текст — в двойных кавычках, в конце строки кода — точка с запятой.",
              ],
            },
            {
              id: "hello-2",
              type: "code",
              prompt: "Выведи **две строки**: сначала `Java`, затем `Quest`.",
              xpReward: 10,
              explanation:
                "Каждый вызов `System.out.println(...)` печатает свою строку и сразу переводит курсор вниз — поэтому два вызова подряд дают две строки.\n\nНапиши две команды: первая печатает `\"Java\"`, вторая — `\"Quest\"`. Порядок важен: тест ожидает именно `Java`, потом `Quest`, каждое слово с новой строки.\n\n💡 Если хочется вывести обе части **в одну** строку, есть `System.out.print(...)` — он печатает без перевода строки. Но здесь нужен именно `println`.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // два вызова println
    }
}`,
              testCases: [{ expectedOutput: "Java\nQuest" }],
              hints: [
                "Каждый println печатает свою строку и переводит строку после вывода.",
                "Просто напиши два вызова System.out.println подряд.",
              ],
            },
            {
              id: "hello-quiz",
              type: "multiple_choice",
              prompt: "Какая команда выводит текст в консоль в Java?",
              xpReward: 5,
              options: [
                "System.out.println(\"текст\")",
                "print(\"текст\")",
                "console.log(\"текст\")",
                "echo \"текст\"",
              ],
              answerIndex: 0,
              explanation:
                "В Java текст в консоль выводится через System.out.println(...). Остальные варианты — из других языков.",
            },
          ],
        },
        {
          id: "comments",
          title: "Комментарии",
          theory: `**Комментарий** — это заметка для человека, которую компилятор полностью игнорирует.

\`\`\`java
// однострочный комментарий

/*
   многострочный
   комментарий
*/
\`\`\`

Комментарии объясняют *почему* написан код. Хороший тон — оставлять их к неочевидным местам.

Если в коде опечатка, компилятор выдаст ошибку с номером строки — читай её внимательно, это подсказка, а не приговор.`,
          exercises: [
            {
              id: "comments-1",
              type: "code",
              prompt:
                "Выведи число `42`, а прямо над выводом оставь однострочный комментарий-заметку для себя (он не должен появиться в выводе).",
              xpReward: 10,
              explanation:
                "Комментарий начинается с `//` и действует до конца строки: всё, что после него, компилятор просто выбрасывает. Поэтому заметка не попадёт в вывод программы.\n\nОставь комментарий на строке выше и под ним напиши вывод числа: `System.out.println(42);`. Число печатается **без кавычек** — в кавычках это была бы строка.\n\n💡 Заметка может быть любой — например, объясняй себе, что делает код. Тест проверяет только вывод, поэтому текст комментария не важен.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // твоя заметка здесь
    }
}`,
              testCases: [{ expectedOutput: "42" }],
              hints: [
                "Комментарий начинается с // и может содержать любой текст.",
                "System.out.println(42); печатает число без кавычек.",
              ],
            },
            {
              id: "comments-quiz",
              type: "multiple_choice",
              prompt: "Что делает однострочный комментарий `//`?",
              xpReward: 5,
              options: [
                "Оставляет заметку в коде, которую компилятор игнорирует",
                "Выводит текст на экран",
                "Объявляет переменную",
                "Завершает программу",
              ],
              answerIndex: 0,
              explanation:
                "Комментарии существуют только для людей: компилятор их пропускает.",
            },
          ],
        },
      ],
    },
    {
      id: "variables",
      title: "Переменные и типы данных",
      description: "int, double, String и boolean — четыре кита любой программы.",
      published: true,
      lessons: [
        {
          id: "vars-numbers",
          title: "Числа: int и double",
          theory: `**Переменная** — это подписанная коробка для значения. Сначала указываем **тип**, потом имя, потом значение:

\`\`\`java
int age = 25;        // целое число
double price = 9.99; // дробное число
\`\`\`

С числами работают арифметические операторы: \`+\`, \`-\`, \`*\`, \`/\`.

\`\`\`java
int a = 7;
int b = 3;
System.out.println(a + b); // 10
\`\`\`

Переменные можно выводить как угодно много раз — и менять их значения по ходу программы.`,
          exercises: [
            {
              id: "vars-1",
              type: "code",
              prompt:
                "Создай переменные `int a = 7;` и `int b = 3;`, затем выведи их **сумму** (именно через переменные, не литералом `10`).",
              xpReward: 10,
              explanation:
                "Переменная — это именованная коробка для значения. Объявляется так: сначала **тип**, потом **имя**, потом `=` и значение. Здесь нужны две целые (`int`) переменные: `a` со значением 7 и `b` со значением 3.\n\nДальше выведи **выражение** `a + b`, а не готовое число: именно так программа начинает считать сама, а не повторять за тобой ответ.\n\nМожно проверить в консоли: поменяй значения переменных на другие — вывод изменится, потому что сумма пересчитывается.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // объяви a и b, затем выведи a + b
    }
}`,
              testCases: [{ expectedOutput: "10" }],
              hints: [
                "Сумма: a + b.",
                "System.out.println(a + b);",
              ],
            },
            {
              id: "vars-2",
              type: "code",
              prompt:
                "Одна конфета стоит `2.5`, купили `4` штуки. Объяви `double price = 2.5;` и `int count = 4;` и выведи полную стоимость.",
              xpReward: 10,
              explanation:
                "Тут важны **типы**: цена с копейками хранится в `double`, а количество штук — целое, поэтому `int`. Объяви `double price = 2.5;` и `int count = 4;`.\n\nПолная стоимость — это произведение `price * count`. Когда умножаешь `double` на `int`, Java сама расширяет результат до дробного типа, поэтому напечатается `10.0`, а не `10`.\n\n💡 Если бы обе переменные были `int`, дробная часть просто терялась бы — это классическая ловушка, о которой подробнее в уроке про арифметику.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // price, count и полная стоимость
    }
}`,
              testCases: [{ expectedOutput: "10.0" }],
              hints: [
                "Полная стоимость: count * price.",
                "Результат умножения double на int — тоже double, Java напечатает его как 10.0.",
              ],
            },
            {
              id: "vars-quiz",
              type: "multiple_choice",
              prompt: "Какой тип выбрать для цены с копейками (например, 99.99)?",
              xpReward: 5,
              options: ["int", "double", "boolean", "char"],
              answerIndex: 1,
              explanation:
                "int хранит только целые числа, поэтому для дробных значений нужен double.",
            },
          ],
        },
        {
          id: "vars-strings",
          title: "Строки и boolean",
          theory: `**String** хранит текст, **boolean** — только \`true\` или \`false\`:

\`\`\`java
String name = "Аня";
boolean isOpen = true;
\`\`\`

Строки склеиваются оператором \`+\` — это называется **конкатенация**:

\`\`\`java
System.out.println("Привет, " + name + "!");
\`\`\`

Сравнения возвращают boolean: \`>\`, \`<\`, \`>=\`, \`<=\`, \`==\`, \`!=\`.

\`\`\`java
int age = 17;
System.out.println(age >= 18); // false
\`\`\``,
          exercises: [
            {
              id: "str-1",
              type: "code",
              prompt:
                'Объяви `String name = "Аня";` и выведи `Привет, Аня!` — обязательно через конкатенацию с переменной.',
              xpReward: 10,
              explanation:
                "Соединяем текст и переменную. Сначала объяви `String name = \"Аня\";` — тип `String` хранит текст и пишется с большой буквы.\n\nДальше собери приветствие оператором `+`: он склеивает строки и переменные в одну строку. Следи за пробелами и знаком — они часть текста, и тест их проверяет: нужно ровно `Привет, Аня!`.\n\n💡 Попробуй в консоли поменять имя — программа соберёт приветствие для любого значения.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // name и приветствие
    }
}`,
              testCases: [{ expectedOutput: "Привет, Аня!" }],
              hints: [
                '"Привет, " + name + "!"',
                "Не забудь пробел после запятой и восклицательный знак.",
              ],
            },
            {
              id: "bool-1",
              type: "code",
              prompt:
                "Объяви `int age = 17;` и выведи результат сравнения `age >= 18`.",
              xpReward: 10,
              explanation:
                "Сравнение в Java — это выражение, у которого есть значение: `true` или `false`. Тип такого значения называется `boolean`.\n\nОбъяви `int age = 17;`, а затем напечатай **само сравнение** `age >= 18` — `println` умеет выводить boolean напрямую, без всяких кавычек и условий.\n\nПри 17 лет условие «18 или больше» ложно, поэтому в консоли появится `false`. Поменяй возраст на 20 — увидишь `true`.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // age и сравнение
    }
}`,
              testCases: [{ expectedOutput: "false" }],
              hints: [
                "println умеет печатать boolean напрямую.",
                "System.out.println(age >= 18);",
              ],
            },
            {
              id: "str-quiz",
              type: "multiple_choice",
              prompt: "Что выведет `System.out.println(\"5\" + 3);`?",
              xpReward: 5,
              options: ["53", "8", "Ошибка компиляции", "5 3"],
              answerIndex: 0,
              explanation:
                "Когда хотя бы один операнд — строка, «+» работает как конкатенация: \"5\" + 3 → \"53\".",
            },
          ],
        },
        {
          id: "vars-math",
          title: "Арифметика: деление, остаток, приоритет",
          theory: `У целочисленного деления есть ловушка:

\`\`\`java
System.out.println(7 / 2);   // 3 — остаток отброшен!
System.out.println(7 % 2);   // 1 — остаток от деления
System.out.println(7.0 / 2); // 3.5 — есть double, есть дробная часть
\`\`\`

\`%\` (остаток) очень полезен: чётность числа — это \`x % 2 == 0\`.

Порядок действий как в математике, скобки — старший приоритет:

\`\`\`java
System.out.println(2 + 3 * 4); // 14
System.out.println((2 + 3) * 4); // 20
\`\`\``,
          exercises: [
            {
              id: "math-1",
              type: "code",
              prompt: "Выведи остаток от деления 17 на 5.",
              xpReward: 10,
              explanation:
                "Оператор `%` возвращает **остаток** от деления, а не результат. 17 делится на 5 трижды (это 15), и остаётся 2 — вот его и надо напечатать.\n\nПросто передай выражение `17 % 5` прямо в `println`. Кстати, `%` — это тот же инструмент, которым потом проверяют чётность: `x % 2 == 0`.\n\nДля сравнения: `17 / 5` дало бы `3` — целую часть. Разница между `/` и `%` здесь и есть весь смысл урока.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // оператор остатка %
    }
}`,
              testCases: [{ expectedOutput: "2" }],
              hints: ["Остаток: 17 % 5."],
            },
            {
              id: "math-2",
              type: "code",
              prompt: "Выведи результат деления `7 / 2` (обе части — int).",
              xpReward: 10,
              explanation:
                "Главная ловушка Java: если **оба** числа целые (`int`), то и деление целочисленное — дробная часть просто отбрасывается, без округления.\n\nПоэтому `7 / 2` даст `3`, а не `3.5`. Напиши выражение как есть, прямо в `println`.\n\n💡 Чтобы получить дробный результат, хотя бы одно число должно быть `double`: `7.0 / 2` вернёт `3.5`. Попробуй оба варианта в консоли и сравни.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // целочисленное деление
    }
}`,
              testCases: [{ expectedOutput: "3" }],
              hints: [
                "int / int = int: дробная часть отбрасывается.",
                "Ожидается 3, а не 3.5.",
              ],
            },
            {
              id: "math-3",
              type: "code",
              prompt: "Выведи результат выражения `(2 + 3) * 4` — со скобками.",
              xpReward: 10,
              explanation:
                "Порядок действий в Java такой же, как в математике: умножение и деление выполняются раньше сложения, но **скобки** имеют наивысший приоритет.\n\nЗдесь скобки меняют всё: сначала считается `2 + 3 = 5`, и только потом `5 * 4 = 20`. Без скобок `2 + 3 * 4` дало бы `14`.\n\nПередай выражение целиком в `println` — он умеет печатать результат вычисления, а не только готовое число.",
              starterCode: `public class Main {
    public static void main(String[] args) {
        // скобки меняют порядок
    }
}`,
              testCases: [{ expectedOutput: "20" }],
              hints: ["println принимает выражение целиком: System.out.println((2 + 3) * 4);"],
            },
          ],
        },
      ],
    },
    {
      id: "io",
      title: "Ввод и вывод: Scanner",
      description: "Программа впервые пообщается с пользователем: прочитает числа и слова.",
      published: true,
      lessons: [
        {
          id: "io-numbers",
          title: "Читаем числа",
          theory: `Чтобы программа **читала данные**, нужен \`Scanner\`:

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt(); // читает целое число
        System.out.println(x * x);
    }
}
\`\`\`

Если на вход пришло \`5\`, программа выведет \`25\`.

В заданиях этого курса тесты передают данные через stdin — то, что читает Scanner. \`nextInt()\` читает одно целое число, пропуская пробелы и переводы строк.`,
          exercises: [
            {
              id: "scan-1",
              type: "code",
              prompt:
                "Прочитай целое число и выведи его, **увеличенное в 2 раза**.",
              xpReward: 15,
              starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // прочитай число и выведи x * 2
    }
}`,
              testCases: [
                { stdin: "5", expectedOutput: "10" },
                { stdin: "12", expectedOutput: "24" },
              ],
              explanation:
                "Впервые программа получает данные **извне**. `Scanner` уже подключён и настроен на `System.in` — осталось попросить у него число: `int x = sc.nextInt();`.\n\n`nextInt()` читает одно целое число из ввода. Дальше выведи `x * 2` — программа сама посчитает результат для любого входа.\n\nПроверь себя в консоли: поле «Ввод программы» предзаполнено значением `5` — впиши другое число и нажми «Запустить», увидишь удвоенное значение.",
              hints: [
                "int x = sc.nextInt();",
                "Выведи x * 2.",
              ],
            },
            {
              id: "scan-2",
              type: "code",
              prompt:
                "Прочитай **два** целых числа (каждое на своей строке) и выведи их сумму.",
              xpReward: 15,
              explanation:
                "Два числа — значит два вызова `sc.nextInt()`. Каждый вызов забирает очередное значение и запоминает позицию, поэтому второй `nextInt()` прочитает **следующее** число, даже если оно на новой строке.\n\nЗаведи две переменные и напечатай их сумму. Обрати внимание на второй тест-кейс: там есть отрицательное число `-1`, и ответ `9` — программа должна работать с любыми целыми.\n\n💡 `nextInt()` сам пропускает пробелы и переводы строк, «дочитывать» вручную ничего не нужно.",
              starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // два nextInt и сумма
    }
}`,
              testCases: [
                { stdin: "3\n4", expectedOutput: "7" },
                { stdin: "-1\n10", expectedOutput: "9" },
              ],
              hints: [
                "Достаточно двух вызовов sc.nextInt() — он сам переходит через перевод строки.",
                "System.out.println(a + b);",
              ],
            },
          ],
        },
        {
          id: "io-strings",
          title: "Читаем строки",
          theory: `\`sc.next()\` читает **одно слово** до пробела или перевода строки:

\`\`\`java
String name = sc.next();
System.out.println("Привет, " + name + "!");
\`\`\`

> \`nextInt()\` не «съедает» перевод строки после числа, поэтому читать имя сразу после числа удобно именно через \`next()\` — он пропускает лишние пробельные символы.`,
          exercises: [
            {
              id: "scan-3",
              type: "code",
              prompt: "Прочитай имя (одно слово) и выведи `Привет, <имя>!`",
              xpReward: 15,
              explanation:
                "Теперь читаем **текст**, а не число. Для одного слова подходит `String name = sc.next();` — метод берёт символы до ближайшего пробела или перевода строки.\n\nСобери приветствие склеиванием: `\"Привет, \" + name + \"!\"`. Пробел после запятой и восклицательный знак — часть строки, тест проверяет их наличие.\n\n💡 Попробуй в консоли ввести имя с пробелом (`Аня Петрова`) — увидишь, что `next()` вернёт только `Аня`. Так работает этот метод, и это важно помнить.",
              starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // имя и приветствие
    }
}`,
              testCases: [
                { stdin: "Аня", expectedOutput: "Привет, Аня!" },
                { stdin: "Max", expectedOutput: "Привет, Max!" },
              ],
              hints: [
                "String name = sc.next();",
                'Формат вывода: "Привет, " + name + "!"',
              ],
            },
            {
              id: "scan-4",
              type: "code",
              prompt:
                "Прочитай число и слово, каждое с новой строки, и выведи `<слово>: <число>`.",
              xpReward: 15,
              explanation:
                "Смешанный ввод: сначала **число**, потом **слово**. Порядок чтения должен совпадать с порядком данных в stdin — сначала `sc.nextInt()`, затем `sc.next()`.\n\nСобери вывод в формате `<слово>: <число>`. Обрати внимание: в ответе слово идёт **первым**, хотя прочитано вторым — просто склеивай в нужном порядке: `word + \": \" + number`.\n\nОтдельная тонкость: не забудь пробел после двоеточия, иначе получится `Аня:17` вместо `Аня: 17`.",
              starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // число, затем слово
    }
}`,
              testCases: [
                { stdin: "17\nАня", expectedOutput: "Аня: 17" },
                { stdin: "30\nQuest", expectedOutput: "Quest: 30" },
              ],
              hints: [
                "Число читается через sc.nextInt(), слово — через sc.next().",
                'Не забудь пробел после двоеточия: word + ": " + number.',
              ],
            },
            {
              id: "io-quiz",
              type: "multiple_choice",
              prompt: "Что прочитает `sc.next()` из ввода `Hello World`?",
              xpReward: 5,
              options: ["Hello", "Hello World", "World", "Вызовет ошибку"],
              answerIndex: 0,
              explanation:
                "next() читает только одно слово до пробела — «Hello». Для всей строки целиком есть nextLine().",
            },
          ],
        },
      ],
    },
    // ---------- Модули 4–13 ----------
    conditionsModule,
    loopsModule,
    arraysModule,
    methodsModule,
    stringsModule,
    oopBasicsModule,
    oopAdvancedModule,
    collectionsModule,
    exceptionsModule,
    projectsModule,
  ],
};