import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// На хостинге (Railway и подобных) платформа сама выставляет внешний домен,
// поэтому доверяем хосту, который пришёл в запросе. Без этого Auth.js v5
// отвечает «There is a problem with the server configuration» (UntrustedHost).
if (process.env.NODE_ENV === "production" && !process.env.AUTH_TRUST_HOST) {
  process.env.AUTH_TRUST_HOST = "true";
}

// Явная проверка секрета: без него Auth.js падает с невнятной «server configuration»,
// поэтому пишем в логи понятную причину.
if (!process.env.AUTH_SECRET) {
  console.error(
    "[auth] НЕ ЗАДАН AUTH_SECRET — вход и регистрация работать не будут. " +
      "Добавь переменную AUTH_SECRET в настройках хостинга (Railway → Variables)."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email и пароль",
      credentials: {
        email: { label: "Email" },
        password: { label: "Пароль", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email?.toString().toLowerCase().trim();
        const password = credentials?.password?.toString();
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});