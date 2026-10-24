import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getSiteContent } from "@/lib/site-content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "KVKK Aydınlatma Metni",
  description: "Proser Grup KVKK aydınlatma metni ve kişisel veri işleme esasları.",
  path: "/kvkk",
});

export default async function KvkkPage() {
  const siteContent = await getSiteContent();
  const contact = siteContent.contact;
  const kvkkData = siteContent.pages?.kvkk;

  const paragraphs = kvkkData?.paragraphs && kvkkData.paragraphs.length > 0
    ? kvkkData.paragraphs
    : [
        `Veri sorumlusu: ${contact.legalName || contact.brandName}, ${contact.addressFull}. İletişim: ${contact.email}, ${contact.phoneLandline}.`,
        "Web sitesi üzerindeki teklif, servis ve iletişim formları aracılığıyla ilettiğiniz ad soyad, telefon, e-posta, adres ve talep içeriği; talebinizin karşılanması, geri dönüş yapılması ve müşteri ilişkileri süreçlerinin yürütülmesi amacıyla işlenir.",
        "Verileriniz, yasal yükümlülükler ve meşru menfaat kapsamında gerekli süre boyunca saklanır; hizmet aldığımız e-posta / barındırma sağlayıcıları dışında üçüncü taraflarla pazarlama amacıyla paylaşılmaz.",
        `KVKK kapsamındaki haklarınız için ${contact.email} adresine başvurabilirsiniz.`,
      ];

  return (
    <>
      <PageHero
        title={kvkkData?.title || "KVKK Aydınlatma Metni"}
        description={
          kvkkData?.description ||
          "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme."
        }
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "KVKK" },
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
