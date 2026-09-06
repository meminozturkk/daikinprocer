import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/services";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Hizmetler | Satış, Montaj, Bakım, Yetkili Servis",
  description:
    "Daikin satış-projelendirme, montaj, periyodik bakım ve yetkili teknik servis. Proser Grup Kartal.",
  path: "/hizmetler",
});

export default function HizmetlerPage() {
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
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/hizmetler/${service.slug}`}
              className="card-surface block overflow-hidden"
            >
              {service.image ? (
                <div className="relative aspect-[16/9] bg-[var(--ice)]">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--navy)]">{service.name}</h2>
                <p className="mt-3 text-sm text-[var(--slate)]">{service.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
