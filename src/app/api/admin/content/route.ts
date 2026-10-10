import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent, siteContentSchema } from "@/lib/site-content";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = siteContentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Geçersiz içerik verisi", errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const result = await saveSiteContent(parsed.data);
    if (!result.success) {
      return NextResponse.json({ message: result.error || "Kaydetme başarısız" }, { status: 500 });
    }

    // Invalidate full page cache & pages
    revalidatePath("/", "layout");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/urunler");
    revalidatePath("/urunler/[category]", "page");
    revalidatePath("/urunler/[category]/[product]", "page");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ ok: true, data: parsed.data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
