import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { contact } from "@/content/site";
import { createMetadata, breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createMetadata({
  title: "İletişim | Daikin Bayi Kartal",
  description:
    "Proser Grup iletişim: Kartal adres, telefon, e-posta ve WhatsApp. Daikin yetkili bayi ve servis.",
  path: "/iletisim",
});

export default function IletisimPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapEmbedQuery)}&output=embed`;

  return (
    <>
      <PageHero
        title="İletişim"
        description="Keşif, teklif veya servis için bize ulaşın. Kartal merkezli ekibimiz Anadolu Yakası’nda yanınızda."
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
            <h2 className="text-xl font-semibold text-[var(--navy)]">İletişim bilgileri</h2>
            <p className="text-sm text-[var(--slate)]">{contact.address.full}</p>
            {contact.phones.map((phone) => (
              <p key={phone.href} className="text-sm">
                <span className="text-[var(--slate)]">{phone.label}: </span>
                <a href={phone.href} className="font-semibold text-[var(--navy)] hover:text-[var(--daikin-blue)]">
                  {phone.display}
                </a>
              </p>
            ))}
            <p className="text-sm">
              <a href={`mailto:${contact.email}`} className="font-semibold text-[var(--navy)]">
                {contact.email}
              </a>
            </p>
            <p className="text-sm text-[var(--slate)]">{contact.hours}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/teklif-al">Teklif formu</Button>
              <Button href="/servis-talebi" variant="secondary">
                Servis formu
              </Button>
              <Button href={contact.whatsapp.href} variant="whatsapp" external>
                WhatsApp
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <iframe
              title="Proser Grup harita konumu"
              src={mapSrc}
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
