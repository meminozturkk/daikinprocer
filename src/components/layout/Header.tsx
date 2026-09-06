"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navigation } from "@/content/site";
import { contact } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="border-b border-slate-100 bg-[var(--navy)] text-white">
        <div className="container-pro flex flex-wrap items-center justify-between gap-2 py-2 text-xs md:text-sm">
          <a href={contact.phones[0].href} className="focus-ring rounded hover:text-sky-200">
            {contact.phones[0].display}
          </a>
          <a href={`mailto:${contact.email}`} className="focus-ring rounded hover:text-sky-200">
            {contact.email}
          </a>
          <span className="hidden sm:inline">{siteConfigClaim()}</span>
        </div>
      </div>

      <div className="container-pro flex items-center justify-between gap-4 py-3">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
          <Image
            src="/sourced/brand/logo.png"
            alt="Proser Grup"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="hidden sm:block">
            <span className="block text-[11px] font-medium text-[var(--daikin-blue-dark)]">
              Daikin Yetkili Bayi & Servis
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {navigation.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setActiveMenu(item.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={item.href}
                className="focus-ring rounded-full px-3 py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--ice)]"
              >
                {item.label}
              </Link>
              {"children" in item && item.children && activeMenu === item.label ? (
                <div className="absolute left-0 top-full min-w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3 py-2 text-sm text-[var(--navy)] hover:bg-[var(--ice)]"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button href="/servis-talebi" variant="ghost" size="sm">
            Servis Talebi
          </Button>
          <Button href="/teklif-al" size="sm">
            Teklif Al
          </Button>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menü</span>
          <div className="space-y-1.5">
            <span className={cn("block h-0.5 w-5 bg-[var(--navy)] transition", open && "translate-y-2 rotate-45")} />
            <span className={cn("block h-0.5 w-5 bg-[var(--navy)] transition", open && "opacity-0")} />
            <span className={cn("block h-0.5 w-5 bg-[var(--navy)] transition", open && "-translate-y-2 -rotate-45")} />
          </div>
        </button>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-slate-100 bg-white lg:hidden">
          <div className="container-pro flex flex-col gap-1 py-4">
            {navigation.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-2 font-medium text-[var(--navy)] hover:bg-[var(--ice)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {"children" in item && item.children
                  ? item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-6 py-2 text-sm text-[var(--slate)] hover:bg-[var(--ice)]"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))
                  : null}
              </div>
            ))}
            <div className="mt-3 grid gap-2">
              <Button href="/teklif-al" onClick={() => setOpen(false)}>
                Teklif Al
              </Button>
              <Button href="/servis-talebi" variant="secondary" onClick={() => setOpen(false)}>
                Servis Talebi
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function siteConfigClaim() {
  return "Daikin Yetkili Bayi ve Yetkili Servis · Kartal";
}
