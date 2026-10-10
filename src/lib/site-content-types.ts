import { z } from "zod";
import {
  contact as defaultContact,
  siteConfig as defaultSiteConfig,
  trustPoints as defaultTrustPoints,
} from "@/content/site";

export const siteContentSchema = z.object({
  contact: z.object({
    brandName: z.string().min(1),
    tagline: z.string().min(1),
    phoneLandline: z.string().min(1),
    phoneMobile: z.string().min(1),
    whatsapp: z.string().min(1),
    email: z.string().email(),
    hours: z.string().min(1),
    addressFull: z.string().min(1),
    district: z.string().min(1),
  }),
  hero: z.object({
    badge: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    experienceYears: z.number().int().min(1).max(99),
  }),
  announcement: z.object({
    enabled: z.boolean(),
    text: z.string(),
    linkText: z.string().optional(),
    linkHref: z.string().optional(),
  }),
  trustPoints: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ).length(4),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const defaultSiteContent: SiteContent = {
  contact: {
    brandName: defaultContact.brandName,
    tagline: defaultContact.tagline,
    phoneLandline: defaultContact.phones[0]?.display || "0 216 759 41 13",
    phoneMobile: defaultContact.phones[1]?.display || "0 536 860 87 70",
    whatsapp: defaultContact.whatsapp.display,
    email: defaultContact.email,
    hours: defaultContact.hours,
    addressFull: defaultContact.address.full,
    district: defaultContact.address.district,
  },
  hero: {
    badge: defaultSiteConfig.brandClaim,
    title: "Daikin konforu, mühendislik hassasiyetiyle Kartal’da.",
    description:
      "Proser Grup; Daikin yetkili bayi ve yetkili servis olarak konut, ticari ve merkezi iklimlendirme projelerinde keşif, satış, montaj ve teknik servisi tek çatı altında sunar.",
    experienceYears: defaultSiteConfig.experienceYears,
  },
  announcement: {
    enabled: false,
    text: "Daikin klimalarda indirimli keşif ve montaj fırsatları için hemen bize ulaşın!",
    linkText: "Teklif Al",
    linkHref: "/teklif-al",
  },
  trustPoints: defaultTrustPoints.map((tp) => ({
    title: tp.title,
    description: tp.description,
  })),
};
