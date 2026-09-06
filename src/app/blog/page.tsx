import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { posts } from "@/content/blog";
import { createMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Blog | Klima ve İklimlendirme Rehberleri",
  description:
    "Daikin klima seçimi, enerji sınıfı, bakım, VRV ve Altherma rehberleri. Proser Grup blog.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog"
        description="Özgün ve uzman onaylı iklimlendirme içerikleri. SEO için düzenli güncellenir."
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Blog" },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-surface block overflow-hidden">
              <div className="relative aspect-[16/10] bg-[var(--ice)]">
                <Image
                  src={post.image ?? "/sourced/hero/slide-1.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-[var(--slate)]">
                  {post.date} · {post.readingMinutes} dk
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[var(--navy)]">{post.title}</h2>
                <p className="mt-2 text-sm text-[var(--slate)]">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--mist)] px-2 py-1 text-xs text-[var(--daikin-blue-dark)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
