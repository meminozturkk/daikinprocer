import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { categories, products } from "@/content/products";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;
  const now = new Date();

  const staticRoutes = [
    "",
    "/kurumsal",
    "/urunler",
    "/hizmetler",
    "/referanslar",
    "/blog",
    "/iletisim",
    "/teklif-al",
    "/servis-talebi",
    "/kvkk",
    "/gizlilik",
    "/bolgeler/kartal",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/urunler/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/urunler/${p.category}/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${base}/hizmetler/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...serviceRoutes, ...blogRoutes];
}
