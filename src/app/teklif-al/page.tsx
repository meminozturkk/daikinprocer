import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { QuoteForm } from "@/components/forms/LeadForms";
import { contact } from "@/content/site";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";

type Props = { searchParams: Promise<{ urun?: string }> };

export const metadata = createMetadata({
  title: "Ücretsiz Teklif Al",
  description:
    "Daikin klima, VRV ve ısı pompası için ücretsiz keşif ve teklif formu. Proser Grup Kartal.",
  path: "/teklif-al",
});

export default async function TeklifPage({ searchParams }: Props) {
  const { urun } = await searchParams;
  const whatsappOfferHref = getWhatsAppUrl(
    contact.whatsapp.display,
    urun ? `Merhaba, ${urun} hakkında fiyat ve keşif teklifi almak istiyorum.` : "Merhaba, Daikin ürün ve sistemleri hakkında teklif almak istiyorum."
  );

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
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-emerald-950 text-base">Hızlı Teklif mi İstiyorsunuz?</p>
                <p className="text-sm text-emerald-800 mt-0.5">Form doldurmakla vakit kaybetmeden doğrudan WhatsApp üzerinden yetkili temsilcimizle görüşün.</p>
              </div>
              <Button
                href={whatsappOfferHref}
                variant="whatsapp"
                external
                className="shrink-0 whitespace-nowrap shadow-md shadow-emerald-600/20"
              >
                WhatsApp ile Teklif Al
              </Button>
            </div>
            <QuoteForm defaultProduct={urun} />
          </div>

          <aside className="card-surface h-fit bg-[var(--ice)] p-6 text-sm text-[var(--slate)]">
            <h2 className="text-lg font-semibold text-[var(--navy)]">Hızlı İletişim & WhatsApp</h2>
            <p className="mt-3">Form yerine doğrudan WhatsApp hattımızdan anında keşif ve fiyat teklifi alabilirsiniz.</p>
            <div className="mt-4">
              <Button
                href={whatsappOfferHref}
                variant="whatsapp"
                external
                className="w-full justify-center"
              >
                WhatsApp ile Yazın
              </Button>
            </div>
            <p className="mt-5 font-semibold text-[var(--navy)]">{contact.phones[0].display}</p>
            <p>{contact.whatsapp.display} (WhatsApp)</p>
            <p className="mt-3 text-xs">{contact.hours}</p>
          </aside>
        </div>
      </Section>
    </>
  );
}
