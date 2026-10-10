"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/utils";

const STORAGE_KEY = "proser_campaign_modal_seen_at";
const LEGACY_STORAGE_KEY = "proser_campaign_modal_seen";
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

const CAMPAIGN_WHATSAPP_HREF = getWhatsAppUrl(
  "0 536 860 87 70",
  "Merhaba, İlk Bakım Hediye kampanyanız hakkında bilgi ve teklif almak istiyorum."
);

export function CampaignModal() {
  const [isOpen, setIsOpen] = useState(false);
  const campaignWhatsAppHref = CAMPAIGN_WHATSAPP_HREF;

  useEffect(() => {
    try {
      // Remove legacy boolean key if present
      sessionStorage.removeItem(LEGACY_STORAGE_KEY);

      const lastSeenStr = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      const lastSeen = lastSeenStr ? parseInt(lastSeenStr, 10) : 0;
      const now = Date.now();

      // Show if first time or 10 minutes have passed since last view
      if (!lastSeen || isNaN(lastSeen) || now - lastSeen >= COOLDOWN_MS) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          const timestamp = Date.now().toString();
          localStorage.setItem(STORAGE_KEY, timestamp);
          sessionStorage.setItem(STORAGE_KEY, timestamp);
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case storage is restricted in specific browser privacy modes
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="İlk Bakım Hediye Kampanyası"
    >
      <div
        className="relative w-full max-w-2xl sm:max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="focus-ring absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/85"
          aria-label="Kapat"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Campaign Banner Image */}
        <a
          href={campaignWhatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className="relative block aspect-[1024/558] w-full overflow-hidden bg-slate-100 group"
        >
          <Image
            src="/campaigns/ilk-bakim-hediye.jpg"
            alt="Proser Grup İlk Bakım Hediye Kampanyası"
            fill
            sizes="(max-width: 768px) 100vw, 850px"
            priority
            className="object-cover transition duration-300 group-hover:scale-[1.01]"
          />
        </a>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white p-3.5 sm:px-6">
          <p className="text-xs sm:text-sm font-medium text-[var(--slate)]">
            Daikin klima ve VRV sistemlerinde geçerli özel kampanya.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full px-4 py-2 text-xs sm:text-sm font-medium text-[var(--slate)] hover:bg-slate-100 transition"
            >
              Kapat
            </button>
            <a
              href={campaignWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#1ebe57] transition"
            >
              WhatsApp ile Teklif Al →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
