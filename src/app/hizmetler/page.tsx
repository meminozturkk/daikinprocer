import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { services as defaultServices } from "@/content/services";
import { getSiteContent } from "@/lib/site-content";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Hizmetler | Satış, Montaj, Bakım, Yetkili Servis",
  description:
    "Daikin satış-projelendirme, montaj, periyodik bakım ve yetkili teknik servis. Proser Grup Kartal.",
  path: "/hizmetler",
});

export default async function HizmetlerPage() {
  const siteContent = await getSiteContent();
  const serviceList = siteContent.services && siteContent.services.length > 0
    ? siteContent.services
    : defaultServices;

  return (
    <>
      <PageHero
        title="Hizmetlerimiz"
        description="Keşiften satış sonrası bakıma kadar Daikin standartlarında uçtan uca hizmet."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Hizmetler" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Hizmetler", path: "/hizmetler" },
        ])}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {serviceList.map((service) => (
            <Link
              key={service.slug}
              href={`/hizmetler/${service.slug}`}
              className="card-surface block overflow-hidden group hover:border-[var(--daikin-blue)] transition"
            >
              {service.image ? (
                <div className="relative aspect-[16/9] bg-[var(--ice)] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--navy)] group-hover:text-[var(--daikin-blue)] transition">
                  {service.name}
                </h2>
                <p className="mt-3 text-sm text-[var(--slate)] leading-relaxed">{service.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
