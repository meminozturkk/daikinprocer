import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const OUT = path.resolve("public/sourced");
const PAGES = [
  "https://www.prosergrup.com/",
  "https://www.prosergrup.com/referanslar",
  "https://www.prosergrup.com/urunler/duvar-tipi-split-klimalar",
  "https://www.prosergrup.com/urunler/multi-split-klimalar",
  "https://www.prosergrup.com/urunler/ticari-split-klimalar",
  "https://www.prosergrup.com/urunler/vrf-klima-sistemleri",
  "https://www.prosergrup.com/urunler/havadan-suya-isi-pompalari",
  "https://www.prosergrup.com/urunler/havalandirma-urunleri",
  "https://www.prosergrup.com/hizmetler/klima-sistemleri",
  "https://www.prosergrup.com/hizmetler/servis-hizmetleri",
  "https://www.prosergrup.com/sayfa/prosergrup-hakkinda",
  "https://www.prosergrup.com/haber/klima-secerken-nelere-dikkat-etmeliyiz",
];

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, "products"), { recursive: true });
fs.mkdirSync(path.join(OUT, "icons"), { recursive: true });
fs.mkdirSync(path.join(OUT, "hero"), { recursive: true });
fs.mkdirSync(path.join(OUT, "blog"), { recursive: true });
fs.mkdirSync(path.join(OUT, "brand"), { recursive: true });
fs.mkdirSync(path.join(OUT, "misc"), { recursive: true });

function classify(url, alt = "") {
  const u = url.toLowerCase();
  const a = alt.toLowerCase();
  if (u.includes("8829419540") || a.includes("proser")) return "brand/logo.png";
  if (u.includes("klima-ikon") || u.includes("klima-sistem")) return "icons/klima.png";
  if (u.includes("havalandirma.png") || u.includes("havalandirma-sistem")) return "icons/havalandirma.png";
  if (u.includes("isitma")) return "icons/isitma.png";
  if (u.includes("servis-ikon") || u.includes("servis-hizmeti")) return "icons/servis.png";
  if (u.includes("vrf-iklimlendirme")) return "hero/vrf-showcase.png";
  if (u.includes("0e453dafb4") || a.includes("duvar tipi")) return "products/duvar-tipi.jpg";
  if (u.includes("227cf313a0") || a.includes("multi")) return "products/multi.jpg";
  if (u.includes("267221c45e") || a.includes("ticari")) return "products/ticari.jpg";
  if (u.includes("0bf2d61ed4") || a.includes("vrf")) return "products/vrf.jpg";
  if (u.includes("9d0324162d") || a.includes("ısı") || a.includes("isi pompa")) return "products/isi-pompasi.jpg";
  if (u.includes("ad1c2ffe07") || a.includes("havalandırma") || a.includes("havalandirma ürün")) return "products/havalandirma.jpg";
  if (u.includes("66c2bb6b1c") || a.includes("seçerken")) return "blog/klima-secimi.jpg";
  if (u.includes("alt-arka")) return "misc/footer-bg.jpg";
  if (u.includes("d9e8c91162") || u.includes("89060b5543") || u.includes("e5c1458b7c")) {
    const hash = path.basename(new URL(url).pathname);
    return `hero/${hash}`;
  }
  const hash = path.basename(new URL(url).pathname);
  return `misc/${hash}`;
}

const browser = await chromium.launch();
const page = await browser.newPage({
  userAgent:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
});

const collected = new Map(); // url -> alt

for (const url of PAGES) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);
    const items = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll("img").forEach((img) => {
        const src = img.currentSrc || img.src;
        if (src && !src.startsWith("data:")) out.push({ src, alt: img.alt || "" });
      });
      document.querySelectorAll("*").forEach((el) => {
        const bg = getComputedStyle(el).backgroundImage;
        if (bg && bg !== "none") {
          for (const m of bg.matchAll(/url\(["']?(.*?)["']?\)/g)) {
            out.push({ src: m[1], alt: "" });
          }
        }
      });
      return out;
    });
    for (const item of items) {
      if (!/\.(jpe?g|png|webp|gif)(\?|$)/i.test(item.src)) continue;
      if (!collected.has(item.src)) collected.set(item.src, item.alt);
    }
    console.log("OK", url, items.length);
  } catch (e) {
    console.warn("FAIL", url, e.message);
  }
}

const manifest = [];
for (const [src, alt] of collected) {
  const rel = classify(src, alt);
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const abs = new URL(src, "https://www.prosergrup.com/").href;
    const res = await page.request.get(abs);
    if (!res.ok()) {
      console.warn("DOWNLOAD FAIL", abs, res.status());
      continue;
    }
    const buf = await res.body();
    fs.writeFileSync(dest, buf);
    manifest.push({ src: abs, local: `/sourced/${rel}`, alt, bytes: buf.length });
    console.log("SAVED", rel, buf.length);
  } catch (e) {
    console.warn("DOWNLOAD ERR", src, e.message);
  }
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("DONE", manifest.length, "files");
await browser.close();
