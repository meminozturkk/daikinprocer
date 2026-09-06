import Image from "next/image";
import Link from "next/link";
import { categories, getFeaturedProducts } from "@/content/products";
import { services } from "@/content/services";
import { faqs, posts, references } from "@/content/blog";
import { contact, siteConfig, trustPoints } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { AirflowBackdrop, CountUp, FadeIn } from "@/components/ui/Motion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd, localBusinessJsonLd } from "@/lib/seo";

export function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <JsonLd data={[localBusinessJsonLd(), faqJsonLd(faqs)]} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/sourced/hero/slide-1.jpg"
            alt="Modern yaşam alanında duvar tipi klima"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/90 via-[var(--navy)]/70 to-[var(--navy)]/35" />
          <AirflowBackdrop className="opacity-40" />
        </div>
        <div className="container-pro relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <FadeIn>
            <span className="eyebrow bg-white/15 text-sky-100">{siteConfig.brandClaim}</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Daikin konforu, mühendislik hassasiyetiyle Kartal’da.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
              Proser Grup; Daikin yetkili bayi ve yetkili servis olarak konut, ticari ve merkezi
              iklimlendirme projelerinde keşif, satış, montaj ve teknik servisi tek çatı altında sunar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/teklif-al" size="lg">
                Ücretsiz Keşif / Teklif
              </Button>
              <Button href="/servis-talebi" variant="ghost" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                Servis Talebi
              </Button>
              <Button href={contact.whatsapp.href} variant="whatsapp" size="lg" external>
                WhatsApp
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <CountUp value={siteConfig.experienceYears} suffix="+" label="Yıl deneyim" light />
              <CountUp value={2022} label="Kuruluş" light />
              <CountUp value={contact.serviceArea.length} suffix="+" label="Hizmet ilçesi" light />
            </dl>
          </FadeIn>

          <FadeIn delay={0.15} className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="card-surface relative col-span-2 aspect-[16/10] overflow-hidden">
                <Image
                  src="/sourced/hero/slide-2.jpg"
                  alt="İç mekanda klima uygulaması"
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 40vw"
                />
              </div>
              <div className="card-surface relative aspect-square overflow-hidden">
                <Image
                  src="/sourced/hero/slide-3.jpg"
                  alt="Salon tipi klima görseli"
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
              </div>
              <div className="card-surface relative aspect-square overflow-hidden">
                <Image
                  src="/sourced/hero/vrf-showcase.png"
                  alt="Merkezi iklimlendirme sistemi"
                  fill
                  className="object-cover object-top"
                  sizes="20vw"
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[var(--navy)] p-4 text-white shadow-xl">
                <p className="text-xs uppercase tracking-wide text-sky-200">Yetki</p>
                <p className="mt-1 font-semibold">Bayi + Servis</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-xl">
                <p className="text-xs uppercase tracking-wide text-[var(--slate)]">Merkez</p>
                <p className="mt-1 font-semibold text-[var(--navy)]">Kartal / İstanbul</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Section className="bg-white !py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {trustPoints.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.05} className="card-surface p-5">
              <p className="font-semibold text-[var(--navy)]">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{item.description}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section className="bg-[var(--ice)]">
        <SectionHeading
          eyebrow="Ürün aileleri"
          title="Daikin çözümleri, ihtiyacınıza göre"
          description="Bireysel klimadan VRV ve Altherma ısı pompalarına kadar resmi ürün gamında keşif ve teklif."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <FadeIn key={cat.slug} delay={i * 0.04}>
              <Link
                href={`/urunler/${cat.slug}`}
                className="card-surface group block overflow-hidden transition hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ice)]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[var(--navy)] group-hover:text-[var(--daikin-blue)]">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">{cat.description}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Çözüm seçici"
          title="Konut mu, ticari mi?"
          description="Doğru sistem mimarisi ile başlayın. Ekibimiz keşif sonrası net öneri sunar."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-surface overflow-hidden">
            <div className="bg-[var(--daikin-blue)] px-6 py-4 text-white">
              <h3 className="text-xl font-semibold">Konut Çözümleri</h3>
            </div>
            <div className="space-y-3 p-6 text-sm text-[var(--slate)]">
              <p>Duvar tipi split, multi split ve Altherma ısı pompaları.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Salon / yatak odası kapasite seçimi</li>
                <li>Sessizlik ve enerji sınıfı odaklı öneri</li>
                <li>Montaj ve sezon bakımı</li>
              </ul>
              <Button href="/urunler/bireysel-klimalar" className="mt-4">
                Konut ürünlerini incele
              </Button>
            </div>
          </div>
          <div className="card-surface overflow-hidden">
            <div className="bg-[var(--navy)] px-6 py-4 text-white">
              <h3 className="text-xl font-semibold">Ticari & Merkezi</h3>
            </div>
            <div className="space-y-3 p-6 text-sm text-[var(--slate)]">
              <p>Sky Air ticari klimalar ve VRV merkezi sistemler.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Mağaza, ofis, otel ve endüstriyel alanlar</li>
                <li>Projelendirme ve süpervizörlük</li>
                <li>Bakım sözleşmeleri</li>
              </ul>
              <Button href="/urunler/vrv-sistemleri" variant="secondary" className="mt-4">
                VRV & ticariye bak
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-[var(--ice)]">
        <SectionHeading
          eyebrow="Servis süreci"
          title="Keşiften bakıma net adımlar"
          description="Şeffaf iletişim, standartlara uygun uygulama ve satış sonrası destek."
        />
        <div className="grid gap-4 md:grid-cols-4">
          {services.map((service, i) => (
            <FadeIn key={service.slug} delay={i * 0.05} className="card-surface p-5">
              <p className="text-sm font-semibold text-[var(--daikin-blue)]">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--navy)]">{service.name}</h3>
              <p className="mt-2 text-sm text-[var(--slate)]">{service.summary}</p>
              <Link
                href={`/hizmetler/${service.slug}`}
                className="mt-4 inline-flex text-sm font-semibold text-[var(--daikin-blue-dark)] hover:underline"
              >
                Detay →
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Öne çıkan ürünler"
          title="Sık tercih edilen Daikin serileri"
          description="Fiyat listesi yerine ihtiyaca özel teklif. Teknik özellikler resmi ürün verisine dayanır."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((product) => (
            <Link
              key={product.slug}
              href={`/urunler/${product.category}/${product.slug}`}
              className="card-surface block overflow-hidden transition hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] bg-[var(--ice)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="line-clamp-2 text-lg font-semibold text-[var(--navy)]">{product.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--slate)]">{product.summary}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--daikin-blue)]">Teklif al →</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-[var(--ice)]">
        <SectionHeading eyebrow="Referanslar" title="Güvenilen projeler" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {references.map((ref) => (
            <div key={ref.name} className="card-surface overflow-hidden p-5">
              {ref.image ? (
                <div className="relative mb-4 flex h-16 items-center justify-center rounded-xl bg-[var(--ice)] p-2">
                  <Image
                    src={ref.image}
                    alt={ref.name}
                    width={120}
                    height={48}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--daikin-blue)]">
                {ref.sector}
              </p>
              <h3 className="mt-2 font-semibold text-[var(--navy)]">{ref.name}</h3>
              <p className="mt-2 text-sm text-[var(--slate)]">{ref.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="SSS"
          title="Sık sorulan sorular"
          description="Yetki, bölge, teklif ve bakım hakkında net cevaplar."
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="card-surface group p-5">
              <summary className="cursor-pointer list-none font-semibold text-[var(--navy)] focus-ring rounded">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--slate)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="bg-[var(--ice)]">
        <SectionHeading eyebrow="Blog" title="İklimlendirme rehberleri" />
        <div className="grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-surface block overflow-hidden">
              {post.image ? (
                <div className="relative aspect-[16/10]">
                  <Image src={post.image} alt={post.title} fill className="object-cover" sizes="33vw" />
                </div>
              ) : null}
              <div className="p-5">
                <p className="text-xs text-[var(--slate)]">{post.date}</p>
                <h3 className="mt-2 font-semibold text-[var(--navy)]">{post.title}</h3>
                <p className="mt-2 text-sm text-[var(--slate)]">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Button href="/blog" variant="ghost">
            Tüm yazılar
          </Button>
        </div>
      </Section>

      <Section>
        <div className="card-surface grid gap-8 overflow-hidden bg-gradient-to-br from-[var(--navy)] to-[var(--navy-soft)] p-8 text-white md:grid-cols-2 md:p-12">
          <div>
            <h2 className="text-3xl font-bold">Kartal merkezli Daikin uzmanlığı</h2>
            <p className="mt-4 text-slate-200">
              {contact.address.full}
              <br />
              {contact.hours}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/teklif-al">Teklif Al</Button>
              <Button href="/iletisim" variant="ghost" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                İletişim
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-wide text-sky-200">Hizmet bölgesi</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-100">
              {contact.serviceArea.join(" · ")}
            </p>
            <p className="mt-6 text-2xl font-bold">{contact.phones[0].display}</p>
            <p className="mt-1 text-slate-200">{contact.email}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
