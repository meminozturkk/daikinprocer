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
  const fullTitle = title.includes("Daikin")
    ? title.includes("Proser")
      ? title
      : `${title} | Proser Grup Daikin Yetkili Bayi`
    : `${title} | Daikin Yetkili Bayi Proser Grup`;

  return {
    // Bypass root layout title template to avoid "Brand | Brand" duplication.
    title: { absolute: fullTitle },
    description,
    metadataBase: new URL(siteConfig.siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: "Daikin Yetkili Bayi - Proser Grup",
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HVACBusiness", "LocalBusiness"],
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: "Proser Grup - Daikin Yetkili Bayi ve Yetkili Servis",
    alternateName: ["Daikin Proser Grup", "Daikin Kartal Yetkili Bayi", "Daikin Yetkili Servis Kartal"],
    legalName: contact.legalName,
    description: "Kartal ve İstanbul Anadolu Yakası resmi Daikin Yetkili Bayi ve Yetkili Servisi. Daikin inverter klimalar, VRV merkezi iklimlendirme sistemleri, Altherma ısı pompaları, mühendislik keşfi, garantili montaj ve teknik servis desteği.",
    url: siteConfig.siteUrl,
    telephone: contact.phones[0]?.display,
    email: contact.email,
    image: absoluteUrl("/sourced/brand/logo.png"),
    logo: absoluteUrl("/brand/daikin-logo.svg"),
    priceRange: "$$",
    currenciesAccepted: "TRY",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    brand: {
      "@type": "Brand",
      name: "Daikin",
      url: "https://www.daikin.com.tr",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "40.9167",
      longitude: "29.2167",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.district,
      addressRegion: contact.address.city,
      postalCode: "34870",
      addressCountry: "TR",
    },
    areaServed: contact.serviceArea.map((name) => ({
      "@type": "AdministrativeArea",
      name: `${name}, İstanbul`,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    knowsAbout: [
      "Daikin",
      "Daikin Yetkili Bayi",
      "Daikin Yetkili Servis",
      "Daikin Bireysel Klimalar (Sensira, Shira Plus, Perfera, Emura, Stylish, Ururu Sarara)",
      "Daikin Multi Split Klima Sistemleri",
      "Daikin Sky Air Ticari Klimalar",
      "Daikin VRV IV ve VRV V Merkezi İklimlendirme",
      "Daikin Altherma Isı Pompası Sistemleri",
      "Klima Montajı, Borulama, Vakumlama ve Devreye Alma",
      "Klima Periyodik Bakımı, Filtre Hijyeni ve Gaz Şarjı",
      "Kartal ve İstanbul Anadolu Yakası İklimlendirme Mühendisliği",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Daikin İklimlendirme Ürün ve Hizmetleri",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Daikin Klimalar ve Isı Pompaları",
        },
        {
          "@type": "OfferCatalog",
          name: "Daikin Yetkili Servis, Montaj ve Bakım Hizmetleri",
        },
      ],
    },
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
