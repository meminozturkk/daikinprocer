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
    default: `${contact.brandName} | Daikin Yetkili Bayi ve Servis Kartal`,
    template: `%s | ${contact.brandName}`,
  },
  description:
    "Proser Grup — Daikin yetkili bayi ve yetkili servis. Klima, VRV, Altherma, montaj ve teknik servis. Kartal / İstanbul.",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: contact.brandName,
  },
  robots: { index: true, follow: true },
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
