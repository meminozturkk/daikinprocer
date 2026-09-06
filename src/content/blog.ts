import type { BlogPost, Faq, Reference } from "@/lib/types";

export const references: Reference[] = [
  {
    name: "İstanbul Büyükşehir Belediyesi",
    sector: "Kamu",
    summary: "Kurumsal iklimlendirme uygulamaları kapsamında referans projeler.",
    image: "/sourced/references/ibb.jpg",
  },
  {
    name: "Meykon Meyve Suları",
    sector: "Endüstriyel",
    summary: "Üretim ve ofis alanlarında iklimlendirme çözümleri.",
    image: "/sourced/references/meykon.jpg",
  },
  {
    name: "Doğtaş",
    sector: "Perakende",
    summary: "Mağaza ve ticari alan iklimlendirme uygulamaları.",
    image: "/sourced/references/dogtas.jpg",
  },
  {
    name: "Doğuş Oto",
    sector: "Otomotiv",
    summary: "Showroom ve servis alanları için iklimlendirme.",
    image: "/sourced/references/dogus-oto.jpg",
  },
  {
    name: "Luna Bodrum",
    sector: "Turizm",
    summary: "Konaklama tesisinde konfor odaklı iklimlendirme.",
    image: "/sourced/references/luna-bodrum.jpg",
  },
  {
    name: "Piri Reis Üniversitesi",
    sector: "Eğitim",
    summary: "Eğitim yapılarında iklimlendirme uygulamaları.",
    image: "/sourced/references/piri-reis.jpg",
  },
  {
    name: "Mövenpick Güneşli",
    sector: "Otelcilik",
    summary: "Otel alanlarında iklimlendirme ve konfor yönetimi.",
    image: "/sourced/references/movenpick.jpg",
  },
  {
    name: "Arnavutköy Belediyesi",
    sector: "Kamu",
    summary: "Belediye hizmet binalarında iklimlendirme desteği.",
    image: "/sourced/references/arnavutkoy.jpg",
  },
];

export const faqs: Faq[] = [
  {
    question: "Proser Grup Daikin yetkili bayi ve servis midir?",
    answer:
      "Evet. Proser Grup, Daikin ürünlerinin satışı ve montaj sonrası teknik servis süreçlerinde yetkili bayi ve yetkili servis olarak hizmet verir. Güncel unvan ifadesi için bayi belgenizdeki resmi metin siteye yansıtılır.",
  },
  {
    question: "Hangi bölgelere hizmet veriyorsunuz?",
    answer:
      "Merkezimiz Kartal’dadır. Maltepe, Pendik, Tuzla, Ataşehir, Kadıköy, Ümraniye, Sancaktepe, Sultanbeyli ve İstanbul Anadolu Yakası’nda keşif, satış, montaj ve servis hizmeti sunuyoruz.",
  },
  {
    question: "Teklif süreci nasıl işler?",
    answer:
      "Online form, WhatsApp veya telefon ile talebinizi alıyoruz. Gerekirse yerinde keşif yapıp uygun Daikin ürün/sistem önerisi ve yazılı teklif hazırlıyoruz. Sitede sabit fiyat listesi yayınlamıyoruz; kapasite ve uygulama koşullarına göre netleştiriyoruz.",
  },
  {
    question: "Montaj sonrası garanti nasıl işler?",
    answer:
      "Ürün garantisi Daikin’in güncel garanti koşullarına tabidir. Uygun montaj ve yetkili servis süreçleri garanti haklarının korunması için kritiktir. Detayları teklif ve teslim aşamasında yazılı olarak paylaşıyoruz.",
  },
  {
    question: "Periyodik bakım ne sıklıkla yapılmalı?",
    answer:
      "Yoğun kullanıma göre yılda en az bir, tercihen sezon öncesi iki bakım önerilir. Ticari ve merkezi sistemlerde kullanım yoğunluğuna göre bakım periyodu kısaltılabilir.",
  },
];

