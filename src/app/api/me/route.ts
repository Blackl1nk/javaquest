import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/gamification";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const profile = await getUserProfile(userId);
  return NextResponse.json({ ok: true, profile });
}