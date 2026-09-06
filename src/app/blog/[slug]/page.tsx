import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getPost, posts } from "@/content/blog";
import { createMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;

  return (
    <>
      <PageHero
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[
          { label: "Anasayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          path,
        })}
      />
      <Section>
        <article className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-[var(--slate)]">
          <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--ice)]">
            <Image
              src={post.image ?? "/sourced/hero/slide-1.jpg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 768px"
              priority
            />
          </div>
          <p className="text-sm">
            {post.date} · {post.readingMinutes} dakika okuma
          </p>
          {post.content.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <div className="card-surface mt-10 bg-[var(--ice)] p-6">
            <p className="font-semibold text-[var(--navy)]">Projeniz için doğru ürünü seçelim</p>
            <p className="mt-2 text-sm">Ücretsiz keşif ve teklif için formu doldurun veya WhatsApp yazın.</p>
            <Button href="/teklif-al" className="mt-4">
              Teklif al
            </Button>
          </div>
        </article>
      </Section>
    </>
  );
}
