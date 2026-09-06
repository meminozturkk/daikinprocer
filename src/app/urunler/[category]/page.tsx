import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { categories, getCategory, getProductsByCategory } from "@/content/products";
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
          <Button href={`/teklif-al?urun=${encodeURIComponent(cat.name)}`}>Bu kategori için teklif</Button>
          <Button href="/servis-talebi" variant="ghost">
            Servis talebi
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((product) => (
            <Link
              key={product.slug}
              href={`/urunler/${product.category}/${product.slug}`}
              className="card-surface flex gap-4 overflow-hidden p-0"
            >
              <div className="relative h-28 w-36 shrink-0 bg-[var(--ice)] sm:h-32 sm:w-44">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="176px"
                />
              </div>
              <div className="p-4 pr-5">
                <h2 className="text-lg font-semibold text-[var(--navy)]">{product.name}</h2>
                <p className="mt-2 text-sm text-[var(--slate)]">{product.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
