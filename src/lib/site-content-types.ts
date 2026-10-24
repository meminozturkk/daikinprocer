import { z } from "zod";
import {
  contact as defaultContact,
  siteConfig as defaultSiteConfig,
  trustPoints as defaultTrustPoints,
  navigation as defaultNavigation,
} from "@/content/site";
import {
  posts as defaultBlogPosts,
  faqs as defaultFaqs,
  references as defaultReferences,
} from "@/content/blog";
import { services as defaultServices } from "@/content/services";

export const blogPostSchema = z.object({
  slug: z.string().min(1, "Slug gereklidir"),
  title: z.string().min(1, "Başlık gereklidir"),
  excerpt: z.string().min(1, "Özet gereklidir"),
  date: z.string().min(1, "Tarih gereklidir"),
  readingMinutes: z.number().int().min(1).default(5),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  content: z.array(z.string()).min(1, "En az bir paragraf içerik olmalıdır"),
});

export const faqItemSchema = z.object({
  question: z.string().min(1, "Soru gereklidir"),
  answer: z.string().min(1, "Cevap gereklidir"),
});

export const referenceItemSchema = z.object({
  name: z.string().min(1, "Referans adı gereklidir"),
  sector: z.string().min(1, "Sektör gereklidir"),
  summary: z.string().min(1, "Özet gereklidir"),
  image: z.string().optional(),
});

export const serviceItemSchema = z.object({
  slug: z.string().min(1, "Slug gereklidir"),
  name: z.string().min(1, "Hizmet adı gereklidir"),
  summary: z.string().min(1, "Özet gereklidir"),
  description: z.string().min(1, "Açıklama gereklidir"),
  steps: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  image: z.string().optional(),
});

export const navItemChildSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
});

export const navItemSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
  children: z.array(navItemChildSchema).optional(),
});

export const categoryOverrideSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  badge: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const productOverrideSchema = z.object({
  name: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  image: z.string().optional(),
  featured: z.boolean().optional(),
  hidden: z.boolean().optional(),
});

export const sectionMetaSchema = z.object({
  visible: z.boolean().default(true),
  eyebrow: z.string().default(""),
  title: z.string().default(""),
  description: z.string().default(""),
});

export const defaultSystemArchitecture = {
  visible: true,
  eyebrow: "Sistem Mimarisi",
  title: "Konut mu, Ticari & Merkezi Sistem mi?",
  description:
    "İhtiyacınıza en uygun sistem mimarisini seçin. Deneyimli mühendis kadromuz mekanınıza özel kapasite planlaması sunar.",
  residentialBadge: "BİREYSEL YAŞAM ALANLARI",
  residentialTitle: "Konut İklimlendirme Çözümleri",
  residentialDescription:
    "Daireler, müstakil evler ve villalar için yüksek enerji verimliliği ve sessiz konfor sunan Daikin çözümleri.",
  residentialFeatures: [
    "Oda metrekaresine ve cephesine göre hassas BTU kapasite tayini",
    "Duvar tipi split & tek dış üniteli multi-split seçenekleri",
    "Daikin Altherma havadan suya ısı pompası ile doğalgaz bağımsızlığı",
  ],
  commercialBadge: "İŞLETMELER & PROJELER",
  commercialTitle: "Ticari & VRV Merkezi Sistemler",
  commercialDescription:
    "Mağaza, ofis katı, otel, restoran ve endüstriyel tesisler için esnek borulama ve akıllı otomasyon altyapısı.",
  commercialFeatures: [
    "Sky Air kaset, kanallı ve tavan tipi ticari split iklimlendirme",
    "VRV çok bölgeli eş zamanlı ısıtma ve soğutma (Heat Recovery)",
    "Merkezi kumanda ve bina yönetim sistemlerine (BMS) entegrasyon",
  ],
};

