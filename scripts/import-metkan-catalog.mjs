#!/usr/bin/env node
/**
 * Import full Metkan.com WooCommerce catalog into local JSON + images.
 * Usage: node scripts/import-metkan-catalog.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = "https://metkan.com";
const OUT_JSON = path.join(ROOT, "src/content/generated/metkan-products.json");
const OUT_META = path.join(ROOT, "src/content/generated/metkan-import-meta.json");
const IMG_DIR = path.join(ROOT, "public/sourced/catalog");

const BIREYSEL_ROOT_ID = 89;
const VRV_ROOT_ID = 108;

const SERIES_BY_SLUG = {
  emura: "Emura",
  "emura-beyaz": "Emura",
  "emura-gumus": "Emura",
  "emura-siyah": "Emura",
  stylish: "Stylish",
  "stylish-beyaz": "Stylish",
  "stylish-siyah": "Stylish",
  perfera: "Perfera",
  sensira: "Sensira",
  "shira-plus": "Shira Plus",
  "shira-eco": "Shira Eco",
  "zeta-shira-plus": "Zeta Shira Plus",
  "ururu-sarara": "Ururu Sarara",
  "bireysel-klimalar": "Bireysel",
  vrv: "VRV",
  "dis-uniteler": "VRV Dış Ünite",
  "ic-uniteler": "VRV İç Ünite",
  "kontrol-sistemleri": "VRV Kontrol",
};

const SUITABLE_BY_CATEGORY = {
  "bireysel-klimalar": ["Salon", "Yatak odası", "Ofis odası", "Konut"],
  "vrv-sistemleri": ["Ofis binası", "Otel", "AVM", "Ticari yapı"],
};

const FALLBACK_IMAGE = {
  "bireysel-klimalar": "/sourced/products/duvar-tipi.jpg",
  "vrv-sistemleri": "/sourced/products/vrf.jpg",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, attempt = 1) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "ProserGrupCatalogImporter/1.0",
    },
  });
  if (!res.ok) {
    if (attempt < 6 && (res.status === 429 || res.status >= 500)) {
      await sleep(attempt * 1200);
      return fetchJson(url, attempt + 1);
    }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return { json: await res.json(), headers: res.headers };
}

function decodeEntities(str) {
  return String(str || "")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

function stripHtml(html) {
  return decodeEntities(
    String(html || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function titleCaseSlugPart(part) {
  if (/^\d+$/.test(part)) return part;
  if (/^(btu|r32|r410a|kw|h)$/i.test(part)) return part.toUpperCase();
  if (/^[a-z]{2,6}\d+[a-z0-9]*$/i.test(part)) return part.toUpperCase();
  return part.charAt(0).toUpperCase() + part.slice(1);
}

function nameFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map(titleCaseSlugPart)
    .join(" ")
    .replace(/\bBtu\b/gi, "BTU");
}

function extractModelCode(slug, name) {
  const fromSlug = slug.match(/^([a-z]{2,6}\d+[a-z0-9]*)/i);
  if (fromSlug) return fromSlug[1].toUpperCase();
  const fromName = String(name).match(/\b([A-Z]{2,6}\d+[A-Z0-9]*)\b/);
  return fromName ? fromName[1] : undefined;
}

function resolveTitle(rawTitle, slug, series) {
  const title = decodeEntities(rawTitle).replace(/^[–—\-]+|[–—\-]+$/g, "").trim();
  if (title && title !== "–" && title !== "-" && title !== "—") {
    return title.startsWith("Daikin") ? title : `Daikin ${title}`;
  }
  const fromSlug = nameFromSlug(slug);
  const seriesWord = series?.split(" ")[0];
  if (seriesWord && !fromSlug.toLowerCase().includes(seriesWord.toLowerCase())) {
    return `Daikin ${series} ${fromSlug}`;
  }
  return `Daikin ${fromSlug}`;
}

function categoryAncestors(catId, byId) {
  const chain = [];
  let cur = byId.get(catId);
  const seen = new Set();
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    chain.push(cur);
    cur = cur.parent ? byId.get(cur.parent) : null;
  }
  return chain;
}

function mapSiteCategory(catIds, byId) {
  for (const id of catIds) {
    const chain = categoryAncestors(id, byId);
    if (chain.some((c) => c.id === VRV_ROOT_ID)) return "vrv-sistemleri";
    if (chain.some((c) => c.id === BIREYSEL_ROOT_ID)) return "bireysel-klimalar";
  }
  return "bireysel-klimalar";
}

function pickSeriesAndSubcategory(catIds, byId) {
  const cats = catIds.map((id) => byId.get(id)).filter(Boolean);
  if (!cats.length) return { series: "Daikin", subcategory: undefined };

  const scored = cats.map((c) => ({
    c,
    depth: categoryAncestors(c.id, byId).length,
  }));
  scored.sort((a, b) => b.depth - a.depth);
  const leaf = scored[0].c;
  const subcategory = decodeEntities(leaf.name);

  let series;
  for (const c of categoryAncestors(leaf.id, byId)) {
    if (SERIES_BY_SLUG[c.slug]) {
      series = SERIES_BY_SLUG[c.slug];
      break;
    }
  }
  if (!series) {
    series = subcategory
      .replace(/\s+(Beyaz|Siyah|Gümüş|Gumus)$/i, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  return { series, subcategory };
}

function parseSpecs(html) {
  const specs = [];
  const seen = new Set();
  const push = (label, value) => {
    const l = decodeEntities(label).replace(/\s+/g, " ").replace(/:$/, "").trim();
    const v = decodeEntities(value).replace(/\s+/g, " ").trim();
    if (!l || !v || v.length > 180 || l.length > 80) return;
    if (/^(genel|kapasite|performans|ekonomi|konfor|teknik|doküman)/i.test(l)) return;
    const key = l.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    specs.push({ label: l, value: v });
  };

  for (const m of html.matchAll(
    /<(?:strong|b)[^>]*>([^<]{2,80})<\/(?:strong|b)>\s*:?\s*([^<]{1,120})/gi,
  )) {
    push(m[1], m[2]);
  }

  for (const m of html.matchAll(
    /<span[^>]*>\s*([^<]{2,80}?)\s*<\/span>\s*<span[^>]*>\s*([^<]{1,120}?)\s*<\/span>/gi,
  )) {
    push(m[1], m[2]);
  }

  const plain = stripHtml(html);
  for (const m of plain.matchAll(
    /([A-ZÇĞİÖŞÜa-zçğıöşü0-9][^:]{2,50})\s*:\s*([^\n|•]{1,80})/g,
  )) {
    push(m[1], m[2]);
  }

  const preferred = specs.filter((s) =>
    /kapasite|boyut|ağırlık|agirlik|ses|seer|scop|soğutucu|sogutucu|güç|guc|enerji|btu|kw|mm|dba|r32|faz|boru|model/i.test(
      `${s.label} ${s.value}`,
    ),
  );
  return (preferred.length >= 3 ? preferred : specs).slice(0, 14);
}

function parseHighlights(html) {
  const titles = [];
  const seen = new Set();
  const push = (t) => {
    const v = decodeEntities(t).replace(/\s+/g, " ").trim();
    if (!v || v.length < 3 || v.length > 48) return;
    if (
      /^(genel|kapasite|performans|ekonomi|konfor|teknik|doküman|neden|avantaj|beyaz|siyah)/i.test(
        v,
      )
    ) {
      return;
    }
    if (/metkan|ücretsiz montaj|iletisim|iletişim|whatsapp/i.test(v)) return;
    const key = v.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    titles.push(v);
  };

  for (const m of html.matchAll(/<(?:h2|h3|h4|li)[^>]*>\s*(?:<[^>]+>\s*)*([^<]{3,50})/gi)) {
    push(m[1]);
    if (titles.length >= 8) break;
  }

  const defaults = [
    "Inverter teknolojisi",
    "Yüksek enerji verimliliği",
    "Sessiz çalışma",
    "Daikin güvenilirliği",
  ];
  while (titles.length < 4) titles.push(defaults[titles.length]);
  return titles.slice(0, 6);
}

function buildSummary(html, name, series, category) {
  const text = stripHtml(html)
    .replace(/Genel\s+Kapasite[\s\S]{0,40}?Dokümanlar\s*/i, "")
    .replace(/ÜCRETSİZ MONTAJ[\s\S]{0,220}/gi, "")
    .replace(/Metkan[^.]*\./gi, "")
    .trim();

  const sentence = text
    .split(/(?<=\.)\s+/)
    .find((s) => s.length > 40 && s.length < 220 && !/metkan/i.test(s));

  if (sentence) return sentence.replace(/\s+/g, " ").trim();

  if (category === "vrv-sistemleri") {
    return `${name}, Daikin VRV ${series} ailesinde yer alan merkezi iklimlendirme ünitesidir. Proser Grup keşif ve proje teklifi sunar.`;
  }
  return `${name}, Daikin ${series} serisinde yer alan bireysel klima modelidir. Keşif sonrası Proser Grup net teklif hazırlar.`;
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].includes(ext)) return ext;
  return ".jpg";
}

