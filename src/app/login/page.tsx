import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { auth } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

/** Понятная подсказка вместо «Server error», если конфигурация неполная. */
function ConfigWarning() {
  const missing: string[] = [];
  if (!process.env.AUTH_SECRET) missing.push("AUTH_SECRET");
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");

  if (missing.length === 0) return null;

  return (
    <div className="mb-4 rounded-xl border border-flame/40 bg-flame/10 px-4 py-3 text-left text-sm">
      <p className="flex items-center gap-2 font-semibold text-flame">
        <AlertTriangle className="size-4" /> Сайт настроен не полностью
      </p>
      <p className="mt-1 text-foreground/80">
        Не заданы переменные окружения: <strong>{missing.join(", ")}</strong>. Вход и регистрация не
        заработают, пока администратор сайта их не добавит в настройках хостинга.
      </p>
    </div>
  );
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/learn");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-1 text-center text-2xl font-bold text-white">С возвращением!</h1>
      <p className="mb-8 text-center text-sm text-muted">Серия не ждёт — продолжай квест.</p>
      <div className="rounded-2xl border border-border-soft bg-surface p-6">
        <ConfigWarning />
        <AuthForm mode="login" />
      </div>
    </div>
  );
}