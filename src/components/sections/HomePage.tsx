import Image from "next/image";
import Link from "next/link";
import { categories, getFeaturedProducts } from "@/content/products";
import { services } from "@/content/services";
import { faqs, posts, references } from "@/content/blog";
import { contact, siteConfig } from "@/content/site";
import { getSiteContent } from "@/lib/site-content";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { AirflowBackdrop, CountUp, FadeIn } from "@/components/ui/Motion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";

export async function HomePage() {
  const featured = getFeaturedProducts();
  const siteContent = await getSiteContent();

  const whatsappHref = getWhatsAppUrl(siteContent.contact.whatsapp);
  const whatsappQuoteHref = getWhatsAppUrl(
    siteContent.contact.whatsapp,
    "Merhaba, Daikin ürün ve sistemleri hakkında ücretsiz keşif ve teklif almak istiyorum."
  );
  const whatsappServiceHref = getWhatsAppUrl(
    siteContent.contact.whatsapp,
    "Merhaba, Daikin cihazım için yetkili servis / bakım / montaj talebinde bulunmak istiyorum."
  );
  const phoneLandlineHref = `tel:${siteContent.contact.phoneLandline.replace(/[\s-]/g, "")}`;

  // Find key categories for Bento presentation
  const residentialCat = categories.find((c) => c.slug === "bireysel-klimalar") || categories[0];
  const vrvCat = categories.find((c) => c.slug === "vrv-sistemleri") || categories[3];
  const althermaCat = categories.find((c) => c.slug === "isi-pompalari") || categories[4];
  const secondaryCats = categories.filter(
    (c) => c.slug !== "bireysel-klimalar" && c.slug !== "vrv-sistemleri" && c.slug !== "isi-pompalari"
  );

  return (
    <>
      <JsonLd data={[localBusinessJsonLd(), faqJsonLd(faqs)]} />

      {/* 1. HERO SECTION: Architectural Scale & Layered Depth */}
      <section className="relative overflow-hidden bg-[var(--navy)]">
        <div className="absolute inset-0">
          <Image
            src="/sourced/hero/slide-1.jpg"
            alt="Daikin iklimlendirme sistemleri modern yaşam alanı"
            fill
            priority
            className="object-cover object-center opacity-40 mix-blend-luminosity"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061524] via-[#0b1f33]/90 to-[#0b1f33]/70" />
          <AirflowBackdrop className="opacity-35" />
        </div>

        <div className="container-pro relative z-10 grid items-center gap-12 py-16 md:grid-cols-12 md:py-24 lg:py-28">
          {/* Left Column: Bold Value Proposition */}
          <div className="md:col-span-7">
            <FadeIn>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-950/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-sky-200 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>{siteContent.hero.badge}</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
                {siteContent.hero.title}
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-200/90">
                {siteContent.hero.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Button
                  href={whatsappQuoteHref}
                  size="lg"
                  external
                  className="shadow-xl shadow-sky-500/20 ring-1 ring-white/20 transition-all hover:scale-[1.02]"
                >
                  Ücretsiz Keşif / Teklif Al
                </Button>
                <Button
                  href={whatsappServiceHref}
                  variant="ghost"
                  size="lg"
                  external
                  className="border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                >
                  Yetkili Servis Talebi
                </Button>
                <Button href={whatsappHref} variant="whatsapp" size="lg" external>
                  WhatsApp
                </Button>
              </div>

              {/* Engineering Metrics Strip */}
              <dl className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5 backdrop-blur-md">
                <div className="border-r border-white/10 pr-2">
                  <CountUp value={siteContent.hero.experienceYears} suffix="+" label="Yıl Saha Deneyimi" light />
                </div>
                <div className="border-r border-white/10 pr-2">
                  <CountUp value={2022} label="Resmi Kuruluş" light />
                </div>
                <div>
                  <CountUp value={contact.serviceArea.length} suffix="+" label="Hizmet İlçesi" light />
                </div>
              </dl>
            </FadeIn>
          </div>

          {/* Right Column: Layered Official Dealer Credential Card */}
          <div className="md:col-span-5">
            <FadeIn delay={0.15}>
              <div className="relative rounded-3xl border border-white/20 bg-gradient-to-b from-white/15 to-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-white">
                {/* Ambient glow accent */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[var(--daikin-blue)]/20 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 border-b border-white/15 pb-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-400/20 text-sky-300 ring-1 ring-sky-300/30">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                        Resmi Daikin Partneri
                      </span>
                      <h3 className="text-lg font-bold text-white">{contact.brandName} İklimlendirme</h3>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-200">Yetki Belgesi</p>
                      <p className="mt-1 font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                        <span className="text-emerald-400 text-sm">✓</span> Bayi + Servis
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-200">Hizmet Merkezi</p>
                      <p className="mt-1 font-bold text-white text-sm sm:text-base">
                        {siteContent.contact.district} / İstanbul
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 text-sm text-slate-200">
                    <div className="flex items-start gap-3">
                      <span className="text-base text-sky-300 mt-0.5">📍</span>
                      <span className="line-clamp-2 leading-relaxed">{siteContent.contact.addressFull}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base text-sky-300">🕒</span>
                      <span>{siteContent.contact.hours}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base text-sky-300">📞</span>
                      <a
                        href={phoneLandlineHref}
                        className="font-bold text-white hover:text-sky-300 transition"
                      >
                        {siteContent.contact.phoneLandline}
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/15">
                    <Button href={whatsappQuoteHref} external className="w-full justify-center shadow-lg shadow-sky-500/25">
                      Hemen Keşif Talebi Oluştur
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. TRUST & CAPABILITIES: Asymmetrical Bento Grid */}
      <Section className="bg-[var(--ice)] !py-16">
        <SectionHeading
          eyebrow="Güven ve Yetki"
          title="Daikin Standartlarında Mühendislik Güvencesi"
          description="Sadece cihaz satışı değil; doğru kapasite seçimi, garantili montaj ve satış sonrası yetkili servis desteği."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {/* Bento Card 1: Main Authority Card (Spans 2 cols) */}
          <FadeIn className="bento-card md:col-span-2 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="tech-chip text-[var(--daikin-blue-dark)]">
                  RESMİ YETKİLİ BAYİ & SERVİS
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Resmi Daikin Garantisi
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-[var(--navy)]">
                {siteContent.trustPoints[0].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--slate)] max-w-xl">
                {siteContent.trustPoints[0].description} Proser Grup olarak satışı yapılan her Daikin ürünü, resmi Daikin Türkiye distribütör garantisi altındadır.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid gap-3 sm:grid-cols-3 text-sm text-[var(--navy)] font-semibold">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[var(--daikin-blue)] text-xs">✓</span>
                <span>Orijinal Ürün</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[var(--daikin-blue)] text-xs">✓</span>
                <span>TSE Sertifikası</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[var(--daikin-blue)] text-xs">✓</span>
                <span>Eğitimli Kadro</span>
              </div>
            </div>
          </FadeIn>

          {/* Bento Card 2: Rapid Response Card (1 col) */}
          <FadeIn delay={0.08} className="bento-card p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="tech-chip">HIZLI KEŞİF</span>
              <h3 className="mt-4 text-xl font-bold text-[var(--navy)]">
                Aynı Gün Keşif & Raporlama
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
                İstanbul Anadolu Yakası genelinde mekanınıza gelerek ısı kaybı ve kazanç hesabı yapıyor, mekan için en optimize cihazı öneriyoruz.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--slate)] font-medium">Ortalama Yanıt</p>
                <p className="text-xl font-bold text-[var(--daikin-blue)]">24 Saat İçinde</p>
              </div>
              <a
                href={whatsappQuoteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[var(--daikin-blue-dark)] hover:underline inline-flex items-center gap-1"
              >
                Keşif İste →
              </a>
            </div>
          </FadeIn>

          {/* Bento Card 3: Authorized Service & Maintenance (1 col) */}
          <FadeIn delay={0.12} className="bento-card p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="tech-chip">TEKNİK SERVİS</span>
              <h3 className="mt-4 text-xl font-bold text-[var(--navy)]">
                {siteContent.trustPoints[1].title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">
                {siteContent.trustPoints[1].description} Vakumlama, gaz kaçak testi ve standartlara uygun montaj prosedürleri.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200">
                🔧 %100 Orijinal Yedek Parça
              </span>
            </div>
          </FadeIn>

          {/* Bento Card 4: End-to-End Engineering (Spans 2 cols) */}
          <FadeIn delay={0.16} className="bento-card-dark md:col-span-2 p-7 sm:p-8 text-white flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/20 px-3 py-1 text-xs font-semibold text-sky-200 ring-1 ring-sky-300/30">
                  UÇTAN UCA ÇÖZÜM MİMARİSİ
                </span>
                <span className="text-xs text-slate-300">Konut & Proje Segmenti</span>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white">
                {siteContent.trustPoints[3].title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-200 max-w-xl">
                {siteContent.trustPoints[3].description} Bireysel daire iklimlendirmesinden villa, çok katlı ofis ve ticari VRV projelerine kadar eksiksiz mühendislik desteği.
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 text-xs font-medium text-sky-200">
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">Bireysel Klimalar</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">Multi Split</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">VRV Merkezi Sistemler</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">Altherma Isı Pompaları</span>
              </div>
              <Link
                href="/hizmetler"
                className="text-sm font-bold text-sky-300 hover:text-white transition inline-flex items-center gap-1"
              >
                Hizmetlerimizi İnceleyin →
              </Link>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 3. PRODUCT FAMILIES: Editorial Bento Showcase */}
      <Section className="!py-20">
        <SectionHeading
          eyebrow="Resmi Ürün Gamı"
          title="Daikin İklimlendirme Teknolojileri"
          description="A+++ enerji verimliliği, 19 dB ultra sessiz mod ve Japon mühendislik hassasiyeti ile tasarlanan resmi Daikin serileri."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Flagship Large Bento Card: Residential Series (Span 2 cols on desktop) */}
          <FadeIn className="bento-card lg:col-span-2 overflow-hidden group flex flex-col justify-between">
            <div className="p-7 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="tech-chip text-[var(--daikin-blue-dark)]">
                  AMİRAL GEMİSİ SERİSİ
                </span>
                <span className="tech-chip-success font-bold">
                  A+++ Sezonsal Verim
                </span>
              </div>

              <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--navy)] group-hover:text-[var(--daikin-blue)] transition">
                <Link href={`/urunler/${residentialCat.slug}`}>
                  {residentialCat.name}
                </Link>
              </h3>

              <p className="mt-3 text-base leading-relaxed text-[var(--slate)] max-w-xl">
                {residentialCat.description} Sensira, Shira Plus, Perfera ve Stylish modelleriyle evinize ve ofisinize mükemmel uyum.
              </p>

              {/* Technical Badges */}
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="bg-[var(--ice)] text-[var(--navy)] px-3 py-1 rounded-full border border-slate-200">
                  🔇 19 dB(A) Fısıltı Sessizliği
                </span>
                <span className="bg-[var(--ice)] text-[var(--navy)] px-3 py-1 rounded-full border border-slate-200">
                  🌱 R32 Çevre Dostu Gaz
                </span>
                <span className="bg-[var(--ice)] text-[var(--navy)] px-3 py-1 rounded-full border border-slate-200">
                  📱 Daikin Onecta WiFi
                </span>
              </div>
            </div>

            {/* Product Image Container */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-gradient-to-b from-[var(--ice)] to-slate-100">
              <Image
                src={residentialCat.image}
                alt={residentialCat.name}
                fill
                className="object-cover object-center transition duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--slate)]">9.000 – 24.000 BTU Kapasite Seçenekleri</span>
              <Link
                href={`/urunler/${residentialCat.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--daikin-blue-dark)] hover:underline"
              >
                Modelleri İncele →
              </Link>
            </div>
          </FadeIn>

          {/* Right Bento Column: VRV and Altherma Heat Pumps */}
          <div className="space-y-6">
            {/* Card 2: VRV Systems */}
            <FadeIn delay={0.08} className="bento-card overflow-hidden group">
              <div className="p-6 sm:p-7">
                <span className="tech-chip">MERKEZİ ÇÖZÜM</span>
                <h3 className="mt-3 text-xl font-bold text-[var(--navy)] group-hover:text-[var(--daikin-blue)] transition">
                  <Link href={`/urunler/${vrvCat.slug}`}>{vrvCat.name}</Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
                  {vrvCat.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] font-semibold text-[var(--slate)]">
                  <span className="bg-[var(--ice)] px-2.5 py-1 rounded-md">Yüksek SEER</span>
                  <span className="bg-[var(--ice)] px-2.5 py-1 rounded-md">Bina Otomasyonu</span>
                </div>
              </div>
              <div className="relative aspect-[16/8] w-full overflow-hidden bg-[var(--ice)]">
                <Image
                  src={vrvCat.image}
                  alt={vrvCat.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
                <span className="text-[var(--slate)]">Ofis, Otel & Villa</span>
                <Link href={`/urunler/${vrvCat.slug}`} className="text-[var(--daikin-blue-dark)] hover:underline">
                  VRV Detayları →
                </Link>
              </div>
            </FadeIn>

            {/* Card 3: Altherma Heat Pump */}
            <FadeIn delay={0.12} className="bento-card overflow-hidden group">
              <div className="p-6 sm:p-7">
                <span className="tech-chip text-emerald-700 bg-emerald-50 border-emerald-200">
                  DÜŞÜK KARBON
                </span>
                <h3 className="mt-3 text-xl font-bold text-[var(--navy)] group-hover:text-[var(--daikin-blue)] transition">
                  <Link href={`/urunler/${althermaCat.slug}`}>{althermaCat.name}</Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
                  {althermaCat.description}
                </p>
              </div>
              <div className="relative aspect-[16/8] w-full overflow-hidden bg-[var(--ice)]">
                <Image
                  src={althermaCat.image}
                  alt={althermaCat.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
                <span className="text-[var(--slate)]">Isıtma + Sıcak Su</span>
                <Link href={`/urunler/${althermaCat.slug}`} className="text-[var(--daikin-blue-dark)] hover:underline">
                  Altherma İncele →
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Secondary Category Ribbon (Multi Split, Ticari, Havalandırma) */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {secondaryCats.map((cat, i) => (
            <FadeIn key={cat.slug} delay={i * 0.05}>
              <Link
                href={`/urunler/${cat.slug}`}
                className="bento-card p-5 group flex items-center justify-between gap-4 block hover:border-[var(--daikin-blue)]"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">
                    {cat.shortName}
                  </p>
                  <h4 className="mt-1 font-bold text-[var(--navy)] group-hover:text-[var(--daikin-blue)] transition">
                    {cat.name}
                  </h4>
                  <p className="mt-1 text-xs text-[var(--slate)] line-clamp-1">{cat.description}</p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ice)] text-[var(--daikin-blue)] group-hover:bg-[var(--daikin-blue)] group-hover:text-white transition">
                  →
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* 4. SOLUTION SELECTOR: High-Contrast Architecture (Konut vs Ticari) */}
      <Section className="bg-[var(--ice)] !py-20">
        <SectionHeading
          eyebrow="Sistem Mimarisi"
          title="Konut mu, Ticari & Merkezi Sistem mi?"
          description="İhtiyacınıza en uygun sistem mimarisini seçin. Deneyimli mühendis kadromuz mekanınıza özel kapasite planlaması sunar."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {/* Residential Solution Card */}
          <FadeIn className="bento-card p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="tech-chip text-[var(--daikin-blue-dark)]">BİREYSEL YAŞAM ALANLARI</span>
                <span className="text-2xl">🏡</span>
              </div>
              <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-[var(--navy)]">
                Konut İklimlendirme Çözümleri
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--slate)]">
                Daireler, müstakil evler ve villalar için yüksek enerji verimliliği ve sessiz konfor sunan Daikin çözümleri.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-[var(--navy)]">
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[var(--daikin-blue)] text-xs font-bold">✓</span>
                  <span>Oda metrekaresine ve cephesine göre hassas BTU kapasite tayini</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[var(--daikin-blue)] text-xs font-bold">✓</span>
                  <span>Duvar tipi split & tek dış üniteli multi-split seçenekleri</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[var(--daikin-blue)] text-xs font-bold">✓</span>
                  <span>Daikin Altherma havadan suya ısı pompası ile doğalgaz bağımsızlığı</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
              <Button href="/urunler/bireysel-klimalar" size="md">
                Konut Ürünlerini İncele
              </Button>
              <Button
                href={getWhatsAppUrl(siteContent.contact.whatsapp, "Merhaba, konut iklimlendirme için keşif ve teklif almak istiyorum.")}
                variant="ghost"
                size="md"
                external
              >
                Ücretsiz Keşif İste
              </Button>
            </div>
          </FadeIn>

          {/* Commercial & VRV Solution Card */}
          <FadeIn delay={0.1} className="bento-card-dark p-8 sm:p-10 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/20 px-3 py-1 text-xs font-semibold text-sky-200 ring-1 ring-sky-300/30">
                  İŞLETMELER & PROJELER
                </span>
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
                Ticari & VRV Merkezi Sistemler
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-200">
                Mağaza, ofis katı, otel, restoran ve endüstriyel tesisler için esnek borulama ve akıllı otomasyon altyapısı.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">✓</span>
                  <span>Sky Air kaset, kanallı ve tavan tipi ticari split iklimlendirme</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">✓</span>
                  <span>VRV çok bölgeli eş zamanlı ısıtma ve soğutma (Heat Recovery)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">✓</span>
                  <span>Merkezi kumanda ve bina yönetim sistemlerine (BMS) entegrasyon</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-3">
              <Button href="/urunler/vrv-sistemleri" variant="primary" size="md">
                VRV & Ticari Sistemler
              </Button>
              <Button
                href={getWhatsAppUrl(siteContent.contact.whatsapp, "Merhaba, ticari / VRV projemiz için keşif ve teklif almak istiyorum.")}
                variant="ghost"
                size="md"
                external
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                Proje Teklifi Al
              </Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 5. SERVICE PROCESS: 4-Step Engineering Workflow */}
      <Section className="!py-20">
        <SectionHeading
          eyebrow="Süreç Yönetimi"
          title="Keşiften Servise 4 Aşamalı Mühendislik Akışı"
          description="Şeffaf iletişim, resmi marka standartları ve garantili işçilik ile anahtar teslim süreç."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <FadeIn key={service.slug} delay={i * 0.06} className="bento-card p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-base font-extrabold text-[var(--daikin-blue)] border border-sky-100">
                    0{i + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">
                    Aşama 0{i + 1}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-[var(--navy)] group-hover:text-[var(--daikin-blue)] transition">
                  {service.name}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[var(--slate)]">
                  {service.summary}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <Link
                  href={`/hizmetler/${service.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-bold text-[var(--daikin-blue-dark)] hover:underline"
                >
                  Detayları İncele →
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* 6. FEATURED PRODUCTS: Highlighting Popular Series */}
      <Section className="bg-[var(--ice)] !py-20">
        <SectionHeading
          eyebrow="Öne Çıkan Modeller"
          title="En Çok Tercih Edilen Daikin Serileri"
          description="Fiyat karmaşası yerine doğrudan ihtiyaca ve mekana özel net tekliflendirme."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((product) => (
            <FadeIn key={product.slug} className="bento-card overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] bg-white p-6 overflow-hidden flex items-center justify-center border-b border-slate-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.series ? (
                    <span className="absolute top-3 left-3 tech-chip bg-white/90 backdrop-blur-sm border-slate-200 text-[var(--navy)]">
                      {product.series}
                    </span>
                  ) : null}
                </div>

                <div className="p-6">
                  <h3 className="line-clamp-2 text-lg font-bold text-[var(--navy)] group-hover:text-[var(--daikin-blue)] transition">
                    <Link href={`/urunler/${product.category}/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--slate)]">
                    {product.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-xs font-semibold text-[var(--slate)]">Resmi Ürün Verisi</span>
                <a
                  href={getWhatsAppUrl(
                    siteContent.contact.whatsapp,
                    `Merhaba, ${product.name} modeli hakkında fiyat ve teklif almak istiyorum.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-bold text-[var(--daikin-blue-dark)] hover:underline"
                >
                  Teklif Al →
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* 7. REFERENCES: Sector Trust & Projects */}
      <Section className="!py-20">
        <SectionHeading
          eyebrow="Referanslar"
          title="Mühendisliğimize Güvenen Projeler"
          description="Kamu kurumlarından otelcilik ve perakende devlerine kadar tamamlanan başarılı iklimlendirme projelerimiz."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {references.map((ref) => (
            <div key={ref.name} className="bento-card p-6 flex flex-col justify-between">
              <div>
                {ref.image ? (
                  <div className="relative mb-4 flex h-14 items-center justify-center rounded-xl bg-[var(--ice)] p-3">
                    <Image
                      src={ref.image}
                      alt={ref.name}
                      width={120}
                      height={44}
                      className="max-h-10 w-auto object-contain"
                    />
                  </div>
                ) : null}
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--daikin-blue)]">
                  {ref.sector}
                </span>
                <h3 className="mt-1.5 font-bold text-[var(--navy)] text-base">{ref.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--slate)]">{ref.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 8. FAQ: Interactive Accessible Accordion */}
      <Section className="bg-[var(--ice)] !py-20">
        <SectionHeading
          align="center"
          eyebrow="Merak Edilenler"
          title="Sıkça Sorulan Sorular"
          description="Yetki belgeleri, keşif süreci, garanti kapsamı ve montaj hakkında net cevaplar."
        />

        <div className="mx-auto max-w-3xl space-y-3.5">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="bento-card group p-5 transition-all open:ring-1 open:ring-[var(--daikin-blue)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-[var(--navy)] focus-ring rounded-lg">
                <span className="pr-4 text-base">{faq.question}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ice)] text-sm text-[var(--slate)] transition-transform duration-200 group-open:rotate-180 group-open:bg-sky-100 group-open:text-[var(--daikin-blue)]">
                  ↓
                </span>
              </summary>
              <p className="mt-3.5 text-sm leading-relaxed text-[var(--slate)] border-t border-slate-100 pt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* 9. BLOG / GUIDES: Editorial Knowledge Base */}
      <Section className="!py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="eyebrow mb-3">Rehberler & Blog</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--navy)] md:text-4xl">
              İklimlendirme Uzmanlığı & Tavsiyeler
            </h2>
            <p className="mt-3 text-base text-[var(--slate)] max-w-xl">
              Doğru klima seçimi, enerji verimliliği ve periyodik bakım hakkında güncel teknik yazılar.
            </p>
          </div>
          <Button href="/blog" variant="ghost">
            Tüm Yazıları Gör →
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="bento-card block overflow-hidden group">
              {post.image ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="33vw"
                  />
                </div>
              ) : null}
              <div className="p-6">
                <p className="text-xs font-semibold text-[var(--daikin-blue-dark)]">{post.date}</p>
                <h3 className="mt-2 text-lg font-bold text-[var(--navy)] group-hover:text-[var(--daikin-blue)] transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--slate)] leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 10. BOTTOM AUTHORITY BANNER / CONTACT CTA: Dark Architectural Navy with Ambient Lighting */}
      <Section className="!py-12">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[var(--navy)] via-[#0d2842] to-[#061524] p-8 text-white shadow-2xl md:grid md:grid-cols-2 md:gap-12 md:p-14">
          {/* Subtle ambient glow effects */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3.5 py-1 text-xs font-bold text-sky-300 ring-1 ring-sky-500/30">
                Resmi Daikin Yetkili Noktası
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl leading-tight">
                {siteContent.contact.district} Merkezli Profesyonel İklimlendirme
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-200">
                {siteContent.contact.addressFull}
                <br />
                <span className="text-sm font-medium text-sky-200/90">{siteContent.contact.hours}</span>
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button href={whatsappQuoteHref} size="lg" external className="shadow-lg shadow-sky-500/25">
                Ücretsiz Keşif İste
              </Button>
              <Button
                href="/iletisim"
                variant="ghost"
                size="lg"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                İletişim & Konum
              </Button>
            </div>
          </div>

          <div className="relative z-10 mt-8 rounded-2xl border border-white/15 bg-white/10 p-7 shadow-xl backdrop-blur-md md:mt-0 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Hizmet Verdiğimiz İlçeler (Anadolu Yakası)
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {contact.serviceArea.map((district) => (
                  <span
                    key={district}
                    className="rounded-md bg-white/10 px-2.5 py-1 text-slate-200 border border-white/10"
                  >
                    {district}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">Doğrudan İletişim</p>
              <a
                href={phoneLandlineHref}
                className="mt-1 block text-2xl md:text-3xl font-extrabold text-white hover:text-sky-300 transition"
              >
                {siteContent.contact.phoneLandline}
              </a>
              <a
                href={`mailto:${siteContent.contact.email}`}
                className="mt-1.5 block text-sm font-medium text-slate-300 hover:text-white transition"
              >
                {siteContent.contact.email}
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
