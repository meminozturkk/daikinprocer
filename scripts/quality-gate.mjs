#!/usr/bin/env node
/**
 * Lightweight quality gate checklist (run after build).
 * Does not replace Lighthouse CI — verifies structural SEO & content contracts.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

const site = fs.readFileSync(path.join(root, "src/content/site.ts"), "utf8");
assert(site.includes("Daikin Yetkili Bayi"), "site claim missing");
assert(!/Gree|GREE/.test(site), "Gree reference leaked into site.ts");

const products = fs.readFileSync(path.join(root, "src/content/products.ts"), "utf8");
assert(!/Gree|GREE/.test(products), "Gree reference leaked into products");

const nextConfig = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
[
  "/sayfa/prosergrup-hakkinda",
  "/urunler/duvar-tipi-split-klimalar",
  "/teklif-formu",
  "/haber/klima-secerken-nelere-dikkat-etmeliyiz",
].forEach((route) => assert(nextConfig.includes(route), `redirect missing: ${route}`));

const pages = [
  "src/app/page.tsx",
  "src/app/sitemap.ts",
  "src/app/robots.ts",
  "src/app/teklif-al/page.tsx",
  "src/app/servis-talebi/page.tsx",
  "src/app/bolgeler/kartal/page.tsx",
  "src/app/kvkk/page.tsx",
];
pages.forEach((p) => assert(fs.existsSync(path.join(root, p)), `missing ${p}`));

if (failures.length) {
  console.error("Quality gate failed:");
  failures.forEach((f) => console.error(" -", f));
  process.exit(1);
}

console.log("Quality gate passed:", pages.length, "core files + content/SEO checks OK");
