import type { CourseModule } from "@/content/types";

export const collectionsModule: CourseModule = {
  id: "collections",
  title: "Коллекции: ArrayList и HashMap",
  description: "Гибкие списки и словари для реальных задач.",
  published: true,
  lessons: [
    {
      id: "arraylist",
      title: "ArrayList",
      theory: `Массив не умеет расти. \`ArrayList\` — список, который меняет размер сам:

\`\`\`java
import java.util.ArrayList;

ArrayList<Integer> list = new ArrayList<>();
list.add(5);        // добавить в конец
list.add(10);
System.out.println(list.size());  // 2
System.out.println(list.get(0));  // 5 — по индексу, как в массиве
\`\`\`

В угловых скобках — **тип элементов** (generics). Для чисел используется обёртка \`Integer\`, а не \`int\` — пока просто запомни. Перебирать можно обычным for или for-each.`,
      exercises: [
        {
          id: "c1",
          type: "code",
          prompt: "Создай `ArrayList<Integer>`, добавь числа 1, 2 и 3 и выведи размер списка.",
          xpReward: 10,
          explanation:
            "Список уже создан за тебя, осталось его наполнить: три вызова `list.add(...)` с числами 1, 2 и 3 — каждый кладёт элемент в конец. Затем выведи `list.size()`.\n\nНе перепутай: у массива длина — это `a.length` (свойство, без скобок), а у `ArrayList` — метод `size()` **со скобками**.",
          starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        // добавь элементы и выведи размер
    }
}`,
          testCases: [{ expectedOutput: "3" }],
          hints: ["list.add(1); list.add(2); list.add(3);", "Размер — list.size()"],
        },
        {
          id: "c2",
          type: "code",
          prompt: "Создай `ArrayList<Integer>` с числами 5, 10 и 15 и выведи их сумму (перебери циклом).",
          xpReward: 10,
          explanation:
            "Добавь три числа через `add` и заведи счётчик суммы `int sum = 0`. Дальше перебери список циклом **for-each**: `for (int x : list)` — он сам достаёт каждый элемент, и ни индекс, ни `size()` не нужны. Внутри цикла накапливай: `sum += x;`.\n\nВыводи `sum` уже **после** цикла, иначе получишь несколько строк вместо одной.",
          starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();
        // сумма элементов
    }
}`,
          testCases: [{ expectedOutput: "30" }],
          hints: ["for (int x : list) sum += x; — for-each работает и со списками"],
        },
        {
          id: "c3",
          type: "code",
          prompt: "Прочитай число n, затем n целых чисел (с новых строк), сохраняя их в ArrayList. Выведи наибольший элемент.",
          xpReward: 15,
          starterCode: `import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        ArrayList<Integer> list = new ArrayList<>();
        // прочитай n чисел и найди максимум
    }
}`,
          explanation:
            "Сначала прочитай `n` — сколько чисел будет дальше. Затем циклом от 0 до `n` читай числа и складывай их в список: `list.add(sc.nextInt())`.\n\nМаксимум ищи так: возьми за стартовое значение **первый** элемент (`list.get(0)`), а потом в цикле сравнивай с остальными и обновляй, если встретилось больше.\n\nПервый тест-кейс даёт на вход `4`, потом `3 9 1 6` — каждое число на своей строке, `nextInt()` сам перешагивает переводы строк. Второй кейс — единственное отрицательное число, и ответ должен быть `-7`: поэтому не начинай максимум с нуля!",
          testCases: [
            { stdin: "4\n3\n9\n1\n6", expectedOutput: "9" },
            { stdin: "1\n-7", expectedOutput: "-7" },
          ],
          hints: [
            "Читай в цикле: list.add(sc.nextInt());",
            "Начни максимум с первого элемента: int max = list.get(0);",
          ],
        },
        {
          id: "c-quiz1",
          type: "multiple_choice",
          prompt: "Чем ArrayList удобнее обычного массива?",
          xpReward: 5,
          options: [
            "Может расти и уменьшаться во время работы программы",
            "Хранит только строки",
            "Всегда работает быстрее",
            "Не требует import",
          ],
          answerIndex: 0,
          explanation:
            "Размер массива фиксирован при создании, а ArrayList добавляет и удаляет элементы на ходу.",
        },
      ],
    },
    {
      id: "hashmap",
      title: "HashMap",
      theory: `\`HashMap\` — словарь: хранит пары **ключ → значение** и находит значение по ключу мгновенно:

\`\`\`java
import java.util.HashMap;

HashMap<String, Integer> map = new HashMap<>();
map.put("apple", 3);          // положить пару
map.put("banana", 5);

System.out.println(map.get("banana")); // 5 — по ключу
System.out.println(map.size());        // 2 — количество пар
\`\`\`

Здесь ключи — строки, значения — числа. Как настоящий словарь: слово → перевод.`,
      exercises: [
        {
          id: "c4",
          type: "code",
          prompt: "Создай `HashMap<String, Integer>`, положи «apple» → 3 и «banana» → 5, и выведи значение по ключу «banana».",
          xpReward: 10,
          explanation:
            "`HashMap` — это словарь из пар «ключ → значение». Кладём пару методом `put(ключ, значение)`: сначала `\"apple\"` → `3`, потом `\"banana\"` → `5`.\n\nДостать значение обратно можно по ключу: `map.get(\"banana\")` вернёт `5`. Ключ здесь — строка, поэтому обязательно в **двойных кавычках**.\n\n🔥 Подводный камень: у `get` не бывает опечаток — если ключа нет, он вернёт `null`, и программа упадёт при печати. Пиши ключ ровно так же, как клал.",
          starterCode: `import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        // положи пары и выведи значение по ключу
    }
}`,
          testCases: [{ expectedOutput: "5" }],
          hints: [
            'map.put("banana", 5);',
            'Значение по ключу: map.get("banana")',
          ],
        },
        {
          id: "c5",
          type: "code",
          prompt: "Создай `HashMap<String, Integer>` с парами «a»→1, «b»→2, «c»→3 и выведи размер словаря.",
          xpReward: 10,
          explanation:
            "Три вызова `put` — по одному на пару: `\"a\"` → `1`, `\"b\"` → `2`, `\"c\"` → `3`. Ключи разные, поэтому в словаре окажутся три отдельные записи.\n\nРазмер словаря — это `map.size()`, он считает **количество пар**, а не сумму значений. Ожидаемый ответ — `3`.",
          starterCode: `import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        // три пары put и размер
    }
}`,
          testCases: [{ expectedOutput: "3" }],
          hints: ["Три map.put(...), затем map.size()"],
        },
        {
          id: "c-quiz2",
          type: "multiple_choice",
          prompt: "Что хранит HashMap?",
          xpReward: 5,
          options: [
            "Пары «ключ → значение»",
            "Только целые числа",
            "Только отсортированные строки",
            "Ровно один объект",
          ],
          answerIndex: 0,
          explanation:
            "HashMap — словарь: по ключу мгновенно находится значение. Типы ключей и значений задаются в угловых скобках.",
        },
      ],
    },
  ],
};