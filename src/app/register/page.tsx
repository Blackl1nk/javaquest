import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/learn");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-1 text-center text-2xl font-bold text-white">Начни Java-квест</h1>
      <p className="mb-8 text-center text-sm text-muted">
        Аккаунт нужен, чтобы сохранять XP, стрики и прогресс.
      </p>
      <div className="rounded-2xl border border-border-soft bg-surface p-6">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}