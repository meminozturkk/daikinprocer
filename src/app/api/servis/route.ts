import { NextResponse } from "next/server";
import { checkRateLimit, serviceRequestSchema } from "@/lib/forms";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (!checkRateLimit(`service:${ip}`)) {
    return NextResponse.json(
      { message: "Çok fazla istek. Lütfen biraz sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  const body = await request.json();
  const parsed = serviceRequestSchema.safeParse({
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
    type: "servis",
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    address: parsed.data.address,
    deviceType: parsed.data.deviceType,
    preferredTime: parsed.data.preferredTime,
    issue: parsed.data.issue,
  });

  // Generate WhatsApp notification URL
  const siteContent = await getSiteContent();
  const rawWa = siteContent.contact.whatsapp || siteContent.contact.phoneMobile || "905448802220";
  let cleanWa = rawWa.replace(/\D/g, "");
  if (cleanWa.startsWith("0")) cleanWa = "90" + cleanWa.slice(1);
  if (!cleanWa.startsWith("90")) cleanWa = "90" + cleanWa;

  const waText = [
    "🛠️ *YENİ SERVİS / BAKIM TALEBİ* (Daikin Proser Web)",
    `👤 *Ad Soyad:* ${parsed.data.name}`,
    `📞 *Telefon:* ${parsed.data.phone}`,
    parsed.data.address ? `🏠 *Adres:* ${parsed.data.address}` : "",
    parsed.data.deviceType ? `❄️ *Cihaz Tipi:* ${parsed.data.deviceType}` : "",
    parsed.data.preferredTime ? `⏰ *Uygun Zaman:* ${parsed.data.preferredTime}` : "",
    parsed.data.issue ? `⚠️ *Arıza / Açıklama:* ${parsed.data.issue}` : "",
    `🆔 *Kayıt No:* ${newLead.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waText)}`;

  return NextResponse.json({
    ok: true,
    leadId: newLead.id,
    whatsappUrl,
    message: "Servis talebiniz başarıyla kaydedildi.",
  });
}
