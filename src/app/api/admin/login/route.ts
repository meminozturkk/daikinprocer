import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/forms";
import { COOKIE_NAME, createAdminSessionToken, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`admin-login:${ip}`)) {
    return NextResponse.json(
      { message: "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { message: "Geçersiz yönetici şifresi" },
        { status: 401 },
      );
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ ok: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Geçersiz istek" },
      { status: 400 },
    );
  }
}