export const posts: BlogPost[] = [
  {
    slug: "klima-secerken-nelere-dikkat-etmeliyiz",
    title: "Klima Seçerken Nelere Dikkat Etmeliyiz?",
    excerpt:
      "BTU, enerji sınıfı, oda kullanımı ve montaj koşulları: doğru klima seçiminin temel kriterleri.",
    date: "2026-03-01",
    readingMinutes: 6,
    tags: ["klima seçimi", "BTU", "enerji"],
    image: "/sourced/blog/klima-secimi.jpg",
    content: [
      "Doğru klima seçimi yalnızca marka tercihi değildir. Oda büyüklüğü, yalıtım, güneş alma durumu, kullanım amacı ve montaj mesafesi kapasiteyi doğrudan etkiler.",
      "BTU ihtiyacı kabaca alan m²’sine göre tahmin edilir; ancak tavan yüksekliği, cam yüzeyi ve ısı kaynakları hesabı değiştirir. Bu yüzden keşif önerilir.",
      "Enerji sınıfı (ör. A++ / A+++) uzun vadeli işletme maliyetini belirler. Sessizlik, hava üfleme yönü ve filtreleme konforu da karar kriteridir.",
      "Daikin bireysel serilerinde kullanım senaryonuza göre Sensira, Shira Plus, Perfera veya Emura gibi seçenekler değerlendirilebilir. Proser Grup olarak ihtiyaca göre doğru modeli öneriyoruz.",
    ],
  },
  {
    slug: "inverter-klima-ve-enerji-sinifi",
    title: "Inverter Klima ve Enerji Sınıfı Neden Önemli?",
    excerpt:
      "Inverter teknolojisi ve enerji etiketleri, hem konforu hem faturayı nasıl etkiler?",
    date: "2026-03-10",
    readingMinutes: 5,
    tags: ["inverter", "enerji sınıfı"],
    image: "/sourced/products/duvar-tipi.jpg",
    content: [
      "Inverter kompresör, sabit hız yerine ihtiyaca göre kapasite ayarlayarak daha stabil sıcaklık ve genelde daha düşük tüketim sağlar.",
      "Enerji etiketleri sezonluk verimliliği özetler. Yüksek sınıf cihazlar ilk yatırımda daha pahalı görünebilir; işletme ömründe fark yaratır.",
      "Doğru boyutlandırma olmadan yüksek enerji sınıfı tek başına yeterli değildir. Aşırı büyük cihaz kısa çevrim yapabilir; küçük cihaz sürekli yüksek yükte çalışabilir.",
    ],
  },
  {
    slug: "daikin-klima-bakim-periyodu",
    title: "Daikin Klima Bakım Periyodu: Ne Zaman Yaptırmalısınız?",
    excerpt:
      "Sezon öncesi bakımın arıza riski, hijyen ve verimlilik üzerindeki etkileri.",
    date: "2026-03-18",
    readingMinutes: 4,
    tags: ["bakım", "servis"],
    image: "/sourced/misc/service.jpg",
    content: [
      "Filtre ve eşanjör kirliliği hava debisini düşürür, enerji tüketimini artırır ve koku/hijyen sorunlarına yol açabilir.",
      "Yaz ve kış sezonu öncesi bakım; gaz basıncı, elektrik bağlantıları, drenaj ve genel performans kontrolü için idealdir.",
      "Proser Grup yetkili servis ekibi olarak bakım sonrası gözlemleri raporluyor, gerekli onarım önerilerini şeffaf paylaşıyoruz.",
    ],
  },
  {
    slug: "daikin-seri-karsilastirma-rehberi",
    title: "Daikin Seri Karşılaştırma Rehberi",
    excerpt:
      "Sensira, Shira Plus, Perfera ve Emura: hangi seri kime uygun?",
    date: "2026-03-25",
    readingMinutes: 7,
    tags: ["Daikin", "karşılaştırma"],
    image: "/sourced/products/multi.jpg",
    content: [
      "Sensira dengeli giriş-orta segment performans arayanlar için uygundur.",
      "Shira Plus hava kalitesi ve akıllı özellikler isteyen kullanıcılar için öne çıkar.",
      "Perfera üst düzey konfor; Emura ise tasarım ve mimari uyum öncelikli projelerde tercih edilir.",
      "Nihai seçim oda tipi, bütçe ve özellik beklentisine göre yapılmalıdır. Proser Grup showroom/keşif sürecinde yönlendirir.",
    ],
  },
  {
    slug: "vrv-nedir-ne-zaman-tercih-edilir",
    title: "VRV Nedir, Ne Zaman Tercih Edilir?",
    excerpt:
      "Merkezi VRV sistemlerin ofis, otel ve ticari yapılardaki avantajları.",
    date: "2026-04-02",
    readingMinutes: 6,
    tags: ["VRV", "ticari"],
    image: "/sourced/products/vrf.jpg",
    content: [
      "VRV, bir dış ünite grubunun çok sayıda iç üniteyi beslediği merkezi iklimlendirme mimarisidir.",
      "Zon kontrolü, uzun borulama esnekliği ve yüksek enerji verimliliği büyük yapılarda kritik avantajdır.",
      "Küçük dairelerde multi veya bireysel split daha uygun olabilir; orta-büyük ticari yapılarda VRV öne çıkar. Projelendirme şarttır.",
    ],
  },
  {
    slug: "altherma-isi-pompasi-rehberi",
    title: "Daikin Altherma Isı Pompası Rehberi",
    excerpt:
      "Isıtma ve sıcak su için Altherma sistemlerinin çalışma mantığı ve kullanım alanları.",
    date: "2026-04-08",
    readingMinutes: 6,
    tags: ["Altherma", "ısı pompası"],
    image: "/sourced/products/isi-pompasi.jpg",
    content: [
      "Altherma havadan suya ısı pompası, dış havadaki enerjiyi kullanarak ısıtma ve sıcak kullanım suyu sağlar.",
      "Yeni binalarda ve uygun renovasyonlarda düşük işletme maliyeti ve daha düşük karbon ayak izi hedeflenir.",
      "Radyatör, yerden ısıtma veya fan coil gibi dağıtım sistemine uyum keşifte değerlendirilir. Proser Grup olarak sistem seçimini projenize göre yaparız.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
