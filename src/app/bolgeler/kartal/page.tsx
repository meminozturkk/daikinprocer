import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { faqs } from "@/content/blog";
import { contact } from "@/content/site";
import { createMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = createMetadata({
  title: "Kartal Daikin Yetkili Bayi ve Servis",
  description:
    "Kartal Daikin klima bayi ve yetkili servis. Montaj, bakım, VRV ve bireysel klima. Proser Grup.",
  path: "/bolgeler/kartal",
});

export default function KartalPage() {
  return (
    <>
      <PageHero
        title="Kartal Daikin Yetkili Bayi ve Servis"
        description="Proser Grup, Kartal merkezli Daikin yetkili bayi ve yetkili servis noktasıdır. Anadolu Yakası’nda keşif, satış, montaj ve teknik servis sunar."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Bölgeler" },
          { label: "Kartal" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Kartal", path: "/bolgeler/kartal" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs.slice(0, 3))} />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="space-y-4 text-[var(--slate)]">
            <p>
              Kartal ve çevresinde Daikin split klima, multi sistem, Sky Air, VRV ve Altherma
              çözümleri için yerinde keşif yapıyoruz. Yetkili servis kapsamında arıza, bakım ve
              orijinal yedek parça desteği sağlıyoruz.
            </p>
            <p>
              Hizmet verdiğimiz yakın ilçeler: {contact.serviceArea.join(", ")}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/teklif-al">Kartal keşif / teklif</Button>
              <Button href="/servis-talebi" variant="secondary">
                Kartal servis talebi
              </Button>
            </div>
          </article>
          <div className="card-surface p-6">
            <h2 className="text-lg font-semibold text-[var(--navy)]">Merkez adres</h2>
            <p className="mt-3 text-sm text-[var(--slate)]">{contact.address.full}</p>
            <p className="mt-2 font-semibold text-[var(--navy)]">{contact.phones[0].display}</p>
            <p className="text-sm text-[var(--slate)]">{contact.hours}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
