import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getService, services } from "@/content/services";
import { getSiteContent } from "@/lib/site-content";
import { createMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getWhatsAppUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const siteContent = await getSiteContent();
  const list = siteContent.services && siteContent.services.length > 0 ? siteContent.services : services;
  return list.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const siteContent = await getSiteContent();
  const service = siteContent.services?.find((s) => s.slug === slug) || getService(slug);
  if (!service) return {};
  return createMetadata({
    title: service.seoTitle || `${service.name} | Daikin Yetkili Servis`,
    description: service.seoDescription || service.summary,
    path: `/hizmetler/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const siteContent = await getSiteContent();
  const service = siteContent.services?.find((s) => s.slug === slug) || getService(slug);
  if (!service) notFound();

  const contact = siteContent.contact;
  const path = `/hizmetler/${service.slug}`;

  return (
    <>
      <PageHero
        title={service.name}
        description={service.summary}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Hizmetler", href: "/hizmetler" },
          { label: service.name },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Hizmetler", path: "/hizmetler" },
          { name: service.name, path },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: service.description,
          path,
        })}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[var(--slate)] leading-relaxed">{service.description}</p>
            {service.steps && service.steps.length > 0 && (
              <>
                <h2 className="mt-8 text-xl font-semibold text-[var(--navy)]">Süreç ve Aşamalar</h2>
                <ol className="mt-4 space-y-3">
                  {service.steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm text-[var(--slate)]">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--mist)] text-xs font-bold text-[var(--daikin-blue-dark)]">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
          <div className="card-surface p-6">
            {service.benefits && service.benefits.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-[var(--navy)]">Faydalar ve Standartlar</h2>
                <ul className="mt-4 space-y-2 text-sm text-[var(--slate)]">
                  {service.benefits.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={getWhatsAppUrl(
                  contact.whatsapp,
                  `Merhaba, ${service.name} hizmetiniz hakkında bilgi ve talep oluşturmak istiyorum.`
                )}
                variant="whatsapp"
                external
              >
                {slug === "yetkili-servis" || slug === "bakim" ? "WhatsApp ile Servis Talebi" : "WhatsApp ile Teklif Al"}
              </Button>
              <Button href={slug === "yetkili-servis" || slug === "bakim" ? "/servis-talebi" : "/teklif-al"} variant="ghost">
                Online Form
              </Button>
              <Button href="/iletisim" variant="ghost">
                İletişim
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
