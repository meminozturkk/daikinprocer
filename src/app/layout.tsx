import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Header } from "@/components/layout/Header";
import { contact, siteConfig } from "@/content/site";
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[var(--foreground)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          İçeriğe geç
        </a>
        <Header />
        <main id="main" className="flex-1 pb-32 md:pb-28">
          {children}
        </main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
