import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getService, services } from "@/content/services";
import { createMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return createMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/hizmetler/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
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
            <h2 className="mt-8 text-xl font-semibold text-[var(--navy)]">Süreç</h2>
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
          </div>
          <div className="card-surface p-6">
            <h2 className="text-lg font-semibold text-[var(--navy)]">Faydalar</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--slate)]">
              {service.benefits.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={slug === "yetkili-servis" || slug === "bakim" ? "/servis-talebi" : "/teklif-al"}>
                {slug === "yetkili-servis" || slug === "bakim" ? "Servis talebi oluştur" : "Teklif al"}
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
