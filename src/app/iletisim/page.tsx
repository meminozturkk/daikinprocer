import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getSiteContent } from "@/lib/site-content";
import { createMetadata, breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata = createMetadata({
  title: "İletişim | Daikin Bayi Kartal",
  description:
    "Proser Grup iletişim: Kartal adres, telefon, e-posta ve WhatsApp. Daikin yetkili bayi ve servis.",
  path: "/iletisim",
});

export default async function IletisimPage() {
  const siteContent = await getSiteContent();
  const contact = siteContent.contact;
  const iletisimPageData = siteContent.pages?.iletisim;

  const mapQuery = `${contact.addressFull || "Kartal İstanbul"}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const whatsappHref = getWhatsAppUrl(contact.whatsapp);

  return (
    <>
      <PageHero
        title={iletisimPageData?.title || "İletişim"}
        description={
          iletisimPageData?.description ||
          `Keşif, teklif veya servis için bize ulaşın. ${contact.district} merkezli ekibimiz tüm bölgelerde yanınızda.`
        }
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "İletişim" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "İletişim", path: "/iletisim" },
        ])}
      />
      <JsonLd data={localBusinessJsonLd()} />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card-surface space-y-4 p-6">
            <h2 className="text-xl font-semibold text-[var(--navy)]">İletişim Bilgileri</h2>
            <p className="text-sm text-[var(--slate)] leading-relaxed">{contact.addressFull}</p>

            <div className="space-y-2 pt-2">
              <p className="text-sm">
                <span className="text-[var(--slate)]">Sabit Hat: </span>
                <a
                  href={`tel:${contact.phoneLandline.replace(/[\s-]/g, "")}`}
                  className="font-semibold text-[var(--navy)] hover:text-[var(--daikin-blue)]"
                >
                  {contact.phoneLandline}
                </a>
              </p>
              {contact.phoneMobile ? (
                <p className="text-sm">
                  <span className="text-[var(--slate)]">Mobil / GSM: </span>
                  <a
                    href={`tel:${contact.phoneMobile.replace(/[\s-]/g, "")}`}
                    className="font-semibold text-[var(--navy)] hover:text-[var(--daikin-blue)]"
                  >
                    {contact.phoneMobile}
                  </a>
                </p>
              ) : null}
              <p className="text-sm">
                <span className="text-[var(--slate)]">E-posta: </span>
                <a href={`mailto:${contact.email}`} className="font-semibold text-[var(--navy)] hover:underline">
                  {contact.email}
                </a>
              </p>
              <p className="text-sm text-[var(--slate)]">
                <span className="font-medium text-[var(--navy)]">Çalışma Saatleri: </span>
                {contact.hours}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button href="/teklif-al">Ücretsiz Teklif Formu</Button>
              <Button href="/servis-talebi" variant="secondary">
                Yetkili Servis Formu
              </Button>
              <Button href={whatsappHref} variant="whatsapp" external>
                WhatsApp İletişim
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm min-h-[320px]">
            <iframe
              title="Daikin Yetkili Bayi harita konumu"
              src={mapSrc}
              className="h-full w-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
