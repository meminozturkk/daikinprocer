import { NextResponse } from "next/server";
import { checkRateLimit, quoteSchema } from "@/lib/forms";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`quote:${ip}`)) {
    return NextResponse.json(
      { message: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  const body = await request.json();
  const parsed = quoteSchema.safeParse({
    ...body,
    kvkk: body.kvkk === true || body.kvkk === "true" || body.kvkk === "on",
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Form doğrulanamadı",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ message: "OK" }, { status: 200 });
  }

  // Production: wire RESEND_API_KEY / SMTP via env. Logged for local/dev visibility.
  console.info("[teklif]", {
    name: parsed.data.name,
    phone: parsed.data.phone,
    city: parsed.data.city,
    productInterest: parsed.data.productInterest,
  });

  return NextResponse.json({ ok: true });
}
