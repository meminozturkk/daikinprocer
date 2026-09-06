import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "satis-ve-projelendirme",
    name: "Satış ve Projelendirme",
    summary: "İhtiyaca uygun Daikin ürün seçimi, keşif ve mühendislik odaklı tekliflendirme.",
    description:
      "Proser Grup olarak keşiften ürün seçimine kadar süreci yönetiyoruz. Alan ölçümü, yük hesabı yaklaşımı, doğru kapasite önerisi ve bütçeye uygun Daikin çözümleri sunuyoruz.",
    steps: [
      "Keşif ve ihtiyaç analizi",
      "Ürün / sistem önerisi",
      "Teklif ve zaman planı",
      "Sipariş ve lojistik koordinasyonu",
    ],
    benefits: [
      "Doğru kapasite ile enerji tasarrufu",
      "Konut ve ticari proje deneyimi",
      "Şeffaf teklif süreci",
    ],
    seoTitle: "Daikin Klima Satış ve Projelendirme | Proser Grup",
    seoDescription:
      "Daikin klima ve VRV projelendirme, keşif ve satış. Proser Grup yetkili bayi — Kartal / İstanbul.",
    image: "/sourced/hero/vrf-showcase.png",
  },
  {
    slug: "montaj",
    name: "Profesyonel Montaj",
    summary: "Standartlara uygun montaj, vakumlama, gaz şarjı ve devreye alma.",
    description:
      "Daikin cihazlarının uzun ömürlü ve verimli çalışması doğru montaj ile başlar. Borulama, drenaj, elektrik bağlantıları ve devreye alma adımlarını uzman ekibimizle yürütüyoruz.",
    steps: [
      "Saha hazırlığı ve yerleşim",
      "Borulama / drenaj / elektrik",
      "Vakumlama ve sızdırmazlık kontrolü",
      "Devreye alma ve kullanıcı bilgilendirme",
    ],
    benefits: [
      "Garanti koşullarına uygun uygulama",
      "Temiz işçilik ve güvenlik",
      "Çalışma testi ve teslim tutanağı",
    ],
    seoTitle: "Daikin Klima Montajı | Proser Grup Kartal",
    seoDescription:
      "Daikin klima ve sistem montajı, vakumlama ve devreye alma. Proser Grup yetkili bayi hizmeti.",
    image: "/sourced/misc/service.jpg",
  },
  {
    slug: "bakim",
    name: "Periyodik Bakım",
    summary: "Performans, hijyen ve enerji verimliliği için düzenli klima bakımı.",
    description:
      "Filtre temizliği, ısı eşanjörü bakımı, gaz basıncı kontrolü ve genel sistem kontrolü ile cihazlarınızın ilk günkü performansına yakın çalışmasını hedefliyoruz.",
    steps: [
      "Görsel ve performans kontrolü",
      "Filtre ve iç ünite hijyeni",
      "Basınç / elektrik kontrolleri",
      "Bakım raporu ve öneriler",
    ],
    benefits: [
      "Daha düşük arıza riski",
      "Daha sağlıklı iç hava",
      "Enerji tüketiminde iyileşme",
    ],
    seoTitle: "Daikin Klima Bakımı | Proser Grup Yetkili Servis",
    seoDescription:
      "Daikin periyodik klima bakımı Kartal ve Anadolu Yakası. Proser Grup yetkili teknik servis.",
    image: "/sourced/icons/servis.png",
  },
  {
    slug: "yetkili-servis",
    name: "Daikin Yetkili Servis",
    summary: "Arıza tespiti, onarım, orijinal yedek parça ve garanti süreç desteği.",
    description:
      "Yetkili servis olarak bilgisayar destekli arıza tespiti, orijinal yedek parça, montaj-demontaj, revizyon ve süpervizörlük hizmetleri sunuyoruz.",
    steps: [
      "Arıza bildirimi / randevu",
      "Yerinde teşhis",
      "Onarım veya parça değişimi",
      "Test, garanti kaydı ve bilgilendirme",
    ],
    benefits: [
      "Orijinal yedek parça",
      "Marka prosedürlerine uygun süreç",
      "Hızlı ve şeffaf iletişim",
    ],
    seoTitle: "Daikin Yetkili Servis Kartal | Proser Grup",
    seoDescription:
      "Daikin yetkili teknik servis: arıza, onarım, yedek parça. Proser Grup — Kartal / İstanbul.",
    image: "/sourced/misc/about.jpg",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
