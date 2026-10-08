import type { CourseModule } from "@/content/types";

export const arraysModule: CourseModule = {
  id: "arrays",
  title: "Массивы",
  description: "Храним и обрабатываем наборы значений: списки чисел, таблицы, результаты игр.",
  published: true,
  lessons: [
    {
      id: "basics",
      title: "Создание и доступ",
      theory: `**Массив** — коробка с пронумерованными ячейками. Нумерация начинается с **нуля**:

\`\`\`java
int[] a = {10, 20, 30, 40}; // сразу со значениями
int[] b = new int[5];       // пять нулей

System.out.println(a[0]);   // 10 — первый элемент
System.out.println(a.length); // 4 — длина
a[2] = 99;                  // заменили третий элемент
\`\`\`

Обращение к несуществующему индексу (например, \`a[4]\` при длине 4) выбрасывает \`ArrayIndexOutOfBoundsException\` — запомни эту ошибку, она ещё встретится.`,
      exercises: [
        {
          id: "arr1",
          type: "code",
          prompt: "Дан массив `int[] a = {10, 20, 30, 40};` — выведи сумму его элементов.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        int[] a = {10, 20, 30, 40};
        // перебери и сложи
    }
}`,
          testCases: [{ expectedOutput: "100" }],
          hints: [
            "int sum = 0; затем for (int i = 0; i < a.length; i++) sum += a[i];",
          ],
        },
        {
          id: "arr2",
          type: "code",
          prompt: "Дан массив `int[] a = {10, 20, 30, 40};` — выведи количество элементов.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        int[] a = {10, 20, 30, 40};
        // у массива есть встроенное свойство
    }
}`,
          testCases: [{ expectedOutput: "4" }],
          hints: ["a.length — длина массива (без скобок, это не метод)"],
        },
        {
          id: "arr-quiz1",
          type: "multiple_choice",
          prompt: "Какой индекс у первого элемента массива в Java?",
          xpReward: 5,
          options: ["0", "1", "-1", "Зависит от типа массива"],
          answerIndex: 0,
          explanation: "Индексация начинается с нуля: первый элемент — a[0], последний — a[a.length - 1].",
        },
      ],
    },
    {
      id: "iterate",
      title: "Перебор и поиск",
      theory: `Перебрать массив можно классическим \`for\` или сокращённым **for-each**:

\`\`\`java
int[] a = {4, 9, 2, 7};

for (int i = 0; i < a.length; i++) {
    System.out.println(a[i]); // с индексом
}

for (int x : a) {
    System.out.println(x);    // «для каждого x из a»
}
\`\`\`

Поиск максимума — типовой приём: запомни первый элемент как максимум и сравнивай с ним остальные.`,
      exercises: [
        {
          id: "arr3",
          type: "code",
          prompt: "Дан массив `int[] a = {4, 9, 2, 7};` — выведи наибольший элемент.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        int[] a = {4, 9, 2, 7};
        // найди максимум
    }
}`,
          testCases: [{ expectedOutput: "9" }],
          hints: [
            "int max = a[0]; затем сравнивай каждый элемент: if (x > max) max = x;",
          ],
        },
        {
          id: "arr4",
          type: "code",
          prompt: "Дан массив `int[] a = {2, 1, 4, 7, 8};` — посчитай, сколько в нём чётных чисел, и выведи это количество.",
          xpReward: 10,
          starterCode: `public class Main {
    public static void main(String[] args) {
        int[] a = {2, 1, 4, 7, 8};
        // считай чётные
    }
}`,
          testCases: [{ expectedOutput: "3" }],
          hints: ["Счётчик count = 0; увеличивай, когда x % 2 == 0"],
        },
        {
          id: "arr5",
          type: "code",
          prompt: "Прочитай число n, затем n целых чисел (каждое с новой строки). Выведи их в обратном порядке, каждое на своей строке.",
          xpReward: 15,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        // прочитай в массив, затем выведи с конца
    }
}`,
          testCases: [
            { stdin: "3\n10\n20\n30", expectedOutput: "30\n20\n10" },
            { stdin: "1\n99", expectedOutput: "99" },
          ],
          hints: [
            "Читай в цикле: a[i] = sc.nextInt();",
            "Выводи в цикле от i = n - 1 вниз до 0: for (int i = n - 1; i >= 0; i--)",
          ],
        },
        {
          id: "arr-quiz2",
          type: "multiple_choice",
          prompt: "Чем удобен цикл `for (int x : a)` для перебора массива?",
          xpReward: 5,
          options: [
            "Не нужен индекс — нельзя ошибиться в границах",
            "Работает в два раза быстрее",
            "Позволяет изменить размер массива",
            "Перебирает массив в обратном порядке",
          ],
          answerIndex: 0,
          explanation:
            "for-each сам достаёт каждый элемент — не нужно ни a[i], ни a.length. Но индекса при этом нет.",
        },
      ],
    },
    {
      id: "matrix",
      title: "Двумерные массивы",
      theory: `Массив может хранить массивы — получается **таблица**:

\`\`\`java
int[][] m = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

System.out.println(m[1][2]); // 6 — вторая строка, третий столбец
\`\`\`

Первый индекс — строка, второй — столбец. Главная диагональ таблицы — элементы, где номер строки равен номеру столбца: \`m[i][i]\`.`,
      exercises: [
        {
          id: "arr6",
          type: "code",
          prompt: "Дана матрица `int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};` — выведи сумму элементов главной диагонали (m[0][0], m[1][1], m[2][2]).",
          xpReward: 15,
          starterCode: `public class Main {
    public static void main(String[] args) {
        int[][] m = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        // сложи m[i][i]
    }
}`,
          testCases: [{ expectedOutput: "15" }],
          hints: ["Диагональ — элементы, где индекс строки равен индексу столбца", "for (int i = 0; i < 3; i++) sum += m[i][i];"],
        },
        {
          id: "arr-quiz3",
          type: "multiple_choice",
          prompt: "Как получить элемент во 2-й строке и 3-м столбце матрицы `m` (нумерация с нуля)?",
          xpReward: 5,
          options: ["m[1][2]", "m[2][3]", "m[2][1]", "m[3][2]"],
          answerIndex: 0,
          explanation: "Сначала строка, потом столбец. «2-я строка» при нумерации с нуля — это индекс 1.",
        },
      ],
    },
  ],
};