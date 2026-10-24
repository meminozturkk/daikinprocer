import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import { siteContentSchema, defaultSiteContent, type SiteContent } from "./site-content-types";

export * from "./site-content-types";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
const BACKUPS_DIR = path.join(DATA_DIR, "backups");
const MAX_BACKUPS = 20;

function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item && typeof item === "object" && !Array.isArray(item));
}

function deepMerge<T extends Record<string, unknown>>(target: T, source: Record<string, unknown>): T {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = output[key];
    if (isObject(sourceVal) && isObject(targetVal)) {
      output[key as keyof T] = deepMerge(targetVal, sourceVal) as T[keyof T];
    } else if (sourceVal !== undefined) {
      output[key as keyof T] = sourceVal as T[keyof T];
    }
  }
  return output;
}

const BACKUP_MANIFEST_FILE = path.join(BACKUPS_DIR, "manifest.json");

export type BackupMetadata = {
  title: string;
  note?: string;
  type: "manual" | "auto";
  createdAt: string;
};

export type BackupItem = {
  filename: string;
  name: string; // backwards compatibility alias for filename
  title: string;
  note?: string;
  type: "manual" | "auto";
  createdAt: string;
  date: string; // backwards compatibility alias for createdAt
  sizeBytes: number;
  size: number; // backwards compatibility alias for sizeBytes
};

async function getBackupManifest(): Promise<Record<string, BackupMetadata>> {
  try {
    const raw = await fs.readFile(BACKUP_MANIFEST_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveBackupManifest(manifest: Record<string, BackupMetadata>): Promise<void> {
  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
    await fs.writeFile(BACKUP_MANIFEST_FILE, JSON.stringify(manifest, null, 2), "utf-8");
  } catch {
    // Non-fatal
  }
}

export async function createBackup(
  currentRaw: string,
  options?: { title?: string; note?: string; type?: "manual" | "auto" }
): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const isManual = options?.type === "manual";
    const prefix = isManual ? "site-content-manual" : "site-content";
    const filename = `${prefix}-${timestamp}.json`;
    const backupFile = path.join(BACKUPS_DIR, filename);

    await fs.writeFile(backupFile, currentRaw, "utf-8");

    const manifest = await getBackupManifest();
    const dateFormatted = now.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const title =
      options?.title?.trim() ||
      (isManual ? `Manuel Yedek (${dateFormatted})` : `Otomatik Sistem Kaydı (${dateFormatted})`);
    const note =
      options?.note?.trim() ||
      (isManual
        ? "Kullanıcı tarafından manuel olarak oluşturuldu."
        : "İçerik kaydedilirken otomatik oluşturuldu.");

    manifest[filename] = {
      title,
      note,
      type: isManual ? "manual" : "auto",
      createdAt: now.toISOString(),
    };

    // Prune old backups, keep last MAX_BACKUPS
    const files = await fs.readdir(BACKUPS_DIR);
    const backupFiles = files
      .filter((f) => f.startsWith("site-content") && f.endsWith(".json"))
      .sort();

    if (backupFiles.length > MAX_BACKUPS) {
      const toDelete = backupFiles.slice(0, backupFiles.length - MAX_BACKUPS);
      await Promise.all(
        toDelete.map(async (f) => {
          try {
            await fs.unlink(path.join(BACKUPS_DIR, f));
            delete manifest[f];
          } catch {
            // ignore
          }
        })
      );
    }

    await saveBackupManifest(manifest);
    return { success: true, filename };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Yedek oluşturulamadı",
    };
  }
}

export async function createManualBackup(options: {
  title?: string;
  note?: string;
}): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    let currentRaw = "";
    try {
      currentRaw = await fs.readFile(CONTENT_FILE, "utf-8");
    } catch {
      currentRaw = JSON.stringify(defaultSiteContent, null, 2);
    }

    return await createBackup(currentRaw, {
      title: options.title,
      note: options.note,
      type: "manual",
    });
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Manuel yedek alınamadı",
    };
  }
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    const merged = deepMerge(defaultSiteContent as unknown as Record<string, unknown>, parsed);
    const validated = siteContentSchema.safeParse(merged);
    if (validated.success) {
      return validated.data;
    }
  } catch {
    // If file doesn't exist yet or failed to read, try to create with defaults
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(CONTENT_FILE, JSON.stringify(defaultSiteContent, null, 2), "utf-8");
    } catch {
      // Ignore write errors in read-only environments
    }
  }
  return defaultSiteContent;
});

