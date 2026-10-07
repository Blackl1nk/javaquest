import { describe, expect, it } from "vitest";
import { localJdkAvailable, normalizeOutput, runLocalJava } from "@/lib/local-java";

const HELLO = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`;

describe.skipIf(!localJdkAvailable())("локальный JDK-раннер", () => {
  it("компилирует и запускает hello, тест проходит", async () => {
    const r = await runLocalJava(HELLO, [{ expectedOutput: "Hello, Java!" }], 5000);
    expect(r.kind).toBe("passed");
    expect(r.tests?.[0].pass).toBe(true);
  }, 20_000);

  it("stdin-тест: Scanner читает число (x*2)", async () => {
    const code = `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(sc.nextInt() * 2);
    }
}`;
    const r = await runLocalJava(code, [{ stdin: "5", expectedOutput: "10" }], 5000);
    expect(r.kind).toBe("passed");
  }, 20_000);

  it("неверный вывод → failed с результатами тестов", async () => {
    const r = await runLocalJava(HELLO, [{ expectedOutput: "Другой текст" }], 5000);
    expect(r.kind).toBe("failed");
    expect(r.tests?.[0].pass).toBe(false);
    expect(r.tests?.[0].actual).toContain("Hello, Java!");
  }, 20_000);

  it("ошибка компиляции → compile_error", async () => {
    const r = await runLocalJava("public class Main { broken", [{ expectedOutput: "" }], 5000);
    expect(r.kind).toBe("compile_error");
    expect(r.compileError).toBeTruthy();
  }, 20_000);

  it("бесконечный цикл → таймаут, тест не проходит", async () => {
    const r = await runLocalJava(
      `public class Main { public static void main(String[] a) { while (true) {} } }`,
      [{ expectedOutput: "никогда" }],
      2000
    );
    expect(r.kind).toBe("failed");
    expect(r.tests?.[0].pass).toBe(false);
    expect(r.tests?.[0].stderr).toContain("Превышен лимит времени");
  }, 20_000);

  it("кириллица не искажается", async () => {
    const code = `public class Main {
    public static void main(String[] args) {
        System.out.println("Привет, Аня!");
    }
}`;
    const r = await runLocalJava(code, [{ expectedOutput: "Привет, Аня!" }], 5000);
    expect(r.kind).toBe("passed");
  }, 20_000);
});

describe("normalizeOutput (общая утилита)", () => {
  it("нормализует CRLF и хвосты", () => {
    expect(normalizeOutput("Java\r\nQuest\r\n")).toBe("Java\nQuest");
  });
});