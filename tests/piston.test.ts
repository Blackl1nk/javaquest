import { describe, expect, it } from "vitest";
import { friendlyCompileError, normalizeOutput } from "@/lib/piston";

describe("normalizeOutput", () => {
  it("убирает \\r и хвостовые пробелы", () => {
    expect(normalizeOutput("Hello, Java!\r\n")).toBe("Hello, Java!");
    expect(normalizeOutput("Java  \nQuest\t")).toBe("Java\nQuest");
  });

  it("убирает пустые строки в конце", () => {
    expect(normalizeOutput("42\n\n\n")).toBe("42");
  });

  it("сохраняет внутренние пробелы и пустые строки внутри", () => {
    expect(normalizeOutput("a b\n\nc")).toBe("a b\n\nc");
  });

  it("считает эквивалентными выводы, различающиеся только хвостом", () => {
    expect(normalizeOutput("10\r\n")).toBe(normalizeOutput("10"));
  });
});

describe("friendlyCompileError", () => {
  it("добавляет подсказку для пропущенной точки с запятой", () => {
    const out = friendlyCompileError("Main.java:3: error: ';' expected\n  int x = 5");
    expect(out).toContain("';'");
    expect(out).toContain("💡");
  });

  it("обрезает длинный вывод компилятора до 6 строк", () => {
    const long = Array.from({ length: 20 }, (_, i) => `line ${i}`).join("\n");
    const out = friendlyCompileError(long);
    expect(out.split("\n").length).toBeLessThanOrEqual(6);
  });
});