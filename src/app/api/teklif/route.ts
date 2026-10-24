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

  // Save to leads database
  const { saveLead } = await import("@/lib/leads");
  const { getSiteContent } = await import("@/lib/site-content");

  const newLead = await saveLead({
    type: "teklif",
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    city: parsed.data.city,
    productInterest: parsed.data.productInterest,
    message: parsed.data.message,
  });

  // Generate WhatsApp notification URL
  const siteContent = await getSiteContent();
  const rawWa = siteContent.contact.whatsapp || siteContent.contact.phoneMobile || "905448802220";
  let cleanWa = rawWa.replace(/\D/g, "");
  if (cleanWa.startsWith("0")) cleanWa = "90" + cleanWa.slice(1);
  if (!cleanWa.startsWith("90")) cleanWa = "90" + cleanWa;

  const waText = [
    "🔔 *YENİ TEKLİF TALEBİ* (Daikin Proser Web)",
    `👤 *Ad Soyad:* ${parsed.data.name}`,
    `📞 *Telefon:* ${parsed.data.phone}`,
    parsed.data.city ? `📍 *Bölge / İlçe:* ${parsed.data.city}` : "",
    parsed.data.productInterest ? `❄️ *Ürün / Sistem:* ${parsed.data.productInterest}` : "",
    parsed.data.message ? `📝 *Mesaj:* ${parsed.data.message}` : "",
    `🆔 *Kayıt No:* ${newLead.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waText)}`;

  return NextResponse.json({
    ok: true,
    leadId: newLead.id,
    whatsappUrl,
    message: "Talebiniz başarıyla kaydedildi.",
  });
}
