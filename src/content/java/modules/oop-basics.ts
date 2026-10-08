import type { CourseModule } from "@/content/types";

export const oopBasicsModule: CourseModule = {
  id: "oop-basics",
  title: "ООП: классы и объекты",
  description: "Создаём собственные типы данных — «чертежи» объектов с полями и поведением.",
  published: true,
  lessons: [
    {
      id: "intro",
      title: "Класс и объект",
      theory: `До сих пор наш \`Main\` был одним классом — теперь создадим **свои**. Класс — это чертёж: описание того, какие данные (поля) и действия (методы) есть у объекта.

\`\`\`java
class Car {
    String model;
    int year;
}

public class Main {
    public static void main(String[] args) {
        Car c = new Car();      // создали объект по чертежу
        c.model = "Toyota";
        c.year = 2020;
        System.out.println(c.model + " " + c.year);
    }
}
\`\`\`

Один класс — много объектов: \`new Car()\` можно звать сколько угодно, каждый будет со своими данными. Вспомогательный класс объявляется рядом с Main, но без слова \`public\` (в одном файле public-класс только один).`,
      exercises: [
        {
          id: "o1",
          type: "code",
          prompt: "Создай класс `Car` с полями `String model` и `int year`. В main создай объект, задай поля «Toyota» и 2020 и выведи их через пробел: `Toyota 2020`.",
          xpReward: 15,
          starterCode: `class Car {
    String model;
    int year;
}

public class Main {
    public static void main(String[] args) {
        // создай Car, заполни поля и выведи
    }
}`,
          testCases: [{ expectedOutput: "Toyota 2020" }],
          hints: [
            'Car c = new Car(); c.model = "Toyota"; c.year = 2020;',
            'Вывод: System.out.println(c.model + " " + c.year);',
          ],
          explanation:
            "Класс `Car` с полями `model` и `year` уже объявлен — создай объект и заполни его поля.\n\n" +
            "Объект создаётся оператором `new`: `Car c = new Car();` — переменная `c` хранит ссылку на экземпляр. Затем присвой поля через точку (`c.model = \"Toyota\";`, `c.year = 2020;`) и выведи их, склеив через `+` с пробелом посередине.\n\n" +
            "Подводный камень: `Car` объявлен **без** `public`, ведь в одном файле может быть только один public-класс — это `Main`. Добавишь `public` к `Car` — код не скомпилируется.",
        },
        {
          id: "o-quiz1",
          type: "multiple_choice",
          prompt: "Что делает оператор `new`?",
          xpReward: 5,
          options: [
            "Создаёт новый объект в памяти по чертежу класса",
            "Пересоздаёт класс",
            "Копирует файл",
            "Обнуляет переменную",
          ],
          answerIndex: 0,
          explanation: "new выделяет память под объект и возвращает ссылку на него.",
        },
      ],
    },
    {
      id: "constructor",
      title: "Конструктор и методы объекта",
      theory: `Заполнять поля руками неудобно. **Конструктор** — специальный метод, который вызывается при \`new\` и сразу настраивает объект:

\`\`\`java
class Rectangle {
    int width;
    int height;

    Rectangle(int w, int h) {   // имя = имени класса, без return-типа
        width = w;
        height = h;
    }

    int area() {                // метод объекта
        return width * height;
    }
}

// Rectangle r = new Rectangle(4, 5);
// r.area() → 20
\`\`\`

Метод объекта работает с полями своего экземпляра: у каждого прямоугольника своя площадь.`,
      exercises: [
        {
          id: "o2",
          type: "code",
          prompt: "Создай класс `Rectangle` с полями `int width`, `int height`, конструктором `Rectangle(int w, int h)` и методом `int area()`. Выведи площадь прямоугольника 4 на 5.",
          xpReward: 15,
          starterCode: `class Rectangle {
    int width;
    int height;

    Rectangle(int w, int h) {
        // сохрани размеры
    }

    int area() {
        // верни площадь
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Rectangle r = new Rectangle(4, 5);
        System.out.println(r.area());
    }
}`,
          testCases: [{ expectedOutput: "20" }],
          hints: [
            "В конструкторе: width = w; height = h;",
            "В area(): return width * height;",
          ],
          explanation:
            "Доделай класс `Rectangle`: конструктор сохраняет размеры в поля, а `area()` возвращает площадь.\n\n" +
            "Конструктор `Rectangle(int w, int h)` отличается от обычного метода тем, что его имя совпадает с именем класса и у него нет типа возврата. Внутри присвой `width = w;` и `height = h;` — так объект запомнит свои размеры. В `area()` верни `width * height` через `return`.\n\n" +
            "Подводный камень: у каждого объекта свои значения полей, поэтому «зашивать» числа прямо в `area()` нельзя. Заглушка `return 0;` компилируется, но даст неверный ответ.",
        },
        {
          id: "o3",
          type: "code",
          prompt: "Создай класс `Person` с полем `String name`, конструктором и методом `void greet()`, печатающим `Привет, я <name>!`. Выведи приветствие объекта с именем «Аня».",
          xpReward: 15,
          starterCode: `class Person {
    String name;

    Person(String n) {
        // сохрани имя
    }

    void greet() {
        // приветствие
    }
}

public class Main {
    public static void main(String[] args) {
        Person p = new Person("Аня");
        p.greet();
    }
}`,
          testCases: [{ expectedOutput: "Привет, я Аня!" }],
          hints: [
            "В конструкторе: name = n;",
            'В greet(): System.out.println("Привет, я " + name + "!");',
          ],
          explanation:
            "Научи класс `Person` запоминать имя и здороваться им.\n\n" +
            "В конструкторе `Person(String n)` сохрани параметр в поле: `name = n;`. Метод `greet()` объявлен как `void` — он ничего не возвращает, только печатает, поэтому внутри просто вызови `System.out.println(...)`, склеив текст приветствия с полем `name` через `+`.\n\n" +
            "Подводный камень: в `greet()` обращайся к полю `name`, а не к параметру `n` — параметр живёт только внутри конструктора. Следи и за точным текстом: `Привет, я Аня!`.",
        },
        {
          id: "o-quiz2",
          type: "multiple_choice",
          prompt: "Конструктор — это…",
          xpReward: 5,
          options: [
            "Специальный метод для начальной настройки объекта, вызывается при new",
            "Любой метод класса",
            "Копия метода main",
            "Тип переменной",
          ],
          answerIndex: 0,
          explanation:
            "Имя конструктора совпадает с именем класса, возвращаемого типа у него нет, вызывается автоматически при new.",
        },
      ],
    },
    {
      id: "encapsulation",
      title: "private и инкапсуляция",
      theory: `Поля можно закрыть от прямого доступа словом \`private\` — работать с ними разрешается только через методы самого класса:

\`\`\`java
class Counter {
    private int count;   // снаружи не видно!

    void inc() {
        count++;
    }

    int get() {
        return count;
    }
}
\`\`\`

Это **инкапсуляция**: данные спрятаны, а снаружи есть аккуратные кнопки. Так невозможно случайно испортить счётчик, присвоив ему что попало (\`c.count = -999;\` уже не скомпилируется).`,
      exercises: [
        {
          id: "o4",
          type: "code",
          prompt: "Создай класс `Counter` с приватным полем `int count`, методом `void inc()` (увеличивает на 1) и методом `int get()`. В main создай счётчик, вызови inc() трижды и выведи get().",
          xpReward: 15,
          starterCode: `class Counter {
    private int count;

    void inc() {
        // +1
    }

    int get() {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Counter c = new Counter();
        c.inc();
        c.inc();
        c.inc();
        System.out.println(c.get());
    }
}`,
          testCases: [{ expectedOutput: "3" }],
          hints: [
            "В inc(): count++;",
            "В get(): return count;",
          ],
          explanation:
            "Счётчик уже создан в `main` и трижды вызывает `inc()` — реализуй оба метода класса.\n\n" +
            "Поле `count` объявлено `private`, то есть снаружи класса к нему не обратиться (`c.count++` не скомпилируется) — в этом и смысл **инкапсуляции**. Внутри класса доступ есть: в `inc()` увеличивай счётчик на единицу (`count++;`), в `get()` возвращай значение через `return count;`.\n\n" +
            "Подводный камень: менять поле из `main` напрямую нельзя, с ним работают только методы класса. Заглушка `return 0;` в `get()` скомпилируется, но выведет `0` вместо `3`.",
        },
        {
          id: "o-quiz3",
          type: "multiple_choice",
          prompt: "Зачем делать поля класса приватными?",
          xpReward: 5,
          options: [
            "Чтобы защитить данные от прямого изменения снаружи",
            "Чтобы программа работала быстрее",
            "Чтобы экономить память",
            "Так требует компилятор",
          ],
          answerIndex: 0,
          explanation:
            "Инкапсуляция: доступ к данным только через методы класса, где можно проверить и проконтролировать каждое изменение.",
        },
      ],
    },
  ],
};