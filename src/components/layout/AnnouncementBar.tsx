"use client";

import Link from "next/link";
import { useSiteContent } from "@/lib/SiteContentContext";

export function AnnouncementBar() {
  const { announcement } = useSiteContent();

  if (!announcement || !announcement.enabled || !announcement.text) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[var(--navy)] via-[var(--daikin-blue-dark)] to-[var(--navy)] text-white px-4 py-2 text-xs md:text-sm shadow-inner transition-all">
      <div className="container-pro flex items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium tracking-wide">{announcement.text}</span>
        </div>
        {announcement.linkText && announcement.linkHref && (
          <Link
            href={announcement.linkHref}
            className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-semibold text-white hover:bg-white/25 transition text-xs shrink-0"
          >
            <span>{announcement.linkText}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>
    </div>
  );
}
