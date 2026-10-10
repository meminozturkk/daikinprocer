import fs from "fs/promises";
import path from "path";
import { siteContentSchema, defaultSiteContent, type SiteContent } from "./site-content-types";

export * from "./site-content-types";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    const validated = siteContentSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
  } catch {
    // If file doesn't exist yet, try to create it with defaults
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(CONTENT_FILE, JSON.stringify(defaultSiteContent, null, 2), "utf-8");
    } catch {
      // Ignore write errors in read-only environments
    }
  }
  return defaultSiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = siteContentSchema.parse(content);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(CONTENT_FILE, JSON.stringify(validated, null, 2), "utf-8");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
    return { success: false, error: errorMsg };
  }
}
