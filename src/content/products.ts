import type { Category, Product } from "@/lib/types";
import metkanProducts from "./generated/metkan-products.json";

export const categories: Category[] = [
  {
    slug: "bireysel-klimalar",
    name: "Bireysel Klimalar",
    shortName: "Bireysel",
    description:
      "Ev ve ofisler için Daikin duvar tipi inverter klimalar. Sessiz çalışma, yüksek enerji sınıfı ve akıllı kontrol.",
    seoTitle: "Daikin Bireysel Klima | Proser Grup Kartal",
    seoDescription:
      "Daikin Sensira, Shira Plus, Perfera, Emura ve Stylish bireysel klimalar. Proser Grup Daikin yetkili bayi Kartal / İstanbul.",
    image: "/sourced/products/duvar-tipi.jpg",
  },
  {
    slug: "multi-split",
    name: "Multi Split Sistemler",
    shortName: "Multi",
    description:
      "Tek dış ünite ile birden fazla odayı bağımsız iklimlendirin. Balanslı yük ve düşük dış ünite alanı.",
    seoTitle: "Daikin Multi Split Klima | Proser Grup",
    seoDescription:
      "Daikin multi split sistemleri ile çok odalı konut ve ofis çözümleri. Keşif ve teklif için Proser Grup.",
    image: "/sourced/products/multi.jpg",
  },
  {
    slug: "ticari-klimalar",
    name: "Ticari Klimalar (Sky Air)",
    shortName: "Ticari",
    description:
      "Mağaza, restoran, ofis ve butik ticari alanlar için güçlü ısıtma-soğutma performanslı Sky Air çözümleri.",
    seoTitle: "Daikin Sky Air Ticari Klima | Proser Grup",
    seoDescription:
      "Daikin Sky Air kaset, kanallı ve yer-tavan tipi ticari klimalar. Proser Grup satış ve montaj.",
    image: "/sourced/products/ticari.jpg",
  },
  {
    slug: "vrv-sistemleri",
    name: "VRV Merkezi Sistemler",
    shortName: "VRV",
    description:
      "Ofis, otel, AVM ve endüstriyel yapılarda esnek, verimli ve merkezi kontrol edilebilir VRV iklimlendirme.",
    seoTitle: "Daikin VRV Sistemleri | Proser Grup",
    seoDescription:
      "Daikin VRV merkezi klima sistemleri: projelendirme, montaj ve servis. Proser Grup Kartal.",
    image: "/sourced/products/vrf.jpg",
  },
  {
    slug: "isi-pompalari",
    name: "Altherma Isı Pompaları",
    shortName: "Altherma",
    description:
      "Isınma ve sıcak su için enerji verimli Daikin Altherma havadan suya ısı pompası sistemleri.",
    seoTitle: "Daikin Altherma Isı Pompası | Proser Grup",
    seoDescription:
      "Daikin Altherma ısı pompaları ile düşük işletme maliyetli ısıtma ve sıcak su. Proser Grup yetkili bayi.",
    image: "/sourced/products/isi-pompasi.jpg",
  },
  {
    slug: "havalandirma",
    name: "Havalandırma & Hava Kalitesi",
    shortName: "Hava",
    description:
      "Taze hava, ısı geri kazanım ve hava temizleme çözümleriyle sağlıklı iç ortam hava kalitesi.",
    seoTitle: "Daikin Havalandırma ve Hava Temizleme | Proser Grup",
    seoDescription:
      "Daikin havalandırma ve hava kalitesi ürünleri. Proser Grup keşif, satış ve uygulama.",
    image: "/sourced/products/havalandirma.jpg",
  },
];

/** Categories not covered by the Metkan SKU feed — keep series-level entries. */
const legacyProducts: Product[] = [
  {
    slug: "multi-split-sistem",
    name: "Daikin Multi Split",
    category: "multi-split",
    series: "Multi",
    summary:
      "Tek dış ünite ile birden fazla iç üniteyi besleyen esnek multi çözüm. Cephede daha az dış ünite alanı.",
    highlights: [
      "Çoklu iç ünite",
      "Bağımsız oda kontrolü",
      "Kompakt dış ünite yerleşimi",
      "Konut ve ofis uyumu",
    ],
    specs: [
      { label: "Tip", value: "Multi split" },
      { label: "İç ünite", value: "Duvar / kaset / kanallı (projeye göre)" },
      { label: "Avantaj", value: "Düşük dış ünite sayısı" },
    ],
    suitableFor: ["Daire", "Villa", "Küçük ofis katı"],
    image: "/sourced/products/multi.jpg",
    featured: true,
  },
  {
    slug: "sky-air",
    name: "Daikin Sky Air",
    category: "ticari-klimalar",
    series: "Sky Air",
    summary:
      "Mağaza ve orta ölçekli ticari alanlar için güçlü ısıtma-soğutma kapasiteli ticari klima ailesi.",
    highlights: [
      "Ticari kapasite aralığı",
      "Kaset / kanallı / yer-tavan seçenekleri",
      "Uzun süreli işletme",
      "Merkezi kontrol opsiyonları",
    ],
    specs: [
      { label: "Tip", value: "Ticari split / Sky Air" },
      { label: "Uygulama", value: "Mağaza, restoran, ofis" },
    ],
    suitableFor: ["Mağaza", "Restoran", "Klinik", "Ofis"],
    image: "/sourced/products/ticari.jpg",
    featured: true,
  },
  {
    slug: "altherma",
    name: "Daikin Altherma",
    category: "isi-pompalari",
    series: "Altherma",
    summary:
      "Isıtma ve sıcak su ihtiyacı için havadan suya ısı pompası teknolojisi. Düşük karbon ve işletme maliyeti odaklı.",
    highlights: [
      "Isıtma + sıcak su",
      "Yüksek mevsimsel verim",
      "Yeni ve renovasyon projeleri",
      "Konut ve küçük ticari",
    ],
    specs: [
      { label: "Tip", value: "Havadan suya ısı pompası" },
      { label: "Çıktı", value: "Isıtma / sıcak kullanım suyu" },
    ],
    suitableFor: ["Villa", "Müstakil konut", "Butik otel"],
    image: "/sourced/products/isi-pompasi.jpg",
    featured: true,
  },
  {
    slug: "hava-kalitesi",
    name: "Daikin Hava Kalitesi Çözümleri",
    category: "havalandirma",
    series: "Air Quality",
    summary:
      "Taze hava, filtrasyon ve ısı geri kazanım odaklı havalandırma çözümleriyle sağlıklı iç ortam.",
    highlights: [
      "Taze hava temini",
      "Filtrasyon",
      "Isı geri kazanım seçenekleri",
      "Konut ve ticari uyum",
    ],
    specs: [
      { label: "Tip", value: "Havalandırma / hava kalitesi" },
      { label: "Hedef", value: "İç hava kalitesi (IAQ)" },
    ],
    suitableFor: ["Konut", "Ofis", "Eğitim / sağlık alanları"],
    image: "/sourced/products/havalandirma.jpg",
  },
];

export const products: Product[] = [
  ...(metkanProducts as Product[]),
  ...legacyProducts,
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getSeriesForCategory(slug: string) {
  return [
    ...new Set(getProductsByCategory(slug).map((p) => p.series).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "tr"));
}
