import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const nameWithoutExt = path.basename(originalName, ext);
  
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c",
    ğ: "g", Ğ: "g",
    ı: "i", İ: "i",
    ö: "o", Ö: "o",
    ş: "s", Ş: "s",
    ü: "u", Ü: "u",
  };

  const cleanBase = nameWithoutExt
    .split("")
    .map((c) => trMap[c] || c)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const safeBase = cleanBase || "gorsel";
  const timestamp = Date.now();
  return `${timestamp}-${safeBase}${ext}`;
}

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const dirents = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });

    const files = await Promise.all(
      dirents
        .filter((d) => d.isFile())
        .map(async (d) => {
          const filePath = path.join(UPLOADS_DIR, d.name);
          const stat = await fs.stat(filePath);
          return {
            name: d.name,
            url: `/uploads/${d.name}`,
            size: stat.size,
            createdAt: stat.mtimeMs,
          };
        })
    );

    // Sort newest first
    files.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ ok: true, files });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Medya dosyaları okunamadı";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "Lütfen bir dosya seçin" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Geçersiz dosya türü. Yalnızca JPG, PNG, WEBP, GIF ve SVG yükleyebilirsiniz." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Dosya boyutu çok büyük. Maksimum dosya boyutu 10MB'dır." },
        { status: 400 }
      );
    }

    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    const safeName = sanitizeFilename(file.name);
    const targetPath = path.join(UPLOADS_DIR, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(targetPath, buffer);

    return NextResponse.json({
      ok: true,
      file: {
        name: safeName,
        url: `/uploads/${safeName}`,
        size: file.size,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Dosya yüklenemedi";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const filename = body?.filename;

    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ message: "Dosya adı belirtilmedi" }, { status: 400 });
    }

    const safeName = path.basename(filename);
    const targetPath = path.join(UPLOADS_DIR, safeName);

    try {
      await fs.unlink(targetPath);
    } catch {
      return NextResponse.json({ message: "Dosya bulunamadı veya silinemedi" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Silme işlemi başarısız";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
