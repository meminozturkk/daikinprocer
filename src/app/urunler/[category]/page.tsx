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
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

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
  const cat = getCategory(category);
  if (!cat) notFound();
  const items = getProductsByCategory(cat.slug);
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
          <Button href={`/teklif-al?urun=${encodeURIComponent(cat.name)}`}>
            Bu kategori için teklif
          </Button>
          <Button href="/servis-talebi" variant="ghost">
            Servis talebi
          </Button>
        </div>
        <ProductCatalogGrid products={items} seriesList={seriesList} />
      </Section>
    </>
  );
}
