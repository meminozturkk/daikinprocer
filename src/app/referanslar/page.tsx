import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { references } from "@/content/blog";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Referanslar",
  description: "Proser Grup referans projeleri: kamu, perakende, turizm, eğitim ve endüstriyel.",
  path: "/referanslar",
});

export default function ReferanslarPage() {
  return (
    <>
      <PageHero
        title="Referanslar"
        description="Farklı sektörlerde tamamlanan iklimlendirme uygulamalarından seçilmiş referanslar. Logo kullanımı için yazılı izin süreçleri yönetilir."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Referanslar" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Referanslar", path: "/referanslar" },
        ])}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {references.map((ref) => (
            <article key={ref.name} className="card-surface overflow-hidden p-5">
              {ref.image ? (
                <div className="mb-4 flex h-20 items-center justify-center rounded-xl bg-[var(--ice)] p-3">
                  <Image
                    src={ref.image}
                    alt={`${ref.name} logosu`}
                    width={140}
                    height={56}
                    className="max-h-14 w-auto object-contain"
                  />
                </div>
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--daikin-blue)]">
                {ref.sector}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--navy)]">{ref.name}</h2>
              <p className="mt-2 text-sm text-[var(--slate)]">{ref.summary}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
