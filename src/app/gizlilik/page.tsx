import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getSiteContent } from "@/lib/site-content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Gizlilik Politikası",
  description: "Proser Grup web sitesi gizlilik politikası.",
  path: "/gizlilik",
});

export default async function GizlilikPage() {
  const siteContent = await getSiteContent();
  const gizlilikData = siteContent.pages?.gizlilik;

  const paragraphs = gizlilikData?.paragraphs && gizlilikData.paragraphs.length > 0
    ? gizlilikData.paragraphs
    : [
        "Proser Grup olarak ziyaretçi gizliliğine önem veriyoruz. Formlar dışında zorunlu olmayan pazarlama çerezleri, açık rıza olmadan çalıştırılmaz.",
        "Analitik araçlar kullanıldığında anonimleştirilmiş kullanım verileri toplanabilir. Harita gömme gibi üçüncü taraf servisler kendi gizlilik politikalarına tabidir.",
        "Daikin marka varlıkları ilgili hak sahiplerine aittir. Sitedeki içerikler izinsiz kopyalanamaz.",
      ];

  return (
    <>
      <PageHero
        title={gizlilikData?.title || "Gizlilik Politikası"}
        description={
          gizlilikData?.description ||
          "Sitede toplanan veriler, çerezler ve üçüncü taraf araçlara ilişkin özet politika."
        }
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Gizlilik" },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-[var(--slate)]">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </Section>
    </>
  );
}
