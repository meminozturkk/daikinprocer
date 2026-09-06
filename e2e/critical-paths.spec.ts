import { expect, test } from "@playwright/test";

test.describe("critical paths", () => {
  test("home shows Daikin claim and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Daikin/i);
    await expect(page.getByRole("link", { name: /Teklif/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Servis/i }).first()).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]').first()).toHaveCount(1);
  });

  test("product catalog navigation", async ({ page }) => {
    await page.goto("/urunler");
    await page.getByRole("link", { name: /Bireysel Klimalar/i }).first().click();
    await expect(page).toHaveURL(/bireysel-klimalar/);
    await page.getByRole("link", { name: /Sensira/i }).first().click();
    await expect(page).toHaveURL(/sensira/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sensira");
    await expect(page.getByRole("link", { name: /teklif al/i }).first()).toBeVisible();
  });

  test("quote form validation and success", async ({ page }) => {
    await page.goto("/teklif-al");
    await page.getByRole("button", { name: /Teklif İste/i }).click();
    await expect(page.locator("input:invalid, textarea:invalid").first()).toBeVisible();

    await page.locator('input[name="name"]').fill("Test Kullanıcı");
    await page.locator('input[name="phone"]').fill("05368608770");
    await page.locator('input[name="city"]').fill("Kartal");
    await page.locator('textarea[name="message"]').fill("Daikin Sensira için keşif istiyorum.");
    await page.locator('input[name="kvkk"]').check();

    const responsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/teklif") && res.request().method() === "POST",
    );
    await page.getByRole("button", { name: /Teklif İste/i }).click();
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
    await expect(page.getByRole("status")).toContainText(/alındı/i);
  });

  test("service form submits", async ({ page }) => {
    await page.goto("/servis-talebi");
    await page.locator('input[name="name"]').fill("Servis Test");
    await page.locator('input[name="phone"]').fill("02167594113");
    await page.locator('select[name="deviceType"]').selectOption("Duvar tipi split");
    await page.locator('input[name="address"]').fill("Kartal İstanbul");
    await page.locator('textarea[name="issue"]').fill("Klima soğutmuyor, hata kodu var.");
    await page.locator('input[name="kvkk"]').check();

    const responsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/servis") && res.request().method() === "POST",
    );
    await page.getByRole("button", { name: /Servis Talebi Gönder/i }).click();
    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
    await expect(page.getByRole("status")).toContainText(/alındı/i);
  });

  test("teklif api accepts valid payload", async ({ request }) => {
    const res = await request.post("/api/teklif", {
      data: {
        name: "API Test",
        phone: "05368608770",
        city: "Kartal",
        message: "API üzerinden teklif talebi testi.",
        kvkk: true,
      },
    });
    expect(res.ok()).toBeTruthy();
  });

  test("legacy redirect maps to new routes", async ({ page }) => {
    const response = await page.goto("/urunler/duvar-tipi-split-klimalar");
    expect(response?.url()).toContain("/urunler/bireysel-klimalar");
  });

  test("seo endpoints exist", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("sitemap");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    expect(xml).toContain("/urunler/bireysel-klimalar");
    expect(xml).toContain("/bolgeler/kartal");
  });

  test("phone and whatsapp actions present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /WhatsApp/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Ara|0 216/i }).first()).toBeVisible();
  });
});
