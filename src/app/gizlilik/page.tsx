import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Gizlilik Politikası",
  description: "Proser Grup web sitesi gizlilik politikası.",
  path: "/gizlilik",
});

export default function GizlilikPage() {
  return (
    <>
      <PageHero
        title="Gizlilik Politikası"
        description="Sitede toplanan veriler, çerezler ve üçüncü taraf araçlara ilişkin özet politika."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Gizlilik" },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-[var(--slate)]">
          <p>
            Proser Grup olarak ziyaretçi gizliliğine önem veriyoruz. Formlar dışında zorunlu olmayan
            pazarlama çerezleri, açık rıza olmadan çalıştırılmaz.
          </p>
          <p>
            Analitik araçlar kullanıldığında anonimleştirilmiş kullanım verileri toplanabilir.
            Harita gömme gibi üçüncü taraf servisler kendi gizlilik politikalarına tabidir.
          </p>
          <p>
            Daikin marka varlıkları ilgili hak sahiplerine aittir. Sitedeki içerikler izinsiz
            kopyalanamaz. Detaylı metin yayından önce hukuki gözden geçirmeden geçirilmelidir.
          </p>
        </div>
      </Section>
    </>
  );
}
