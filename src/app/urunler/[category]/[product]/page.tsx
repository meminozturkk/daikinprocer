import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getCategory, getProduct, products } from "@/content/products";
import { createMetadata, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ category: string; product: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ category: p.category, product: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { product: slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return createMetadata({
    title: product.name,
    description: product.summary,
    path: `/urunler/${product.category}/${product.slug}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { category, product: slug } = await params;
  const product = getProduct(slug);
  const cat = getCategory(category);
  if (!product || !cat || product.category !== category) notFound();

  const path = `/urunler/${product.category}/${product.slug}`;

  return (
    <>
      <PageHero
        title={product.name}
        description={product.summary}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Ürünler", href: "/urunler" },
          { label: cat.name, href: `/urunler/${cat.slug}` },
          { label: product.name },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Ürünler", path: "/urunler" },
          { name: cat.name, path: `/urunler/${cat.slug}` },
          { name: product.name, path },
        ])}
      />
      <JsonLd
        data={productJsonLd({
          name: product.name,
          summary: product.summary,
          image: product.image,
          path,
        })}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card-surface flex min-h-[280px] items-center justify-center bg-[var(--ice)] p-6 sm:min-h-[360px] sm:p-10">
            <Image
              src={product.image}
              alt={`${product.name} görseli`}
              width={640}
              height={480}
              className="mx-auto h-auto max-h-[420px] w-full max-w-lg object-contain"
              priority
            />
          </div>
          <div>
            <p className="eyebrow">
              {product.series} serisi
              {product.modelCode ? ` · ${product.modelCode}` : ""}
            </p>
            {product.subcategory ? (
              <p className="mt-2 text-sm text-[var(--slate)]">{product.subcategory}</p>
            ) : null}
            <ul className="mt-6 grid gap-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-[var(--slate)]">
                  <span className="text-[var(--daikin-blue)]">✓</span> {h}
                </li>
              ))}
            </ul>
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <tbody>
                  {product.specs.map((spec) => (
                    <tr key={spec.label} className="border-b border-slate-100">
                      <th className="bg-[var(--ice)] px-4 py-3 font-medium text-[var(--navy)]">
                        {spec.label}
                      </th>
                      <td className="px-4 py-3 text-[var(--slate)]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm text-[var(--slate)]">
              Uygun alanlar: {product.suitableFor.join(", ")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`/teklif-al?urun=${encodeURIComponent(product.name)}`} size="lg">
                Bu ürün için teklif al
              </Button>
              <Button href="/hizmetler/montaj" variant="ghost" size="lg">
                Montaj hakkında
              </Button>
            </div>
            <p className="mt-4 text-xs text-[var(--slate)]">
              Teknik değerler modele göre değişir. Güncel katalog bilgisi teklif sürecinde
              paylaşılır. Sitede uydurma fiyat yayınlanmaz.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
