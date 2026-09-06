# Proser Grup — Daikin Yetkili Bayi & Servis

Premium tanıtım + ürün kataloğu + lead toplama sitesi (e-ticaret yok).

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Framer Motion (reduced-motion destekli)
- Zod form doğrulama
- Dosya tabanlı içerik (`src/content`)

## Geliştirme

```bash
npm install
npm run dev
```

## Ortam değişkenleri

`.env.local` örneği:

```
NEXT_PUBLIC_SITE_URL=https://www.prosergrup.com
# RESEND_API_KEY=...   # form e-postası için (opsiyonel)
```

## Yayın öncesi

1. Resmi Daikin medya paketini `public/brand` ve `public/products` altına koyun.
2. Ticari unvan, çalışma saatleri, WhatsApp ve hizmet ilçelerini `src/content/site.ts` içinde doğrulayın.
3. Form e-posta gönderimini API route’lara bağlayın.
4. Search Console + işletme profili NAP tutarlılığı.

## Scriptler

- `npm run dev` — geliştirme
- `npm run build` — üretim derlemesi
- `npm run start` — üretim sunucusu
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript
- `npm run test:e2e` — Playwright (kurulum sonrası)
