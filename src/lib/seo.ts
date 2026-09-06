import type { Metadata } from "next";
import { contact, siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/utils";

export function createMetadata({
  title,
  description,
  path = "/",
  image = "/og-default.svg",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes("Proser")
    ? title
    : `${title} | ${contact.brandName}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: contact.brandName,
      title: fullTitle,
      description,
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(image)],
    },
    robots: { index: true, follow: true },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HVACBusiness", "LocalBusiness"],
    name: contact.legalName,
    alternateName: contact.brandName,
    description: contact.tagline,
    url: siteConfig.siteUrl,
    telephone: contact.phones[0]?.display,
    email: contact.email,
    image: absoluteUrl("/sourced/brand/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.district,
      addressRegion: contact.address.city,
      addressCountry: "TR",
    },
    areaServed: contact.serviceArea.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    openingHours: "Mo-Sa 09:00-18:00",
    sameAs: [],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  summary: string;
  image: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    brand: { "@type": "Brand", name: "Daikin" },
    image: absoluteUrl(product.image),
    url: absoluteUrl(product.path),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "TRY",
      url: absoluteUrl("/teklif-al"),
      description: "Fiyat için teklif alın",
    },
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "HVACBusiness",
      name: contact.legalName,
    },
    areaServed: contact.serviceArea.join(", "),
    url: absoluteUrl(service.path),
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  date: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: contact.brandName },
    publisher: { "@type": "Organization", name: contact.brandName },
    mainEntityOfPage: absoluteUrl(post.path),
  };
}