export const defaultCampaignModal = {
  enabled: true,
  image: "/campaigns/ilk-bakim-hediye.jpg",
  alt: "Proser Grup İlk Bakım Hediye Kampanyası",
  subtitle: "Daikin klima ve VRV sistemlerinde geçerli özel kampanya.",
  buttonText: "WhatsApp ile Teklif Al →",
  whatsappMessage: "Merhaba, İlk Bakım Hediye kampanyanız hakkında bilgi ve teklif almak istiyorum.",
  cooldownMinutes: 10,
};

export const defaultPagesContent = {
  kurumsal: {
    title: "Kurumsal",
    description:
      "İklimlendirme sektöründe birikmiş kurumsal deneyimle 2022’de kurulan Proser Grup; Daikin yetkili bayi ve yetkili servis olarak uçtan uca çözüm sunar.",
    image: "/sourced/misc/about.jpg",
    paragraphs: [
      "Proser Grup; iklimlendirme sektörünün lider firmalarında kazanılan 10 yılı aşkın kurumsal deneyimin verdiği güvene dayanarak 2022 yılında kurulmuştur.",
      "Konut, ticari ve endüstriyel yapıların iklimlendirme ihtiyaçlarında danışmanlık, ürün temini, uygulama, otomasyon ve teknik servis süreçlerini bütünleşik yönetiriz.",
      "Bugün resmi konumumuz: Daikin Yetkili Bayi ve Yetkili Servis. Tüm marka ve ürün iletişimimiz onaylı Daikin kurumsal kimlik kurallarına uygundur.",
    ],
  },
  iletisim: {
    title: "İletişim & Konum",
    description:
      "Daikin ürünleri, keşif ve yetkili servis talepleriniz için bize ulaşın. Kartal merkezli ofisimiz tüm Anadolu ve Avrupa Yakası'na hizmet verir.",
  },
  teklifAl: {
    title: "Ücretsiz Keşif & Fiyat Teklifi",
    description:
      "Mekanınıza en uygun Daikin klima ve sistem seçimi için bilgilerinizi iletin; uzman ekibimiz aynı gün değerlendirip dönsün.",
  },
  servisTalebi: {
    title: "Daikin Yetkili Servis Talebi",
    description:
      "Arıza, periyodik bakım, montaj veya yedek parça talebinizi bildirin; Daikin yetkili servis güvencesiyle hızla müdahale edelim.",
  },
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme.",
    paragraphs: [
      "Web sitesi üzerindeki teklif, servis ve iletişim formları aracılığıyla ilettiğiniz ad soyad, telefon, e-posta, adres ve talep içeriği; talebinizin karşılanması, geri dönüş yapılması ve müşteri ilişkileri süreçlerinin yürütülmesi amacıyla işlenir.",
      "Verileriniz, yasal yükümlülükler ve meşru menfaat kapsamında gerekli süre boyunca saklanır; üçüncü taraflarla pazarlama amacıyla paylaşılmaz.",
      "KVKK kapsamındaki haklarınız için şirketimizin resmi iletişim kanallarına başvurabilirsiniz.",
    ],
  },
  gizlilik: {
    title: "Gizlilik Politikası",
    description: "Kullanıcı gizliliği, çerez politikası ve veri güvenliği esasları.",
    paragraphs: [
      "Proser Grup, web sitesini ziyaret eden kullanıcıların gizliliğine saygı duyar ve kişisel verilerin korunmasını temel ilke kabul eder.",
      "Sitemizde kullanıcı deneyimini iyileştirmek ve form güvenliğini sağlamak amacıyla teknik çerezler kullanılmaktadır. Üçüncü taraf reklam takipçisi barındırılmaz.",
      "Toplanan iletişim verileri yalnızca talep ettiğiniz iklimlendirme ve servis hizmetlerinin ifası amacıyla kullanılır.",
    ],
  },
};

