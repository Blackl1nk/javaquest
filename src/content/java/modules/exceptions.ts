import type { CourseModule } from "@/content/types";

export const exceptionsModule: CourseModule = {
  id: "exceptions",
  title: "Исключения",
  description: "Обрабатываем ошибки красиво: try/catch и собственные исключения.",
  published: true,
  lessons: [
    {
      id: "trycatch",
      title: "try и catch",
      theory: `Ошибка во время работы программы — **исключение**. Без обработки оно роняет программу. Блок \`try/catch\` ловит исключение и позволяет обработать его по-человечески:

\`\`\`java
try {
    int x = 10 / 0;   // ArithmeticException!
} catch (ArithmeticException e) {
    System.out.println("Ошибка деления");
}
System.out.println("программа жива");
\`\`\`

Схема: «попробуй сделать — если что-то пошло не так, сделай вот это». Программа не падает и продолжает работу после catch.`,
      exercises: [
        {
          id: "e1",
          type: "code",
          prompt: "В блоке try раздели 10 на 0, поймай ArithmeticException и выведи `Ошибка деления`. Программа не должна упасть.",
          xpReward: 15,
          starterCode: `public class Main {
    public static void main(String[] args) {
        // try { ... } catch (ArithmeticException e) { ... }
    }
}`,
          testCases: [{ expectedOutput: "Ошибка деления" }],
          hints: [
            "try { int x = 10 / 0; } catch (ArithmeticException e) { ... }",
            'В catch печатай "Ошибка деления"',
          ],
        },
        {
          id: "e2",
          type: "code",
          prompt: "Попробуй превратить строку \"abc\" в число через `Integer.parseInt`, поймай NumberFormatException и выведи `не число`.",
          xpReward: 15,
          starterCode: `public class Main {
    public static void main(String[] args) {
        String s = "abc";
        // parseInt и catch
    }
}`,
          testCases: [{ expectedOutput: "не число" }],
          hints: [
            "try { Integer.parseInt(s); } catch (NumberFormatException e) { ... }",
            'В catch печатай "не число"',
          ],
        },
        {
          id: "e-quiz1",
          type: "multiple_choice",
          prompt: "Что произойдёт, если исключение никто не поймает?",
          xpReward: 5,
          options: [
            "Программа аварийно завершится",
            "Исключение исчезнет само",
            "Java исправит ошибку",
            "Цикл начнётся заново",
          ],
          answerIndex: 0,
          explanation:
            "Необработанное исключение поднимается вверх и обрушивает программу — поэтому опасные места оборачивают в try/catch.",
        },
      ],
    },
    {
      id: "finally",
      title: "finally и ошибки на практике",
      theory: `Блок \`finally\` выполняется **всегда** — было исключение или нет. Там пишут «уборку»: закрыть файл, соединение:

\`\`\`java
try {
    System.out.println("работаю");
} finally {
    System.out.println("завершаю");  // выполнится в любом случае
}
\`\`\`

Типичный приём на практике — попробовать опасную операцию и в catch решить, что делать дальше: спросить у пользователя заново, подставить значение по умолчанию или сообщить об ошибке.`,
      exercises: [
        {
          id: "e3",
          type: "code",
          prompt: "Напиши try/finally: в try выведи `работаю`, в finally выведи `завершаю`.",
          xpReward: 15,
          starterCode: `public class Main {
    public static void main(String[] args) {
        // try / finally без catch
    }
}`,
          testCases: [{ expectedOutput: "работаю\nзавершаю" }],
          hints: [
            "catch здесь не нужен — try и finally допустимы без него",
            "finally выполнится независимо ни от чего",
          ],
        },
        {
          id: "e4",
          type: "code",
          prompt: "Прочитай строку. Если это целое число — выведи его квадрат; иначе выведи `не число`. Используй try/catch с Integer.parseInt.",
          xpReward: 15,
          starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.next();
        // parseInt в try, обработка в catch
    }
}`,
          testCases: [
            { stdin: "5", expectedOutput: "25" },
            { stdin: "-3", expectedOutput: "9" },
            { stdin: "abc", expectedOutput: "не число" },
          ],
          hints: [
            "В try: int x = Integer.parseInt(line); затем println(x * x);",
            "В catch (NumberFormatException e) печатай «не число»",
          ],
        },
        {
          id: "e-quiz2",
          type: "multiple_choice",
          prompt: "Когда выполнится блок `finally`?",
          xpReward: 5,
          options: [
            "Всегда — было исключение или нет",
            "Только если было исключение",
            "Только если исключения не было",
            "Никогда — это заглушка",
          ],
          answerIndex: 0,
          explanation:
            "finally — гарантированная уборка: выполняется и при ошибке, и при её отсутствии, и даже при return внутри try.",
        },
      ],
    },
  ],
};