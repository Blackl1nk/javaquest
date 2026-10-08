import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(1, "Имя обязательно").max(50),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов").max(100),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "email_taken", message: "Этот email уже зарегистрирован — попробуй войти" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await db.user.create({
      data: { name: parsed.data.name, email, passwordHash },
    });

    return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });
  } catch (e) {
    // Сюда попадаем, если БД недоступна или таблицы не созданы (частая причина
    // на свежем хостинге: не применена схема / не задан DATABASE_URL).
    console.error("[register] database error:", e);
    return NextResponse.json(
      {
        error: "server_error",
        message:
          "Сервер не смог сохранить аккаунт: база данных недоступна. Напиши администратору сайта (проблема на стороне сервера, не в твоих данных).",
      },
      { status: 503 }
    );
  }
}