import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SITE_ACCESS_COOKIE,
  SITE_ACCESS_VALUE,
} from "@/lib/site-access";

export async function POST(request: Request) {
  const sitePassword = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!sitePassword) {
    return NextResponse.json({ ok: true });
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";

  if (password !== sitePassword) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SITE_ACCESS_COOKIE, SITE_ACCESS_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SITE_ACCESS_COOKIE);
  return NextResponse.json({ ok: true });
}
