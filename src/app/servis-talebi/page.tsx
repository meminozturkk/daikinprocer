import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ServiceForm } from "@/components/forms/LeadForms";
import { getSiteContent } from "@/lib/site-content";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Daikin Servis Talebi",
  description:
    "Daikin yetkili servis talebi: arıza, bakım, montaj-demontaj. Proser Grup Kartal / İstanbul.",
  path: "/servis-talebi",
});

export default async function ServisTalebiPage() {
  const siteContent = await getSiteContent();
  const contact = siteContent.contact;
  const servisData = siteContent.pages?.servisTalebi;

  const whatsappServiceHref = getWhatsAppUrl(
    contact.whatsapp,
    "Merhaba, Daikin cihazım için yetkili servis / arıza / bakım talebinde bulunmak istiyorum."
  );

  return (
    <>
      <PageHero
        title={servisData?.title || "Servis Talebi"}
        description={
          servisData?.description ||
          "Arıza, bakım veya yerinde kontrol için talebinizi iletin. Yetkili servis ekibimiz dönüş yapar."
        }
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Servis Talebi" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Servis Talebi", path: "/servis-talebi" },
        ])}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-emerald-950 text-base">Hızlı Servis Kaydı mı İstiyorsunuz?</p>
                <p className="text-sm text-emerald-800 mt-0.5">
                  Form doldurmak yerine doğrudan WhatsApp servis hattımıza yazarak anında kayıt oluşturabilirsiniz.
                </p>
              </div>
              <Button
                href={whatsappServiceHref}
                variant="whatsapp"
                external
                className="shrink-0 whitespace-nowrap shadow-md shadow-emerald-600/20"
              >
                WhatsApp ile Servis Talebi İlet
              </Button>
            </div>
            <ServiceForm />
          </div>

          <aside className="card-surface h-fit p-6 text-sm text-[var(--slate)]">
            <h2 className="text-lg font-semibold text-[var(--navy)]">Hızlı İletişim & WhatsApp</h2>
            <p className="mt-3">
              Yetkili teknik ekibimizle anında görüşmek için WhatsApp hattımızdan yazabilirsiniz:
            </p>
            <div className="mt-4">
              <Button
                href={whatsappServiceHref}
                variant="whatsapp"
                external
                className="w-full justify-center"
              >
                WhatsApp ile Servis Talebi
              </Button>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--slate)]">Acil Telefon Hatları</p>
              <a
                href={`tel:${contact.phoneLandline.replace(/[\s-]/g, "")}`}
                className="mt-2 block text-xl font-bold text-[var(--navy)] hover:text-[var(--daikin-blue)] transition"
              >
                {contact.phoneLandline}
              </a>
              {contact.phoneMobile ? (
                <a
                  href={`tel:${contact.phoneMobile.replace(/[\s-]/g, "")}`}
                  className="mt-1 block font-semibold text-[var(--navy)] hover:text-[var(--daikin-blue)] transition"
                >
                  {contact.phoneMobile}
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