export const defaultHomeSections = {
  trust: {
    visible: true,
    eyebrow: "Güven ve Yetki",
    title: "Daikin Standartlarında Mühendislik Güvencesi",
    description:
      "Sadece cihaz satışı değil; doğru kapasite seçimi, garantili montaj ve satış sonrası yetkili servis desteği.",
  },
  categories: {
    visible: true,
    eyebrow: "Resmi Ürün Gamı",
    title: "Daikin İklimlendirme Teknolojileri",
    description:
      "A+++ enerji verimliliği, 19 dB ultra sessiz mod ve Japon mühendislik hassasiyeti ile tasarlanan resmi Daikin serileri.",
  },
  systemArchitecture: defaultSystemArchitecture,
  workflow: {
    visible: true,
    eyebrow: "Süreç Yönetimi",
    title: "Keşiften Servise 4 Aşamalı Mühendislik Akışı",
    description:
      "Şeffaf iletişim, resmi marka standartları ve garantili işçilik ile anahtar teslim süreç.",
  },
  featuredProducts: {
    visible: true,
    eyebrow: "Öne Çıkan Modeller",
    title: "En Çok Tercih Edilen Daikin Serileri",
    description: "Fiyat karmaşası yerine doğrudan ihtiyaca ve mekana özel net tekliflendirme.",
  },
  references: {
    visible: true,
    eyebrow: "Referanslar",
    title: "Mühendisliğimize Güvenen Projeler",
    description:
      "Kamu kurumlarından otelcilik ve perakende devlerine kadar tamamlanan başarılı iklimlendirme projelerimiz.",
  },
  faq: {
    visible: true,
    eyebrow: "Merak Edilenler",
    title: "Sıkça Sorulan Sorular",
    description:
      "Yetki belgeleri, keşif süreci, garanti kapsamı ve montaj hakkında net cevaplar.",
  },
  blog: {
    visible: true,
    eyebrow: "Rehberler & Blog",
    title: "İklimlendirme Uzmanlığı & Tavsiyeler",
    description:
      "Doğru klima seçimi, enerji verimliliği ve periyodik bakım hakkında güncel teknik yazılar.",
  },
  bottomCta: {
    visible: true,
    badge: "Resmi Daikin Yetkili Noktası",
    title: "Merkezli Profesyonel İklimlendirme",
  },
};

export const defaultSeoSettings = {
  globalTitle: "Daikin Yetkili Bayi ve Yetkili Servis | Proser Grup Kartal İstanbul",
  globalDescription:
    "Daikin Yetkili Bayi ve Yetkili Servisi Proser Grup. Daikin inverter klimalar, VRV merkezi iklimlendirme sistemleri, Altherma ısı pompaları, ücretsiz keşif, garantili montaj ve teknik servis. Kartal / İstanbul.",
  globalKeywords: [
    "Daikin",
    "Daikin yetkili bayi",
    "Daikin yetkili servis",
    "Daikin klima",
    "Daikin Kartal yetkili servis",
    "Daikin VRV sistemleri",
    "Daikin Altherma ısı pompası",
    "Daikin split klima",
    "Daikin montaj ve bakım",
    "Proser Grup Daikin",
    "İstanbul Daikin bayi",
    "Gebze Daikin servisi",
  ],
};

export const systemArchitectureSchema = z.object({
  visible: z.boolean().default(defaultSystemArchitecture.visible),
  eyebrow: z.string().default(defaultSystemArchitecture.eyebrow),
  title: z.string().default(defaultSystemArchitecture.title),
  description: z.string().default(defaultSystemArchitecture.description),
  residentialBadge: z.string().default(defaultSystemArchitecture.residentialBadge),
  residentialTitle: z.string().default(defaultSystemArchitecture.residentialTitle),
  residentialDescription: z.string().default(defaultSystemArchitecture.residentialDescription),
  residentialFeatures: z.array(z.string()).default(defaultSystemArchitecture.residentialFeatures),
  commercialBadge: z.string().default(defaultSystemArchitecture.commercialBadge),
  commercialTitle: z.string().default(defaultSystemArchitecture.commercialTitle),
  commercialDescription: z.string().default(defaultSystemArchitecture.commercialDescription),
  commercialFeatures: z.array(z.string()).default(defaultSystemArchitecture.commercialFeatures),
});

