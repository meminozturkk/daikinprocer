import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  phone: z.string().min(10, "Geçerli bir telefon girin"),
  email: z.string().email("Geçerli bir e-posta girin").optional().or(z.literal("")),
  city: z.string().min(2, "İlçe / semt girin"),
  productInterest: z.string().optional(),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalı"),
  kvkk: z.boolean().refine((v) => v === true, { message: "KVKK onayı gerekli" }),
  website: z.string().max(0).optional(), // honeypot
});

export const serviceRequestSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  phone: z.string().min(10, "Geçerli bir telefon girin"),
  email: z.string().email("Geçerli bir e-posta girin").optional().or(z.literal("")),
  address: z.string().min(5, "Adres girin"),
  deviceType: z.string().min(2, "Cihaz tipi seçin"),
  issue: z.string().min(10, "Arıza / talep açıklaması girin"),
  preferredTime: z.string().optional(),
  kvkk: z.boolean().refine((v) => v === true, { message: "KVKK onayı gerekli" }),
  website: z.string().max(0).optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;

const rateMap = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || entry.reset < now) {
    rateMap.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
