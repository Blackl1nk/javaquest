# JavaQuest 🎮

Интерактивный сайт для изучения **Java**: короткие уроки-миссии, живой редактор кода
с настоящим запуском программ на сервере, XP, уровни, стрики и достижения.
Формат «Duolingo для кода» — заходи каждый день, решай миссии, держи серию.

## Быстрый старт (без Docker)

Нужны только **Node.js 20+** и npm.

```bash
npm install
npx prisma db push   # создаёт локальную SQLite-базу prisma/dev.db
npm run dev
```

Открой <http://localhost:3000>, зарегистрируйся — и первый модуль уже доступен.

> По умолчанию БД — SQLite (файл `prisma/dev.db`), никаких внешних сервисов не требуется.
> Если на машине установлен JDK (например, Eclipse Temurin 21), Java-код в заданиях
> запускается сразу — Docker не нужен.

## Запуск Java-кода: два режима

Выбор бэкенда — переменная `RUNNER_BACKEND` в `.env` (`auto` | `local` | `piston`, по умолчанию `auto`).

### 1. Локальный JDK (`local`) — работает из коробки

Если в PATH есть `javac`/`java` (например, [Eclipse Temurin 21](https://adoptium.net/)),
код пользователя компилируется и запускается настоящим JDK прямо на сервере:
таймауты, лимит вывода, kill процесса по истечении времени, UTF-8 для кириллицы.
Это режим по умолчанию (`auto` предпочитает его и падает обратно на Piston).

> ⚠️ Локальный режим исполняет код без контейнерной изоляции — он рассчитан
> на **личный сайт/разработку**. Для публичного продакшена используй Piston в Docker.

### 2. Piston в Docker (`piston`) — для публичного продакшена

1. Установи [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Подними инфраструктуру и один раз установи рантайм Java (~200 МБ):

   ```bash
   docker compose up -d
   docker compose exec piston piston install java
   ```

3. В `.env` поставь `RUNNER_BACKEND="piston"` и перезапусти `npm run dev`.

## PostgreSQL (опционально)

Docker Compose поднимает и Postgres. Чтобы перейти на него:

1. Раскомментируй в `.env` строку
   `DATABASE_URL="postgresql://javaquest:javaquest@localhost:5432/javaquest"`.
2. В `prisma/schema.prisma` замени `provider = "sqlite"` на `provider = "postgresql"`.
3. `npx prisma db push`.

## Скрипты

| Команда            | Что делает                          |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Dev-сервер на :3000                 |
| `npm run build`    | Прод-сборка                         |
| `npm run start`    | Запуск прод-сборки                  |
| `npm test`         | Unit-тесты (vitest)                 |
| `npm run lint`     | ESLint                              |
| `npx prisma db push` | Синхронизация схемы с БД          |

## Как это устроено

```
src/
  app/
    page.tsx                # лендинг
    login/ register/        # авторизация (email + пароль, Auth.js)
    learn/                  # карта курса, модуль, урок
    profile/ leaderboard/   # профиль с достижениями, недельный рейтинг
    api/
      auth/[...nextauth]/   # Auth.js
      auth/register/        # регистрация (bcrypt + zod)
      run/                  # запуск кода в песочнице (rate-limit, лог попыток)
      submit/               # честная перепроверка + XP/стрик/достижения
      me/                   # профиль пользователя
  components/               # редактор (CodeMirror), карточка задания, статистика
  content/
    java/index.ts           # КОНТЕНТ КУРСА: модули → уроки → задания
  lib/
    gamification.ts         # XP, уровни, стрик, достижения (чистые функции + запись в БД)
    piston.ts               # диспетчер песочницы: local ↔ piston, подсказки к ошибкам
    local-java.ts           # локальный бэкенд: javac/java с таймаутами и лимитами вывода
    course.ts               # доступ к контенту, расчёт прогресса
  prisma/schema.prisma      # пользователи, прогресс, стрики, XP, достижения
docker-compose.yml          # Postgres + Piston
tests/                      # unit-тесты игровой логики и песочницы
```

### Игровая механика

- **XP за каждое задание** (за код — больше, за викторину — меньше). Повторное решение XP не даёт.
- **Уровни**: чтобы достичь уровня `L`, нужно `50·(L−1)·L` XP (ур. 2 = 100, ур. 3 = 300 …).
- **Стрик**: решай хотя бы одну миссию в день (UTC). Один пропущенный день спасает
  «заморозка» (стартует с одной, можно добавить за достижения).
- **Достижения** — `src/lib/gamification.ts`, массив `ACHIEVEMENTS`: первая программа,
  7/30 дней серии, 10 уроков, модуль целиком, половина курса и т.д.
- **Лидерборд** — XP за текущую неделю (с понедельника UTC).

### Как добавить уроки

Контент — код: открой `src/content/java/index.ts`, добавь модуль/урок/задание.
Для кодового задания задай `testCases: [{ stdin: "...", expectedOutput: "..." }]` —
сравнение идёт после нормализации (без `\r` и хвостовых пробелов).
Новые модули помечай `published: false`, пока не готово содержимое.

## Деплой на Railway

Код готов к Railway: `railway.json` описывает сборку и запуск, схема Postgres лежит в `prisma/schema.postgres.prisma`.

1. Залей репозиторий на GitHub (приватный — Railway умеет работать с приватными).
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → выбери репозиторий. Railway определит Next.js и применит `railway.json` (build: `prisma generate && next build`).
3. Добавь базу: в том же проекте **New** → **Database** → **PostgreSQL**.
4. В сервисе приложения открой **Variables** и добавь:

   | Переменная | Значение |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (ссылка на сервис базы) |
   | `AUTH_SECRET` | сгенерируй: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `AUTH_TRUST_HOST` | `true` (обязательно для NextAuth вне localhost) |
   | `RUNNER_BACKEND` | `piston` |
   | `PISTON_API_URL` | URL твоего Piston-сервиса (шаг 5) |

5. Java-песочница: на Railway в контейнере нет `javac`, поэтому подключи [Piston](https://github.com/engineer-man/piston) — через шаблон сообщества Railway («Piston») или VPS с Docker — и укажи его URL в `PISTON_API_URL`. Пока песочницы нет, сайт работает: викторины полностью доступны, кодовые задания показывают дружелюбную заглушку.
6. Deploy: Railway сам прогонит `prisma db push` против Postgres при старте (прописано в `startCommand` из `railway.json`) и поднимет сайт на выданном домене.

> Локальная разработка остаётся на SQLite — Postgres-схема нужна только продакшену. Модели дублируются в `schema.prisma` и `schema.postgres.prisma`: меняя модели, обновляй оба файла.

## Известные ограничения (v1)

- Вход — только email+пароль; Google OAuth не подключён.
- Из типов заданий реализованы «код» и «викторина» (fill-in-the-gap — в планах).
- Rate limit запусков кода — в памяти процесса (для продакшена заменить на Redis).
- При выводе кода сравнение неточное по внутренним пробелам строк (хвостовые обрезаются).
- Локальный бэкенд (`RUNNER_BACKEND=local`) не изолирует процессы контейнером —
  только для личного использования; публичный деплой делай через Piston в Docker.

## Дорожная карта

Google OAuth · заморозки за достижения в UI · редактирование цели дня ·
последовательная блокировка уроков · fill-in-the-gap задания ·
сердечки/жизни · спринты и лиги.