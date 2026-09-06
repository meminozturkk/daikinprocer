import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { contact } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "KVKK Aydınlatma Metni",
  description: "Proser Grup KVKK aydınlatma metni ve kişisel veri işleme esasları.",
  path: "/kvkk",
});

export default function KvkkPage() {
  return (
    <>
      <PageHero
        title="KVKK Aydınlatma Metni"
        description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "KVKK" },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-[var(--slate)]">
          <p>
            Veri sorumlusu: {contact.legalName}, {contact.address.full}. İletişim: {contact.email},{" "}
            {contact.phones[0].display}.
          </p>
          <p>
            Web sitesi üzerindeki teklif, servis ve iletişim formları aracılığıyla ilettiğiniz ad
            soyad, telefon, e-posta, adres ve talep içeriği; talebinizin karşılanması, geri dönüş
            yapılması ve müşteri ilişkileri süreçlerinin yürütülmesi amacıyla işlenir.
          </p>
          <p>
            Verileriniz, yasal yükümlülükler ve meşru menfaat kapsamında gerekli süre boyunca
            saklanır; hizmet aldığımız e-posta / barındırma sağlayıcıları dışında üçüncü taraflarla
            pazarlama amacıyla paylaşılmaz.
          </p>
          <p>
            KVKK kapsamındaki haklarınız için {contact.email} adresine başvurabilirsiniz. Bu metin
            genel bilgilendirme niteliğindedir; yayına alınmadan önce hukuk danışmanı ile
            güncellenmelidir.
          </p>
        </div>
      </Section>
    </>
  );
}
