import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { contact, siteConfig, trustPoints } from "@/content/site";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Kurumsal | Daikin Yetkili Bayi ve Servis",
  description:
    "Proser Grup kurumsal hikâye: 2022 kuruluş, 10+ yıl sektör deneyimi, Daikin yetkili bayi ve yetkili servis.",
  path: "/kurumsal",
});

export default function KurumsalPage() {
  return (
    <>
      <PageHero
        title="Kurumsal"
        description="İklimlendirme sektöründe birikmiş kurumsal deneyimle 2022’de kurulan Proser Grup; Daikin yetkili bayi ve yetkili servis olarak uçtan uca çözüm sunar."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Kurumsal" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Kurumsal", path: "/kurumsal" },
        ])}
      />
      <Section>
        <div className="mb-10 overflow-hidden rounded-3xl">
          <div className="relative aspect-[21/9] min-h-48">
            <Image
              src="/sourced/misc/about.jpg"
              alt="Proser Grup iklimlendirme ekibi ve uygulamaları"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <article className="prose-like space-y-4 text-[var(--slate)]">
            <p>
              Proser Grup; iklimlendirme sektörünün lider firmalarında kazanılan {siteConfig.experienceYears}
              yılı aşkın kurumsal deneyimin verdiği güvene dayanarak {siteConfig.foundedYear} yılında
              kurulmuştur.
            </p>
            <p>
              Konut, ticari ve endüstriyel yapıların iklimlendirme ihtiyaçlarında danışmanlık, ürün
              temini, uygulama, otomasyon ve teknik servis süreçlerini bütünleşik yönetiriz.
            </p>
            <p>
              Bugün resmi konumumuz: <strong className="text-[var(--navy)]">{siteConfig.brandClaim}</strong>.
              Tüm marka ve ürün iletişimimiz onaylı Daikin kurumsal kimlik kurallarına uygundur.
            </p>
            <Button href="/teklif-al">Projeniz için teklif alın</Button>
          </article>
          <div className="grid gap-4">
            {trustPoints.map((item) => (
              <div key={item.title} className="card-surface p-5">
                <h2 className="text-lg font-semibold text-[var(--navy)]">{item.title}</h2>
                <p className="mt-2 text-sm text-[var(--slate)]">{item.description}</p>
              </div>
            ))}
            <div className="card-surface bg-[var(--ice)] p-5 text-sm text-[var(--slate)]">
              <p className="font-semibold text-[var(--navy)]">Merkez</p>
              <p className="mt-2">{contact.address.full}</p>
              <p className="mt-1">{contact.phones[0].display}</p>
              <p>{contact.email}</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