export const campaignModalSchema = z.object({
  enabled: z.boolean().default(defaultCampaignModal.enabled),
  image: z.string().default(defaultCampaignModal.image),
  alt: z.string().default(defaultCampaignModal.alt),
  subtitle: z.string().default(defaultCampaignModal.subtitle),
  buttonText: z.string().default(defaultCampaignModal.buttonText),
  whatsappMessage: z.string().default(defaultCampaignModal.whatsappMessage),
  cooldownMinutes: z.number().int().min(1).default(defaultCampaignModal.cooldownMinutes),
});

export const pagesContentSchema = z.object({
  kurumsal: z.object({
    title: z.string().default(defaultPagesContent.kurumsal.title),
    description: z.string().default(defaultPagesContent.kurumsal.description),
    image: z.string().default(defaultPagesContent.kurumsal.image),
    paragraphs: z.array(z.string()).default(defaultPagesContent.kurumsal.paragraphs),
  }).default(defaultPagesContent.kurumsal),
  iletisim: z.object({
    title: z.string().default(defaultPagesContent.iletisim.title),
    description: z.string().default(defaultPagesContent.iletisim.description),
  }).default(defaultPagesContent.iletisim),
  teklifAl: z.object({
    title: z.string().default(defaultPagesContent.teklifAl.title),
    description: z.string().default(defaultPagesContent.teklifAl.description),
  }).default(defaultPagesContent.teklifAl),
  servisTalebi: z.object({
    title: z.string().default(defaultPagesContent.servisTalebi.title),
    description: z.string().default(defaultPagesContent.servisTalebi.description),
  }).default(defaultPagesContent.servisTalebi),
  kvkk: z.object({
    title: z.string().default(defaultPagesContent.kvkk.title),
    description: z.string().default(defaultPagesContent.kvkk.description),
    paragraphs: z.array(z.string()).default(defaultPagesContent.kvkk.paragraphs),
  }).default(defaultPagesContent.kvkk),
  gizlilik: z.object({
    title: z.string().default(defaultPagesContent.gizlilik.title),
    description: z.string().default(defaultPagesContent.gizlilik.description),
    paragraphs: z.array(z.string()).default(defaultPagesContent.gizlilik.paragraphs),
  }).default(defaultPagesContent.gizlilik),
});

export const homeSectionsContentSchema = z.object({
  trust: sectionMetaSchema.default(defaultHomeSections.trust),
  categories: sectionMetaSchema.default(defaultHomeSections.categories),
  systemArchitecture: systemArchitectureSchema.default(defaultSystemArchitecture),
  workflow: sectionMetaSchema.default(defaultHomeSections.workflow),
  featuredProducts: sectionMetaSchema.default(defaultHomeSections.featuredProducts),
  references: sectionMetaSchema.default(defaultHomeSections.references),
  faq: sectionMetaSchema.default(defaultHomeSections.faq),
  blog: sectionMetaSchema.default(defaultHomeSections.blog),
  bottomCta: z.object({
    visible: z.boolean().default(true),
    badge: z.string().default("Resmi Daikin Yetkili Noktası"),
    title: z.string().default("Merkezli Profesyonel İklimlendirme"),
  }).default(defaultHomeSections.bottomCta),
});

export const seoSettingsSchema = z.object({
  globalTitle: z.string().default(defaultSeoSettings.globalTitle),
  globalDescription: z.string().default(defaultSeoSettings.globalDescription),
  globalKeywords: z.array(z.string()).default(defaultSeoSettings.globalKeywords),
});

