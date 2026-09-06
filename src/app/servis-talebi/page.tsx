import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ServiceForm } from "@/components/forms/LeadForms";
import { contact } from "@/content/site";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Daikin Servis Talebi",
  description:
    "Daikin yetkili servis talebi: arıza, bakım, montaj-demontaj. Proser Grup Kartal / İstanbul.",
  path: "/servis-talebi",
});

export default function ServisTalebiPage() {
  return (
    <>
      <PageHero
        title="Servis Talebi"
        description="Arıza, bakım veya yerinde kontrol için talebinizi iletin. Yetkili servis ekibimiz dönüş yapar."
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
          <ServiceForm />
          <aside className="card-surface h-fit p-6 text-sm text-[var(--slate)]">
            <h2 className="text-lg font-semibold text-[var(--navy)]">Acil hatlar</h2>
            <p className="mt-3">
              Acil durumlarda formu beklemeden arayın:
            </p>
            <a href={contact.phones[0].href} className="mt-4 block text-xl font-bold text-[var(--navy)]">
              {contact.phones[0].display}
            </a>
            <a href={contact.phones[1].href} className="mt-2 block font-semibold text-[var(--navy)]">
              {contact.phones[1].display}
            </a>
          </aside>
        </div>
      </Section>
    </>
  );
}