async function downloadImage(url, destPath, attempt = 1) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ProserGrupCatalogImporter/1.0",
        Referer: `${BASE}/`,
      },
    });
    if (!res.ok) throw new Error(`img ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 400) throw new Error("img too small");
    await fs.writeFile(destPath, buf);
    return true;
  } catch (err) {
    if (attempt < 4) {
      await sleep(attempt * 700);
      return downloadImage(url, destPath, attempt + 1);
    }
    console.warn(`  ! image failed ${url}: ${err.message}`);
    return false;
  }
}

async function fetchAllCategories() {
  const { json } = await fetchJson(
    `${BASE}/wp-json/wp/v2/product_cat?per_page=100&hide_empty=false`,
  );
  return new Map(json.map((c) => [c.id, c]));
}

async function fetchAllProducts() {
  const products = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const url = `${BASE}/wp-json/wp/v2/product?per_page=100&page=${page}&status=publish&_embed=1`;
    const { json, headers } = await fetchJson(url);
    totalPages = Number(headers.get("X-WP-TotalPages") || 1);
    const total = Number(headers.get("X-WP-Total") || 0);
    console.log(`Fetched products page ${page}/${totalPages} (reported total ${total})`);
    products.push(...json);
    page += 1;
    await sleep(150);
  }
  return products;
}

async function main() {
  await fs.mkdir(IMG_DIR, { recursive: true });
  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });

  console.log("Loading categories…");
  const byId = await fetchAllCategories();
  console.log(`Categories: ${byId.size}`);

  console.log("Loading products…");
  const rawProducts = await fetchAllProducts();
  console.log(`Raw products: ${rawProducts.length}`);

  const bySlug = new Map();
  const missingImages = [];
  let i = 0;

  for (const raw of rawProducts) {
    i += 1;
    const slug = raw.slug;
    if (!slug) continue;

    const catIds = raw.product_cat || [];
    const category = mapSiteCategory(catIds, byId);
    const { series, subcategory } = pickSeriesAndSubcategory(catIds, byId);
    const name = resolveTitle(raw.title?.rendered, slug, series);
    const modelCode = extractModelCode(slug, name);
    const html = raw.content?.rendered || "";
    const specs = parseSpecs(html);
    const highlights = parseHighlights(html);
    const summary = buildSummary(html, name, series, category);

    const media = raw._embedded?.["wp:featuredmedia"]?.[0] || null;
    let imageUrl = media?.source_url;
    if (!imageUrl && media?.media_details?.sizes) {
      const sizes = media.media_details.sizes;
      imageUrl =
        sizes.woocommerce_single?.source_url ||
        sizes.large?.source_url ||
        sizes.full?.source_url ||
        sizes.medium_large?.source_url;
    }

    let image = FALLBACK_IMAGE[category] || FALLBACK_IMAGE["bireysel-klimalar"];
    if (imageUrl) {
      const fileName = `${slug}${extFromUrl(imageUrl)}`;
      const dest = path.join(IMG_DIR, fileName);
      let ok = false;
      try {
        await fs.access(dest);
        ok = true;
      } catch {
        ok = await downloadImage(imageUrl, dest);
      }
      if (ok) image = `/sourced/catalog/${fileName}`;
      else missingImages.push({ slug, imageUrl });
    } else {
      missingImages.push({ slug, imageUrl: null });
    }

    const finalSpecs =
      specs.length > 0
        ? specs
        : [
            { label: "Marka", value: "Daikin" },
            { label: "Seri", value: series },
            ...(modelCode ? [{ label: "Model", value: modelCode }] : []),
            { label: "Kategori", value: subcategory || series },
          ];

    bySlug.set(slug, {
      slug,
      name,
      category,
      series,
      summary,
      highlights,
      specs: finalSpecs,
      suitableFor: SUITABLE_BY_CATEGORY[category],
      image,
      ...(modelCode ? { modelCode } : {}),
      ...(subcategory ? { subcategory } : {}),
    });

    if (i % 25 === 0 || i === rawProducts.length) {
      console.log(`Processed ${i}/${rawProducts.length}`);
    }
  }

  const catalog = [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, "tr"));
  const bireysel = catalog.filter((p) => p.category === "bireysel-klimalar").length;
  const vrv = catalog.filter((p) => p.category === "vrv-sistemleri").length;
  const withLocalImage = catalog.filter((p) => p.image.startsWith("/sourced/catalog/")).length;

  await fs.writeFile(OUT_JSON, JSON.stringify(catalog, null, 2));
  await fs.writeFile(
    OUT_META,
    JSON.stringify(
      {
        importedAt: new Date().toISOString(),
        source: BASE,
        rawCount: rawProducts.length,
        uniqueSlugs: catalog.length,
        bireysel,
        vrv,
        withLocalImage,
        missingImageCount: missingImages.length,
        missingImages: missingImages.slice(0, 80),
      },
      null,
      2,
    ),
  );

  console.log("\nImport complete");
  console.log(`  unique products: ${catalog.length}`);
  console.log(`  bireysel: ${bireysel}, vrv: ${vrv}`);
  console.log(`  local images: ${withLocalImage}`);
  console.log(`  missing images: ${missingImages.length}`);
  console.log(`  wrote ${OUT_JSON}`);

  if (catalog.length < 240) {
    console.error("ERROR: expected ~251 products");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
