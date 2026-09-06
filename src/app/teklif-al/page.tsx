import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { QuoteForm } from "@/components/forms/LeadForms";
import { contact } from "@/content/site";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

type Props = { searchParams: Promise<{ urun?: string }> };

export const metadata = createMetadata({
  title: "Ücretsiz Teklif Al",
  description:
    "Daikin klima, VRV ve ısı pompası için ücretsiz keşif ve teklif formu. Proser Grup Kartal.",
  path: "/teklif-al",
});

export default async function TeklifPage({ searchParams }: Props) {
  const { urun } = await searchParams;

  return (
    <>
      <PageHero
        title="Ücretsiz Teklif / Keşif"
        description="İhtiyacınızı yazın; ekibimiz sizi arayıp uygun Daikin çözümünü netleştirsin. Online ödeme yoktur."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Teklif Al" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Teklif Al", path: "/teklif-al" },
        ])}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <QuoteForm defaultProduct={urun} />
          <aside className="card-surface h-fit bg-[var(--ice)] p-6 text-sm text-[var(--slate)]">
            <h2 className="text-lg font-semibold text-[var(--navy)]">Hızlı iletişim</h2>
            <p className="mt-3">Form yerine doğrudan arayabilir veya WhatsApp yazabilirsiniz.</p>
            <p className="mt-4 font-semibold text-[var(--navy)]">{contact.phones[0].display}</p>
            <p>{contact.whatsapp.display} (WhatsApp)</p>
            <p className="mt-4">{contact.hours}</p>
          </aside>
        </div>
      </Section>
    </>
  );
}
