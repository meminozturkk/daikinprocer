import type { Category, Product } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "bireysel-klimalar",
    name: "Bireysel Klimalar",
    shortName: "Bireysel",
    description:
      "Ev ve ofisler için Daikin duvar tipi inverter klimalar. Sessiz çalışma, yüksek enerji sınıfı ve akıllı kontrol.",
    seoTitle: "Daikin Bireysel Klima | Proser Grup Kartal",
    seoDescription:
      "Daikin Sensira, Shira Plus, Perfera ve Emura bireysel klimalar. Proser Grup Daikin yetkili bayi Kartal / İstanbul.",
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

export const products: Product[] = [
  {
    slug: "sensira",
    name: "Daikin Sensira",
    category: "bireysel-klimalar",
    series: "Sensira",
    summary:
      "Günlük kullanım için dengeli performans sunan inverter duvar tipi klima. Ev ve küçük ofisler için ideal giriş-orta segment çözüm.",
    highlights: [
      "Inverter teknolojisi",
      "Yüksek enerji verimliliği",
      "Sessiz çalışma profili",
      "Kolay kullanım",
    ],
    specs: [
      { label: "Tip", value: "Duvar tipi split" },
      { label: "Kullanım", value: "Isıtma & soğutma" },
      { label: "Kontrol", value: "Kumanda / uygulama desteği (modele göre)" },
      { label: "Soğutucu", value: "R32" },
    ],
    suitableFor: ["Salon", "Yatak odası", "Küçük ofis"],
    image: "/sourced/products/duvar-tipi.jpg",
    featured: true,
  },
  {
    slug: "shira-plus",
    name: "Daikin Shira Plus",
    category: "bireysel-klimalar",
    series: "Shira Plus",
    summary:
      "Flash Streamer hava temizleme, akıllı göz ve yüksek enerji sınıfı ile konfor odaklı bireysel klima.",
    highlights: [
      "Flash Streamer",
      "Akıllı göz",
      "3 boyutlu hava üfleme",
      "A+++ enerji sınıfı (modele göre)",
    ],
    specs: [
      { label: "Tip", value: "Duvar tipi split" },
      { label: "Öne çıkan", value: "Hava kalitesi + konfor" },
      { label: "Kontrol", value: "ONECTA uygulaması (uyumlu modeller)" },
      { label: "Soğutucu", value: "R32" },
    ],
    suitableFor: ["Yaşam alanları", "Yatak odası", "Ofis odaları"],
    image: "/sourced/products/duvar-tipi.jpg",
    featured: true,
  },
  {
    slug: "perfera",
    name: "Daikin Perfera",
    category: "bireysel-klimalar",
    series: "Perfera",
    summary:
      "Üst düzey konfor, hava kalitesi ve tasarım arayanlar için premium bireysel klima serisi.",
    highlights: [
      "Premium konfor",
      "Gelişmiş hava üfleme",
      "Yüksek verimlilik",
      "Akıllı kontrol",
    ],
    specs: [
      { label: "Tip", value: "Duvar tipi split" },
      { label: "Segment", value: "Premium bireysel" },
      { label: "Soğutucu", value: "R32" },
    ],
    suitableFor: ["Villa", "Yüksek konfor beklentili konut", "Ofis"],
    image: "/sourced/products/duvar-tipi.jpg",
    featured: true,
  },
  {
    slug: "emura",
    name: "Daikin Emura",
    category: "bireysel-klimalar",
    series: "Emura",
    summary:
      "Ödüllü tasarım dili ile mimariye uyum sağlayan, yüksek performanslı duvar tipi klima.",
    highlights: ["İkonik tasarım", "Sessiz çalışma", "Akıllı özellikler", "Yüksek verim"],
    specs: [
      { label: "Tip", value: "Duvar tipi split" },
      { label: "Segment", value: "Tasarım / premium" },
      { label: "Soğutucu", value: "R32" },
    ],
    suitableFor: ["Modern konut", "Showroom", "Tasarım ofis"],
    image: "/sourced/products/duvar-tipi.jpg",
  },
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
    slug: "vrv",
    name: "Daikin VRV",
    category: "vrv-sistemleri",
    series: "VRV",
    summary:
      "Büyük yapılarda zon bazlı kontrol, yüksek verimlilik ve esnek iç ünite kombinasyonları sunan merkezi sistem.",
    highlights: [
      "Merkezi sistem mimarisi",
      "Yüksek iç ünite sayısı",
      "Enerji verimli işletme",
      "Bina otomasyonuna entegrasyon",
    ],
    specs: [
      { label: "Tip", value: "VRV / VRF merkezi" },
      { label: "Uygulama", value: "Ofis, otel, AVM, endüstriyel" },
    ],
    suitableFor: ["Ofis binası", "Otel", "AVM", "Üretim alanı"],
    image: "/sourced/products/vrf.jpg",
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
