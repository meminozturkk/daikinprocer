import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAuthenticatedAdmin } from "@/lib/admin-auth";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CATALOG_DIR = path.join(PUBLIC_DIR, "sourced", "catalog");
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const UPLOADS_CATALOG_DIR = path.join(DATA_DIR, "uploads", "catalog");

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function sanitizeCatalogFilename(originalName: string): string {
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

  const safeBase = cleanBase || "katalog-gorsel";
  return `${safeBase}${ext}`;
}

async function scanPublicImages(dir: string, baseDir: string = dir): Promise<Array<{
  name: string;
  url: string;
  category: string;
  size: number;
  createdAt: number;
}>> {
  let results: Array<{
    name: string;
    url: string;
    category: string;
    size: number;
    createdAt: number;
  }> = [];

  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    for (const d of dirents) {
      if (d.name.startsWith(".")) continue;
      const fullPath = path.join(dir, d.name);

      if (d.isDirectory()) {
        const sub = await scanPublicImages(fullPath, baseDir);
        results = results.concat(sub);
      } else if (d.isFile()) {
        const ext = path.extname(d.name).toLowerCase();
        if (IMAGE_EXTENSIONS.has(ext)) {
          const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
          const url = `/${relativePath}`;
          const stat = await fs.stat(fullPath);

          let category = "other";
          if (url.includes("brand") || url.includes("logo") || url.includes("icon")) {
            category = "brand";
          } else if (url.includes("hero") || url.includes("campaigns")) {
            category = "hero";
          } else if (url.includes("references")) {
            category = "references";
          } else if (url.includes("catalog")) {
            category = "catalog";
          } else if (url.includes("misc") || url.includes("icons")) {
            category = "site";
          } else if (url.includes("blog")) {
            category = "blog";
          }

          results.push({
            name: d.name,
            url,
            category,
            size: stat.size,
            createdAt: stat.mtimeMs,
          });
        }
      }
    }
  } catch {
    // ignore
  }

  return results;
}

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const files = await scanPublicImages(PUBLIC_DIR, PUBLIC_DIR);

    // Sort alphabetically by relative url/name
    files.sort((a, b) => a.url.localeCompare(b.url, "tr"));

    return NextResponse.json({ ok: true, files, count: files.length });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Görseller okunamadı";
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

    await fs.mkdir(CATALOG_DIR, { recursive: true });

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

      const safeName = sanitizeCatalogFilename(file.name);
      const targetPath = path.join(CATALOG_DIR, safeName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(targetPath, buffer);

      // Also backup to persistent uploads if data dir exists
      try {
        await fs.mkdir(UPLOADS_CATALOG_DIR, { recursive: true });
        await fs.writeFile(path.join(UPLOADS_CATALOG_DIR, safeName), buffer);
      } catch {
        // Ignore backup error
      }

      savedFiles.push({
        name: safeName,
        url: `/sourced/catalog/${safeName}`,
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
        // Ignore JSON parse error
      }
    }

    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ message: "Dosya adı belirtilmedi" }, { status: 400 });
    }

    const safeName = path.basename(filename);
    const targetPath = path.join(CATALOG_DIR, safeName);

    try {
      await fs.unlink(targetPath);
    } catch {
      return NextResponse.json({ message: "Dosya bulunamadı veya silinemedi" }, { status: 404 });
    }

    // Also remove from backup if present
    try {
      await fs.unlink(path.join(UPLOADS_CATALOG_DIR, safeName));
    } catch {
      // Ignore
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Silme işlemi başarısız";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
