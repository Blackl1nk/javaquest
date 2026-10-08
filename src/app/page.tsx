import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Flame,
  Trophy,
  Zap,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getPublishedModules, course } from "@/lib/course";
import { plural } from "@/components/stats";

export default async function LandingPage() {
  const session = await auth();
  const modules = getPublishedModules();

  return (
    <div>
      {/* Hero */}
      <section className="hero-glow border-b border-border-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-3 py-1 text-xs font-medium text-muted">
            <Flame className="size-3.5 text-flame" />
            Java · интерактивно · каждый день
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">
            Учи Java как <span className="text-accent">квест</span>,
            <br className="hidden sm:block" /> а не как учебник
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">
            Короткие миссии вместо длинных глав, живой редактор кода вместо конспектов,
            XP и стрики вместо силы воли. Заходи каждый день — прогресс не даст остановиться.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {session?.user ? (
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-strong px-6 py-3 font-semibold text-white transition hover:bg-accent"
              >
                Продолжить обучение <ArrowRight className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-strong px-6 py-3 font-semibold text-white transition hover:bg-accent"
                >
                  Начать бесплатно <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-border-soft bg-surface px-6 py-3 font-semibold text-foreground transition hover:bg-surface-2"
                >
                  У меня есть аккаунт
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Фичи */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<Code2 className="size-5 text-aqua" />}
            title="Пишешь код с первой минуты"
            text="Каждая теория сразу превращается в миссию: запусти код, пройди тесты, получи XP."
          />
          <Feature
            icon={<Flame className="size-5 text-flame" />}
            title="Стрики держат в ритме"
            text="Решил хотя бы одну миссию — серия растёт. Пропустил день — заморозка спасёт."
          />
          <Feature
            icon={<Zap className="size-5 text-accent" />}
            title="XP и уровни"
            text="Виден прогресс в цифрах: XP за каждое задание, уровни за упорство."
          />
          <Feature
            icon={<Trophy className="size-5 text-success" />}
            title="Достижения и лидерборд"
            text="Бейджи за вехи пути и недельный рейтинг — немного здоровой конкуренции."
          />
        </div>
      </section>

      {/* Дорожная карта курса */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-2 text-2xl font-bold text-white">Путь героя: {course.title}</h2>
        <p className="mb-6 text-sm text-muted">
          13 модулей от «Hello, World!» до собственных классов и коллекций.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {course.modules.map((m, i) => (
            <div
              key={m.id}
              className={
                m.published
                  ? "rounded-xl border border-border-soft bg-surface p-4"
                  : "rounded-xl border border-border-soft/60 bg-surface/50 p-4 opacity-70"
              }
            >
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
                <span className="grid size-6 place-items-center rounded-md bg-surface-2 text-xs text-muted">
                  {i + 1}
                </span>
                {m.title}
                {!m.published && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
                    <Lock className="size-3" /> скоро
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-muted">{m.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-6 text-center">
          <h3 className="text-lg font-bold text-white">
            Весь путь открыт — с нуля до собственных проектов
          </h3>
          <p className="mt-1 text-sm text-muted">
            {modules.length} {plural(modules.length, "модуль", "модуля", "модулей")} ·{" "}
            {[...modules].flatMap((m) => m.lessons).length} уроков · живой запуск Java-кода
          </p>
          <Link
            href={session?.user ? "/learn" : "/register"}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-strong px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
          >
            <CheckCircle2 className="size-4" />
            {session?.user ? "К курсу" : "Создать аккаунт"}
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5">
      <div className="mb-3 grid size-10 place-items-center rounded-xl bg-surface-2">{icon}</div>
      <h3 className="mb-1 font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}