export async function saveSiteContent(
  content: SiteContent,
  backupOptions?: { title?: string; note?: string; type?: "manual" | "auto" }
): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = siteContentSchema.parse(content);
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Backup current content before overwrite
    try {
      const currentRaw = await fs.readFile(CONTENT_FILE, "utf-8");
      await createBackup(currentRaw, backupOptions);
    } catch {
      // ignore if current file does not exist
    }

    // Atomic write
    const tempFile = `${CONTENT_FILE}.tmp-${Date.now()}`;
    await fs.writeFile(tempFile, JSON.stringify(validated, null, 2), "utf-8");
    await fs.rename(tempFile, CONTENT_FILE);

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
    return { success: false, error: errorMsg };
  }
}

export async function listBackups(): Promise<BackupItem[]> {
  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
    const [files, manifest] = await Promise.all([
      fs.readdir(BACKUPS_DIR),
      getBackupManifest(),
    ]);

    const list = await Promise.all(
      files
        .filter((f) => f.startsWith("site-content") && f.endsWith(".json"))
        .map(async (name) => {
          const filePath = path.join(BACKUPS_DIR, name);
          const stat = await fs.stat(filePath);
          const meta = manifest[name];

          // Infer fallback metadata if not in manifest
          const isManual = name.includes("-manual-") || meta?.type === "manual";
          const createdAt = meta?.createdAt || stat.mtime.toISOString();
          const dateFormatted = new Date(createdAt).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          const fallbackTitle = isManual
            ? `Manuel Yedek (${dateFormatted})`
            : `Otomatik Sistem Kaydı (${dateFormatted})`;
          const fallbackNote = isManual
            ? "Manuel oluşturulmuş yedek"
            : "İçerik kaydedilirken otomatik alındı";

          return {
            filename: name,
            name, // alias
            title: meta?.title || fallbackTitle,
            note: meta?.note || fallbackNote,
            type: (meta?.type || (isManual ? "manual" : "auto")) as "manual" | "auto",
            createdAt,
            date: createdAt, // alias
            sizeBytes: stat.size,
            size: stat.size, // alias
          };
        })
    );

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function getBackupContent(backupName: string): Promise<{ success: boolean; data?: SiteContent; raw?: string; error?: string }> {
  try {
    const safeName = path.basename(backupName);
    if (!safeName.startsWith("site-content") || !safeName.endsWith(".json")) {
      return { success: false, error: "Geçersiz yedek dosyası" };
    }
    const backupPath = path.join(BACKUPS_DIR, safeName);
    const raw = await fs.readFile(backupPath, "utf-8");
    const parsed = JSON.parse(raw);
    const validated = siteContentSchema.parse(parsed);
    return { success: true, data: validated, raw };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Yedek okunamadı" };
  }
}

export async function deleteBackup(backupName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const safeName = path.basename(backupName);
    if (!safeName.startsWith("site-content") || !safeName.endsWith(".json")) {
      return { success: false, error: "Geçersiz yedek dosyası" };
    }
    const backupPath = path.join(BACKUPS_DIR, safeName);
    await fs.unlink(backupPath);

    const manifest = await getBackupManifest();
    if (manifest[safeName]) {
      delete manifest[safeName];
      await saveBackupManifest(manifest);
    }

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Yedek silinemedi" };
  }
}

export async function restoreBackup(backupName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const safeName = path.basename(backupName);
    const backupPath = path.join(BACKUPS_DIR, safeName);
    const raw = await fs.readFile(backupPath, "utf-8");
    const parsed = JSON.parse(raw);
    const validated = siteContentSchema.parse(parsed);

    const nowFormatted = new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Save as current with note
    return await saveSiteContent(validated, {
      title: `Geri Yükleme Öncesi Yedek (${nowFormatted})`,
      note: `"${safeName}" yedeğine dönülmeden önceki son durum güvenle arşivlendi.`,
      type: "auto",
    });
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Geri yükleme başarısız" };
  }
}

export async function getBlogPosts() {
  const content = await getSiteContent();
  return content.posts;
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}
