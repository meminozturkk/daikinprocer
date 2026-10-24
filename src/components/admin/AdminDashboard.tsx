"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";
import { defaultSiteContent } from "@/lib/site-content-types";

// Modular Admin Sections
import { LeadsSection } from "./sections/LeadsSection";
import { ContactSection } from "./sections/ContactSection";
import { HomeSection } from "./sections/HomeSection";
import { ServicesSection } from "./sections/ServicesSection";
import { CategoriesSection } from "./sections/CategoriesSection";
import { ProductsSection } from "./sections/ProductsSection";
import { PagesSection } from "./sections/PagesSection";
import { FaqSection } from "./sections/FaqSection";
import { ReferencesSection } from "./sections/ReferencesSection";
import { CampaignSection } from "./sections/CampaignSection";
import { NavigationSection } from "./sections/NavigationSection";
import { BlogSection } from "./sections/BlogSection";
import { MediaSection } from "./sections/MediaSection";
import { SeoSection } from "./sections/SeoSection";
import { BackupsSection } from "./sections/BackupsSection";

type TabKey =
  | "leads"
  | "contact"
  | "home"
  | "services"
  | "categories"
  | "products"
  | "pages"
  | "faqs"
  | "references"
  | "campaign"
  | "navigation"
  | "blog"
  | "media"
  | "seo"
  | "backups";

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
  badge?: string;
}

const TABS: TabItem[] = [
  { key: "leads", label: "Gelen Talepler", icon: "📬" },
  { key: "products", label: "Ürün Kataloğu", icon: "❄️" },
  { key: "media", label: "Medya Galerisi (Fotoğraf Yükle)", icon: "🖼️" },
  { key: "home", label: "Ana Sayfa", icon: "🏠" },
  { key: "contact", label: "İletişim & Konum", icon: "📞" },
  { key: "services", label: "Hizmetler", icon: "🛠️" },
  { key: "categories", label: "Kategoriler", icon: "🏷️" },
  { key: "pages", label: "Kurumsal & Sayfalar", icon: "📄" },
  { key: "faqs", label: "Sıkça Sorulanlar", icon: "❓" },
  { key: "references", label: "Referanslar", icon: "🏢" },
  { key: "campaign", label: "Kampanya & Pop-Up", icon: "🎁" },
  { key: "navigation", label: "Menü & Gezinti", icon: "🧭" },
  { key: "blog", label: "Blog & Rehberler", icon: "✍️" },
  { key: "seo", label: "SEO & Yapay Zeka", icon: "🔍" },
  { key: "backups", label: "Otomatik Yedekler", icon: "💾" },
];

export function AdminDashboard({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<TabKey>("leads");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({
          type: "error",
          text: data.message || "Kaydetme başarısız oldu.",
        });
        return;
      }

      setStatusMessage({
        type: "success",
        text: "Tüm değişiklikler başarıyla kaydedildi, otomatik yedek alındı ve site önbelleği yenilendi!",
      });

      if (data.data) {
        setContent(data.data);
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Sunucu bağlantı hatası oluştu.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        "Tüm site ayarlarını varsayılan başlangıç değerlerine sıfırlamak istediğinize emin misiniz? Değişiklikler 'Kaydet' butonuna basınca geçerli olur."
      )
    ) {
      setContent(defaultSiteContent);
      setStatusMessage({
        type: "success",
        text: "Varsayılan değerler yüklendi. Değişiklikleri yayına almak için 'Kaydet' butonuna basın.",
      });
    }
  };

  const handleExportJson = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
      const downloadAnchor = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `daikin-proser-backup-${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch {
      alert("Dışa aktarma başarısız");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-md shadow-blue-500/20 text-lg">
                D
              </span>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
                  Daikin Proser Admin Paneli
                </h1>
                <p className="text-[11px] font-semibold text-slate-400">
                  Merkezi İçerik & Talep Yönetim Sistemi (CMS)
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>🌐 Siteyi Aç</span>
                <span className="text-slate-400">↗</span>
              </Link>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
              >
                {saving ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>Değişiklikleri Kaydet</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-600 transition"
                title="Çıkış Yap"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`border-t px-4 py-3 text-xs sm:text-sm font-semibold transition ${statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
              }`}
          >
            <div className="mx-auto max-w-7xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{statusMessage.type === "success" ? "✅" : "⚠️"}</span>
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-xs opacity-70 hover:opacity-100"
              >
                Kapat ×
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 scrollbar-none border-b border-slate-200">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setStatusMessage(null);
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="rounded-full bg-blue-500 px-1.5 py-0.2 text-[10px] text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="mt-6">
          {activeTab === "leads" && <LeadsSection />}
          {activeTab === "contact" && (
            <ContactSection content={content} onChange={setContent} />
          )}
          {activeTab === "home" && (
            <HomeSection content={content} onChange={setContent} />
          )}
          {activeTab === "services" && (
            <ServicesSection content={content} onChange={setContent} />
          )}
          {activeTab === "categories" && (
            <CategoriesSection content={content} onChange={setContent} />
          )}
          {activeTab === "products" && (
            <ProductsSection content={content} onChange={setContent} />
          )}
          {activeTab === "pages" && (
            <PagesSection content={content} onChange={setContent} />
          )}
          {activeTab === "faqs" && (
            <FaqSection content={content} onChange={setContent} />
          )}
          {activeTab === "references" && (
            <ReferencesSection content={content} onChange={setContent} />
          )}
          {activeTab === "campaign" && (
            <CampaignSection content={content} onChange={setContent} />
          )}
          {activeTab === "navigation" && (
            <NavigationSection content={content} onChange={setContent} />
          )}
          {activeTab === "blog" && (
            <BlogSection content={content} onChange={setContent} />
          )}
          {activeTab === "media" && <MediaSection />}
          {activeTab === "seo" && (
            <SeoSection content={content} onChange={setContent} />
          )}
          {activeTab === "backups" && (
            <BackupsSection onRestored={(restored) => setContent(restored)} />
          )}
        </div>

        {/* Global Footer Controls */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportJson}
              className="text-slate-600 hover:text-slate-900 font-semibold underline"
            >
              JSON Olarak Dışa Aktar (Yedek İndir)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Fabrika Ayarlarına Dön
            </button>
          </div>
          <p>Daikin Proser CMS v2.0 · Otomatik Döngüsel Yedekleme Aktif</p>
        </div>
      </main>

      {/* Floating Bottom Save Bar */}
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-2xl shadow-blue-600/40 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Yayına Alınıyor...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Tüm Değişiklikleri Kaydet & Yayına Al</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
