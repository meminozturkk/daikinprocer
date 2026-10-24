import fs from "fs/promises";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

export type LeadType = "teklif" | "servis";
export type LeadStatus = "yeni" | "arandi" | "tamamlandi";

export type LeadItem = {
  id: string;
  type: LeadType;
  createdAt: string;
  status: LeadStatus;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  deviceType?: string;
  issue?: string;
  preferredTime?: string;
  productInterest?: string;
  message?: string;
  adminNote?: string;
};

export async function getLeads(): Promise<LeadItem[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // If file doesn't exist, initialize empty array
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(LEADS_FILE, JSON.stringify([], null, 2), "utf-8");
    } catch {
      // ignore
    }
  }
  return [];
}

export async function saveLead(leadData: Omit<LeadItem, "id" | "createdAt" | "status">): Promise<LeadItem> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const leads = await getLeads();

  const newLead: LeadItem = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "yeni",
  };

  const updatedLeads = [newLead, ...leads];

  // Atomic write
  const tempFile = `${LEADS_FILE}.tmp-${Date.now()}`;
  await fs.writeFile(tempFile, JSON.stringify(updatedLeads, null, 2), "utf-8");
  await fs.rename(tempFile, LEADS_FILE);

  return newLead;
}

export async function updateLead(
  id: string,
  updates: Partial<Pick<LeadItem, "status" | "adminNote">>
): Promise<{ success: boolean; error?: string }> {
  try {
    const leads = await getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) {
      return { success: false, error: "Kayıt bulunamadı" };
    }

    leads[index] = {
      ...leads[index],
      ...updates,
    };

    const tempFile = `${LEADS_FILE}.tmp-${Date.now()}`;
    await fs.writeFile(tempFile, JSON.stringify(leads, null, 2), "utf-8");
    await fs.rename(tempFile, LEADS_FILE);

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Güncelleme başarısız" };
  }
}

export async function deleteLead(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const leads = await getLeads();
    const filtered = leads.filter((l) => l.id !== id);

    const tempFile = `${LEADS_FILE}.tmp-${Date.now()}`;
    await fs.writeFile(tempFile, JSON.stringify(filtered, null, 2), "utf-8");
    await fs.rename(tempFile, LEADS_FILE);

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Silme başarısız" };
  }
}
