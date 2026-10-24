import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { contact, siteConfig } from "@/content/site";
import { getSiteContent } from "@/lib/site-content";
import { SiteContentProvider } from "@/lib/SiteContentContext";
import { SiteShell } from "@/components/layout/SiteShell";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Daikin Yetkili Bayi ve Yetkili Servis | Proser Grup Kartal İstanbul",
    template: "%s | Daikin Yetkili Bayi Proser Grup",
  },
  description:
    "Daikin Yetkili Bayi ve Yetkili Servisi Proser Grup. Daikin inverter klimalar, VRV merkezi iklimlendirme sistemleri, Altherma ısı pompaları, ücretsiz keşif, garantili montaj ve teknik servis. Kartal / İstanbul.",
  keywords: [
    "Daikin",
    "Daikin yetkili bayi",
    "Daikin yetkili servis",
    "Daikin klima",
    "Daikin Kartal yetkili servis",
    "Daikin VRV sistemleri",
    "Daikin Altherma ısı pompası",
    "Daikin split klima",
    "Daikin montaj ve bakım",
    "Proser Grup Daikin",
    "İstanbul Daikin bayi",
  ],
  authors: [{ name: "Daikin Yetkili Bayi Proser Grup" }],
  creator: "Proser Grup",
  publisher: "Daikin Yetkili Bayi Proser Grup",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: "Daikin Yetkili Bayi - Proser Grup",
    title: "Daikin Yetkili Bayi ve Yetkili Servis | Proser Grup",
    description:
      "Daikin klima modelleri, VRV sistemleri ve Altherma ısı pompalarında resmi yetkili bayi ve teknik servis güvencesi. Kartal / İstanbul.",
    url: siteConfig.siteUrl,
    images: [
      {
        url: `${siteConfig.siteUrl}/og-default.svg`,
        width: 1200,
        height: 630,
        alt: "Daikin Yetkili Bayi ve Yetkili Servis Proser Grup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daikin Yetkili Bayi ve Yetkili Servis | Proser Grup",
    description:
      "Daikin klima modelleri, VRV sistemleri ve Altherma ısı pompalarında resmi yetkili bayi ve teknik servis güvencesi.",
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();

  return (
    <html lang="tr" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[var(--foreground)]">
        <SiteContentProvider content={content}>
          <SiteShell>{children}</SiteShell>
        </SiteContentProvider>
      </body>
    </html>
  );
}
