import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthForm } from "@/components/auth-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/learn");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-1 text-center text-2xl font-bold text-white">С возвращением!</h1>
      <p className="mb-8 text-center text-sm text-muted">Серия не ждёт — продолжай квест.</p>
      <div className="rounded-2xl border border-border-soft bg-surface p-6">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}