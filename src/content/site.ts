import type { ContactInfo } from "@/lib/types";

/**
 * Verified company facts from legacy Proser Grup site.
 * Legacy competitor branding intentionally excluded. Daikin dealer/service status confirmed by client.
 * Replace placeholders marked VERIFY before production publish.
 */
export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.prosergrup.com",
  brandClaim: "Daikin Yetkili Bayi ve Yetkili Servis",
  foundedYear: 2022,
  experienceYears: 10,
  locale: "tr_TR",
} as const;

export const contact: ContactInfo = {
  brandName: "Proser Grup",
  legalName: "Proser Grup İklimlendirme", // VERIFY: exact commercial title from trade registry
  tagline: "Daikin yetkili bayi ve teknik servis — Kartal / İstanbul",
  address: {
    street: "Gümüşpınar Mahallesi Elmaağacı Sokak No:6A-B",
    district: "Kartal",
    city: "İstanbul",
    full: "Gümüşpınar Mahallesi Elmaağacı Sokak No:6A-B Kartal / İstanbul",
  },
  phones: [
    {
      label: "Sabit hat",
      display: "0 216 759 41 13",
      href: "tel:+902167594113",
    },
    {
      label: "Mobil",
      display: "0 536 860 87 70",
      href: "tel:+905368608770",
    },
  ],
  email: "info@prosergrup.com",
  whatsapp: {
    display: "0 536 860 87 70",
    href: "https://wa.me/905368608770",
  },
  hours: "Pazartesi – Cumartesi 09:00 – 18:00", // VERIFY before publish
  serviceArea: [
    "Kartal",
    "Maltepe",
    "Pendik",
    "Tuzla",
    "Ataşehir",
    "Kadıköy",
    "Ümraniye",
    "Sancaktepe",
    "Sultanbeyli",
  ],
  mapEmbedQuery: "Gümüşpınar Mahallesi Elmaağacı Sokak No:6A-B Kartal İstanbul",
};

export const navigation = [
  { href: "/", label: "Anasayfa" },
  { href: "/kurumsal", label: "Kurumsal" },
  {
    href: "/urunler",
    label: "Ürünler",
    children: [
      { href: "/urunler/bireysel-klimalar", label: "Bireysel Klimalar" },
      { href: "/urunler/multi-split", label: "Multi Split" },
      { href: "/urunler/ticari-klimalar", label: "Ticari Klimalar" },
      { href: "/urunler/vrv-sistemleri", label: "VRV Sistemleri" },
      { href: "/urunler/isi-pompalari", label: "Isı Pompaları" },
      { href: "/urunler/havalandirma", label: "Havalandırma" },
    ],
  },
  {
    href: "/hizmetler",
    label: "Hizmetler",
    children: [
      { href: "/hizmetler/satis-ve-projelendirme", label: "Satış & Projelendirme" },
      { href: "/hizmetler/montaj", label: "Montaj" },
      { href: "/hizmetler/bakim", label: "Periyodik Bakım" },
      { href: "/hizmetler/yetkili-servis", label: "Yetkili Servis" },
    ],
  },
  { href: "/referanslar", label: "Referanslar" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const trustPoints = [
  {
    title: "Daikin Yetkili Bayi",
    description: "Resmi Daikin ürün gamı, orijinal ekipman ve marka standartlarına uygun satış.",
  },
  {
    title: "Daikin Yetkili Servis",
    description: "Montaj, bakım, arıza tespiti ve orijinal yedek parça ile satış sonrası destek.",
  },
  {
    title: "10+ Yıl Sektör Deneyimi",
    description: "Kurumsal iklimlendirme projelerinde birikmiş mühendislik ve uygulama deneyimi.",
  },
  {
    title: "Uçtan Uca Çözüm",
    description: "Keşiften projelendirmeye, montajdan periyodik bakıma tek noktadan hizmet.",
  },
] as const;

/**
 * Asset inventory contract for official Daikin media pack.
 * Place licensed files under public/brand and public/products before go-live.
 */
export const mediaInventory = {
  brand: [
    { path: "/brand/daikin-logo.svg", note: "Official Daikin logo from partner pack" },
    { path: "/brand/proser-logo.svg", note: "Proser Grup wordmark" },
    { path: "/brand/authorized-dealer-badge.svg", note: "Authorized dealer badge if provided" },
  ],
  products: [
    { path: "/products/", note: "Official product stills only; no legacy competitor imagery" },
  ],
  excluded: [
    "Any competitor logo, PRO Bayi badge, or competitor product photography from the legacy site",
  ],
} as const;
