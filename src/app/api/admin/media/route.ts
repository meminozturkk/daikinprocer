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
    const filesToProcess: File[] = [];

    const fromFiles = formData.getAll("files");
    const fromFile = formData.getAll("file");

    for (const item of [...fromFiles, ...fromFile]) {
      if (item && typeof item === "object" && "arrayBuffer" in item && (item as File).size > 0) {
        filesToProcess.push(item as File);
      }
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ message: "Lütfen bir dosya seçin" }, { status: 400 });
    }

    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const savedFiles: { name: string; url: string; size: number }[] = [];

    for (const file of filesToProcess) {
      const ext = path.extname(file.name).toLowerCase();
      const mime = file.type;
      const isValidMime =
        ALLOWED_MIME_TYPES.has(mime) ||
        [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext);

      if (!isValidMime) {
        return NextResponse.json(
          { message: `"${file.name}" geçersiz dosya türü. Yalnızca JPG, PNG, WEBP, GIF ve SVG yükleyebilirsiniz.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: `"${file.name}" dosya boyutu çok büyük. Maksimum dosya boyutu 10MB'dır.` },
          { status: 400 }
        );
      }

      const safeName = sanitizeFilename(file.name);
      const targetPath = path.join(UPLOADS_DIR, safeName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(targetPath, buffer);

      savedFiles.push({
        name: safeName,
        url: `/uploads/${safeName}`,
        size: file.size,
      });
    }

    return NextResponse.json({
      ok: true,
      file: savedFiles[0],
      files: savedFiles,
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
    let filename: string | null = null;
    const url = new URL(request.url);
    filename = url.searchParams.get("name") || url.searchParams.get("filename");

    if (!filename) {
      try {
        const body = await request.json();
        filename = body?.filename || body?.name || null;
      } catch {
        // ignore body parse error
      }
    }

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
