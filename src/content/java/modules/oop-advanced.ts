import type { CourseModule } from "@/content/types";

export const oopAdvancedModule: CourseModule = {
  id: "oop-advanced",
  title: "ООП: наследование и интерфейсы",
  description: "Строим иерархии классов и договоры поведения.",
  published: true,
  lessons: [
    {
      id: "inheritance",
      title: "Наследование",
      theory: `Класс может унаследовать поля и методы другого класса через \`extends\`:

\`\`\`java
class Animal {
    void sound() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Гав");  // переопределили поведение
    }
}
\`\`\`

\`Dog\` получил всё от \`Animal\`, но **переопределил** (\`@Override\`) метод \`sound()\`. Слово \`@Override\` не обязательно, но подскажет компилятору (и тебе), что ты хотел именно переопределить.`,
      exercises: [
        {
          id: "p1",
          type: "code",
          prompt: "Дан класс `Animal` с методом `sound()`, печатающим `...`. Создай класс `Dog`, наследующий Animal и переопределяющий `sound()` так, чтобы печаталось `Гав`. Программа уже вызывает `new Dog().sound()`.",
          xpReward: 15,
          starterCode: `class Animal {
    void sound() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    // переопредели sound()
}

public class Main {
    public static void main(String[] args) {
        new Dog().sound();
    }
}`,
          testCases: [{ expectedOutput: "Гав" }],
          hints: [
            "Внутри Dog объяви тот же метод: void sound() { ... }",
            'Тело: System.out.println("Гав"); а @Override — по желанию',
          ],
        },
        {
          id: "p-quiz1",
          type: "multiple_choice",
          prompt: "Что даёт запись `class Dog extends Animal`?",
          xpReward: 5,
          options: [
            "Dog наследует поля и методы Animal",
            "Animal наследует Dog",
            "Оба класса объединяются в один",
            "Dog становится интерфейсом",
          ],
          answerIndex: 0,
          explanation: "extends — «является»: собака является животным и получает его поведение по умолчанию.",
        },
      ],
    },
    {
      id: "polymorphism",
      title: "Полиморфизм",
      theory: `**Полиморфизм** — ссылка на родителя, объект ребёнка, поведение ребёнка:

\`\`\`java
Animal a = new Dog();  // переменная типа Animal, объект типа Dog
a.sound();             // вызовется Гав!
\`\`\`

Java смотрит на **реальный тип объекта**, а не на тип переменной. Поэтому можно собрать разнородных животных в один массив \`Animal[]\` и вызвать \`sound()\` у каждого — каждый откликнется по-своему.`,
      exercises: [
        {
          id: "p2",
          type: "code",
          prompt: "Создай классы `Animal` (sound → `...`), `Dog` (→ `Гав`) и `Cat` (→ `Мяу`). В main объяви переменную типа `Animal`, присвой ей `new Dog()` и вызови `sound()`.",
          xpReward: 15,
          starterCode: `class Animal {
    void sound() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Гав");
    }
}

class Cat extends Animal {
    void sound() {
        System.out.println("Мяу");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();
        // вызови sound()
    }
}`,
          testCases: [{ expectedOutput: "Гав" }],
          hints: ["Просто a.sound(); — вызовется метод Dog, не Animal"],
        },
        {
          id: "p3",
          type: "code",
          prompt: "Классы Animal/Dog/Cat уже готовы. Сложи в массив `Animal[]` объекты в порядке: Cat, Dog, Cat — и в цикле вызови `sound()` у каждого.",
          xpReward: 15,
          starterCode: `class Animal {
    void sound() {
        System.out.println("...");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Гав");
    }
}

class Cat extends Animal {
    void sound() {
        System.out.println("Мяу");
    }
}

public class Main {
    public static void main(String[] args) {
        // массив Animal[] и цикл
    }
}`,
          testCases: [{ expectedOutput: "Мяу\nГав\nМяу" }],
          hints: [
            "Animal[] zoo = { new Cat(), new Dog(), new Cat() };",
            "Перебери for-each и вызови animal.sound()",
          ],
        },
        {
          id: "p-quiz2",
          type: "multiple_choice",
          prompt: "Какой метод выполнится для `Animal a = new Cat(); a.sound();`?",
          xpReward: 5,
          options: [
            "Метод класса Cat",
            "Метод класса Animal",
            "Ошибка компиляции",
            "Сначала Animal, потом Cat",
          ],
          answerIndex: 0,
          explanation:
            "Переменная родительская, а поведение — наследника: Java смотрит на реальный тип объекта. Это и есть полиморфизм.",
        },
      ],
    },
    {
      id: "interfaces",
      title: "Интерфейсы",
      theory: `**Интерфейс** — договор: список методов, которые класс **обязан** реализовать:

\`\`\`java
interface Shape {
    double area();   // только объявление, без тела
}

class Square implements Shape {
    int side;

    Square(int side) {
        this.side = side;
    }

    public double area() {
        return side * side;
    }
}
\`\`\`

Класс может реализовать сколько угодно интерфейсов — в отличие от наследования (один родитель). Интерфейс описывает **что умеет** объект, а не кем он приходится.`,
      exercises: [
        {
          id: "p4",
          type: "code",
          prompt: "Дан интерфейс `Shape` с методом `double area()`. Создай класс `Square implements Shape` с полем `int side`, конструктором и реализацией area() (side²). Выведи площадь квадрата со стороной 4.",
          xpReward: 15,
          starterCode: `interface Shape {
    double area();
}

class Square implements Shape {
    int side;

    Square(int side) {
        this.side = side;
    }

    public double area() {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Shape s = new Square(4);
        System.out.println(s.area());
    }
}`,
          testCases: [{ expectedOutput: "16.0" }],
          hints: [
            "return side * side; — int умножение, но тип возврата double, Java расширит сама",
            "Метод интерфейса реализуется как public",
          ],
        },
        {
          id: "p-quiz3",
          type: "multiple_choice",
          prompt: "Что такое интерфейс в Java?",
          xpReward: 5,
          options: [
            "Договор: набор методов, которые класс обязан реализовать",
            "Родительский класс с готовым кодом",
            "Тип массива",
            "Приватное поле класса",
          ],
          answerIndex: 0,
          explanation:
            "Интерфейс описывает «что умеет» объект без деталей реализации. Класс подписывает договор словом implements.",
        },
      ],
    },
  ],
};