import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ProductCatalogGrid } from "@/components/products/ProductCatalogGrid";
import {
  categories,
  getCategory,
  getProductsByCategory,
  getSeriesForCategory,
} from "@/content/products";
import { getSiteContent } from "@/lib/site-content";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { contact } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/utils";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return createMetadata({
    title: cat.seoTitle,
    description: cat.seoDescription,
    path: `/urunler/${cat.slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const siteContent = await getSiteContent();
  const cat = getCategory(category, siteContent.categoryOverrides);
  if (!cat) notFound();
  const items = getProductsByCategory(cat.slug, siteContent.productImages);
  const seriesList = getSeriesForCategory(cat.slug);

  return (
    <>
      <PageHero
        title={cat.name}
        description={cat.description}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Ürünler", href: "/urunler" },
          { label: cat.name },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Ürünler", path: "/urunler" },
          { name: cat.name, path: `/urunler/${cat.slug}` },
        ])}
      />
      <Section>
        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            href={getWhatsAppUrl(
              contact.whatsapp.display,
              `Merhaba, ${cat.name} kategorisindeki Daikin ürünleri için teklif almak istiyorum.`
            )}
            variant="whatsapp"
            external
          >
            WhatsApp ile Teklif Al
          </Button>
          <Button href={`/teklif-al?urun=${encodeURIComponent(cat.name)}`} variant="ghost">
            Teklif Formu
          </Button>
          <Button
            href={getWhatsAppUrl(contact.whatsapp.display, `Merhaba, ${cat.name} ürünleri için yetkili servis talebinde bulunmak istiyorum.`)}
            variant="ghost"
            external
          >
            Servis Talebi
          </Button>
        </div>
        <ProductCatalogGrid products={items} seriesList={seriesList} />
      </Section>
    </>
  );
}
