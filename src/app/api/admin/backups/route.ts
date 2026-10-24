import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";
import {
  getSiteContent,
  listBackups,
  restoreBackup,
  createManualBackup,
  deleteBackup,
  getBackupContent,
} from "@/lib/site-content";

export async function GET(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const download = searchParams.get("download") === "true";

  if (filename && download) {
    const backupRes = await getBackupContent(filename);
    if (!backupRes.success || !backupRes.raw) {
      return NextResponse.json({ message: backupRes.error || "Yedek bulunamadı" }, { status: 404 });
    }

    return new NextResponse(backupRes.raw, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  const backups = await listBackups();
  return NextResponse.json({ ok: true, backups });
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || (body.filename ? "restore" : "create");

    // Action: Create manual backup
    if (action === "create") {
      const title = typeof body.title === "string" ? body.title.trim().slice(0, 150) : "";
      const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : "";

      const res = await createManualBackup({ title, note });
      if (!res.success) {
        return NextResponse.json({ message: res.error || "Yedek oluşturulamadı" }, { status: 500 });
      }

      const backups = await listBackups();
      return NextResponse.json({
        ok: true,
        message: "Manuel yedek başarıyla oluşturuldu.",
        filename: res.filename,
        backups,
      });
    }

    // Action: Restore backup
    if (action === "restore") {
      const { filename } = body;
      if (!filename || typeof filename !== "string") {
        return NextResponse.json({ message: "Geçersiz yedek dosya adı" }, { status: 400 });
      }

      const res = await restoreBackup(filename);
      if (!res.success) {
        return NextResponse.json({ message: res.error || "Geri yükleme başarısız" }, { status: 500 });
      }

      // Invalidate caches
      revalidatePath("/", "layout");
      revalidatePath("/blog");
      revalidatePath("/blog/[slug]", "page");
      revalidatePath("/urunler");
      revalidatePath("/sitemap.xml");

      const content = await getSiteContent();
      const backups = await listBackups();
      return NextResponse.json({ ok: true, content, backups });
    }

    return NextResponse.json({ message: "Bilinmeyen işlem" }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    let filename = searchParams.get("filename");

    if (!filename) {
      const body = await request.json().catch(() => ({}));
      filename = body.filename;
    }

    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ message: "Geçersiz yedek dosya adı" }, { status: 400 });
    }

    const res = await deleteBackup(filename);
    if (!res.success) {
      return NextResponse.json({ message: res.error || "Yedek silinemedi" }, { status: 500 });
    }

    const backups = await listBackups();
    return NextResponse.json({ ok: true, message: "Yedek silindi", backups });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Sunucu hatası";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
