"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message ?? "Не удалось зарегистрироваться");
          return;
        }
      }
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (login?.error) {
        setError("Неверный email или пароль");
        return;
      }
      router.push("/learn");
      router.refresh();
    } catch {
      setError("Что-то пошло не так. Попробуй ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <Field label="Имя (как к тебе обращаться)">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50}
            placeholder="Аня"
            className="w-full rounded-xl border border-border-soft bg-surface-2 px-4 py-2.5 text-sm outline-none transition focus:border-accent"
          />
        </Field>
      )}
      <Field label="Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-border-soft bg-surface-2 px-4 py-2.5 text-sm outline-none transition focus:border-accent"
        />
      </Field>
      <Field label="Пароль" hint={mode === "register" ? "минимум 6 символов" : undefined}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="••••••••"
          className="w-full rounded-xl border border-border-soft bg-surface-2 px-4 py-2.5 text-sm outline-none transition focus:border-accent"
        />
      </Field>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-strong px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent disabled:opacity-50"
      >
        {busy && <Loader2 className="size-4 animate-spin" />}
        {mode === "register" ? "Создать аккаунт" : "Войти"}
      </button>

      <p className="text-center text-sm text-muted">
        {mode === "register" ? (
          <>
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Войти
            </Link>
          </>
        ) : (
          <>
            Впервые здесь?{" "}
            <Link href="/register" className="text-accent hover:underline">
              Создать аккаунт
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-xs font-medium text-muted">
        {label}
        {hint && <span className="text-[10px] text-muted/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}