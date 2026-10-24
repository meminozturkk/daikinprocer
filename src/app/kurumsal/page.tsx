import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getSiteContent } from "@/lib/site-content";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Kurumsal | Daikin Yetkili Bayi ve Servis",
  description:
    "Proser Grup kurumsal hikâye: 2022 kuruluş, 10+ yıl sektör deneyimi, Daikin yetkili bayi ve yetkili servis.",
  path: "/kurumsal",
});

export default async function KurumsalPage() {
  const siteContent = await getSiteContent();
  const kurumsalData = siteContent.pages?.kurumsal;
  const brandName = siteContent.contact.brandName || "Proser Grup";

  const paragraphs = kurumsalData?.paragraphs && kurumsalData.paragraphs.length > 0
    ? kurumsalData.paragraphs
    : [
        `Proser Grup; iklimlendirme sektörünün lider firmalarında kazanılan ${siteContent.hero.experienceYears} yılı aşkın kurumsal deneyimin verdiği güvene dayanarak 2022 yılında kurulmuştur.`,
        "Konut, ticari ve endüstriyel yapıların iklimlendirme ihtiyaçlarında danışmanlık, ürün temini, uygulama, otomasyon ve teknik servis süreçlerini bütünleşik yönetiriz.",
        `Bugün resmi konumumuz: Daikin Yetkili Bayi ve Yetkili Servis. Tüm marka ve ürün iletişimimiz onaylı Daikin kurumsal kimlik kurallarına uygundur.`,
      ];

  const whatsappHref = getWhatsAppUrl(
    siteContent.contact.whatsapp,
    "Merhaba, projemiz için kurumsal iklimlendirme teklifi almak istiyorum."
  );

  return (
    <>
      <PageHero
        title={kurumsalData?.title || "Kurumsal"}
        description={
          kurumsalData?.description ||
          `İklimlendirme sektöründe birikmiş kurumsal deneyimle 2022’de kurulan ${brandName}; Daikin yetkili bayi ve yetkili servis olarak uçtan uca çözüm sunar.`
        }
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
              alt={`${brandName} Daikin yetkili bayi ekibi ve uygulamaları`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <article className="prose-like space-y-4 text-[var(--slate)]">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <div className="pt-2">
              <Button href={whatsappHref} external>
                WhatsApp ile Teklif Alın
              </Button>
            </div>
          </article>
          <div className="grid gap-4">
            {siteContent.trustPoints.map((item) => (
              <div key={item.title} className="card-surface p-5">
                <h2 className="text-lg font-semibold text-[var(--navy)]">{item.title}</h2>
                <p className="mt-2 text-sm text-[var(--slate)]">{item.description}</p>
              </div>
            ))}
            <div className="card-surface bg-[var(--ice)] p-5 text-sm text-[var(--slate)]">
              <p className="font-semibold text-[var(--navy)]">Hizmet Merkezi</p>
              <p className="mt-2">{siteContent.contact.addressFull}</p>
              <p className="mt-1 font-semibold text-[var(--navy)]">{siteContent.contact.phoneLandline}</p>
              <p>{siteContent.contact.email}</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
