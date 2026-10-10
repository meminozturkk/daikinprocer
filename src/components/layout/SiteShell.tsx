"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingActions } from "./FloatingActions";
import { CampaignModal } from "./CampaignModal";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        İçeriğe geç
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1 pb-32 md:pb-28">
        {children}
      </main>
      <Footer />
      <FloatingActions />
      <CampaignModal />
    </>
  );
}
