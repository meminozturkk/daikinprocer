import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { categories } from "@/content/products";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Daikin Ürünler",
  description:
    "Daikin bireysel klima, multi split, Sky Air, VRV, Altherma ve havalandırma ürünleri. Proser Grup yetkili bayi.",
  path: "/urunler",
});

export default function UrunlerPage() {
  return (
    <>
      <PageHero
        title="Daikin Ürünleri"
        description="İhtiyacınıza uygun ürün ailesini seçin; keşif sonrası net teklif hazırlayalım. Fiyatlar uygulamaya göre netleşir."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Ürünler" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Ürünler", path: "/urunler" },
        ])}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/urunler/${cat.slug}`} className="card-surface block overflow-hidden">
              <div className="relative aspect-[4/3] bg-[var(--ice)]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-[var(--navy)]">{cat.name}</h2>
                <p className="mt-2 text-sm text-[var(--slate)]">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