export const siteContentSchema = z.object({
  contact: z.object({
    brandName: z.string().min(1).default(defaultContact.brandName),
    legalName: z.string().min(1).default(defaultContact.legalName),
    tagline: z.string().min(1).default(defaultContact.tagline),
    phoneLandline: z.string().min(1).default("0 216 759 41 13"),
    phoneMobile: z.string().min(1).default("0 536 860 87 70"),
    whatsapp: z.string().min(1).default("0 536 860 87 70"),
    email: z.string().email().default("info@prosergrup.com"),
    hours: z.string().min(1).default(defaultContact.hours),
    addressFull: z.string().min(1).default(defaultContact.address.full),
    street: z.string().min(1).default(defaultContact.address.street),
    district: z.string().min(1).default(defaultContact.address.district),
    city: z.string().min(1).default(defaultContact.address.city),
    serviceArea: z.array(z.string()).default(defaultContact.serviceArea),
  }),
  hero: z.object({
    badge: z.string().min(1).default(defaultSiteConfig.brandClaim),
    title: z.string().min(1).default("Daikin konforu, mühendislik hassasiyetiyle Kartal’da."),
    description: z.string().min(1).default(
      "Proser Grup; Daikin yetkili bayi ve yetkili servis olarak konut, ticari ve merkezi iklimlendirme projelerinde keşif, satış, montaj ve teknik servisi tek çatı altında sunar."
    ),
    experienceYears: z.number().int().min(1).max(99).default(defaultSiteConfig.experienceYears),
    image: z.string().optional().default("/sourced/hero/slide-1.jpg"),
  }),
  announcement: z.object({
    enabled: z.boolean().default(false),
    text: z.string().default("Daikin klimalarda indirimli keşif ve montaj fırsatları için hemen bize ulaşın!"),
    linkText: z.string().optional().default("Teklif Al"),
    linkHref: z.string().optional().default("/teklif-al"),
  }),
  trustPoints: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    })
  ).default(
    defaultTrustPoints.map((tp) => ({
      title: tp.title,
      description: tp.description,
    }))
  ),
  campaign: campaignModalSchema.default(defaultCampaignModal),
  homeSections: homeSectionsContentSchema.default(defaultHomeSections),
  services: z.array(serviceItemSchema).default(defaultServices),
  faqs: z.array(faqItemSchema).default(defaultFaqs),
  references: z.array(referenceItemSchema).default(defaultReferences),
  navigation: z.array(navItemSchema).default(defaultNavigation as unknown as z.infer<typeof navItemSchema>[]),
  pages: pagesContentSchema.default(defaultPagesContent),
  seo: seoSettingsSchema.default(defaultSeoSettings),
  posts: z.array(blogPostSchema).default(defaultBlogPosts),
  productImages: z.record(z.string(), z.string()).default({}),
  categoryOverrides: z.record(z.string(), categoryOverrideSchema).default({}),
  productOverrides: z.record(z.string(), productOverrideSchema).default({}),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type CategoryOverride = z.infer<typeof categoryOverrideSchema>;
export type ProductOverride = z.infer<typeof productOverrideSchema>;

export const defaultSiteContent: SiteContent = {
  contact: {
    brandName: defaultContact.brandName,
    legalName: defaultContact.legalName,
    tagline: defaultContact.tagline,
    phoneLandline: defaultContact.phones[0]?.display || "0 216 759 41 13",
    phoneMobile: defaultContact.phones[1]?.display || "0 536 860 87 70",
    whatsapp: defaultContact.whatsapp.display,
    email: defaultContact.email,
    hours: defaultContact.hours,
    addressFull: defaultContact.address.full,
    street: defaultContact.address.street,
    district: defaultContact.address.district,
    city: defaultContact.address.city,
    serviceArea: defaultContact.serviceArea,
  },
  hero: {
    badge: defaultSiteConfig.brandClaim,
    title: "Daikin konforu, mühendislik hassasiyetiyle Kartal’da.",
    description:
      "Proser Grup; Daikin yetkili bayi ve yetkili servis olarak konut, ticari ve merkezi iklimlendirme projelerinde keşif, satış, montaj ve teknik servisi tek çatı altında sunar.",
    experienceYears: defaultSiteConfig.experienceYears,
    image: "/sourced/hero/slide-1.jpg",
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
  campaign: defaultCampaignModal,
  homeSections: defaultHomeSections,
  services: defaultServices,
  faqs: defaultFaqs,
  references: defaultReferences,
  navigation: defaultNavigation as unknown as z.infer<typeof navItemSchema>[],
  pages: defaultPagesContent,
  seo: defaultSeoSettings,
  posts: defaultBlogPosts,
  productImages: {},
  categoryOverrides: {},
  productOverrides: {},
};
