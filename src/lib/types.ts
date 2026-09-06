export type ProductCategorySlug =
  | "bireysel-klimalar"
  | "multi-split"
  | "ticari-klimalar"
  | "vrv-sistemleri"
  | "isi-pompalari"
  | "havalandirma";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategorySlug;
  series: string;
  summary: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  suitableFor: string[];
  image: string;
  featured?: boolean;
};

export type Category = {
  slug: ProductCategorySlug;
  name: string;
  shortName: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
};

export type Service = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  steps: string[];
  benefits: string[];
  seoTitle: string;
  seoDescription: string;
  image?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  tags: string[];
  content: string[];
  image?: string;
};

export type Reference = {
  name: string;
  sector: string;
  summary: string;
  image?: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type ContactInfo = {
  brandName: string;
  legalName: string;
  tagline: string;
  address: {
    street: string;
    district: string;
    city: string;
    full: string;
  };
  phones: { label: string; display: string; href: string }[];
  email: string;
  whatsapp: { display: string; href: string };
  hours: string;
  serviceArea: string[];
  mapEmbedQuery: string;
};
