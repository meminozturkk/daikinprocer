"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";
import { defaultSiteContent } from "@/lib/site-content-types";

type TabKey = "contact" | "hero" | "announcement" | "trust";

export function AdminDashboard({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<TabKey>("contact");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleResetToDefault = () => {
    if (confirm("Tüm alanları orijinal varsayılan değerlere sıfırlamak istediğinize emin misiniz?")) {
      setContent(defaultSiteContent);
      setStatusMessage({ type: "success", text: "Varsayılan değerler yüklendi. Değişiklikleri yayına almak için 'Kaydet' butonuna basın." });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Kaydetme sırasında bir hata oluştu");
      }

      setStatusMessage({ type: "success", text: "Değişiklikler başarıyla kaydedildi ve tüm sitede yayına alındı!" });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Beklenmedik bir hata oluştu",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <Image
                src="/sourced/brand/logo.png"
                alt="Proser Grup"
                width={130}
                height={32}
                className="h-7 w-auto"
              />
            </Link>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 hidden sm:inline">
              Site Yönetim Paneli
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <span>Siteyi Gör</span>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">İçerik & Metin Yönetimi</h1>
            <p className="mt-1 text-sm text-slate-500">
              Telefon numaraları, açık adres, hero başlıkları ve duyuruları kolayca düzenleyin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              Varsayılana Sıfırla
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-600/20 hover:bg-sky-500 disabled:opacity-50 transition"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm font-medium shadow-sm transition-all ${
              statusMessage.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { key: "contact", label: "📞 İletişim & Konum" },
            { key: "hero", label: "🏠 Ana Sayfa Metinleri" },
            { key: "announcement", label: "📢 Duyuru Bandı" },
            { key: "trust", label: "🛡️ Güven Unsurları" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {/* TAB 1: İletişim & Konum */}
          {activeTab === "contact" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900">İletişim ve Konum Bilgileri</h2>
              <p className="text-xs text-slate-500">
                Sitenin üst barında, footer alanında ve iletişim butonlarında yer alan bilgiler.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Sabit Hat Telefonu</label>
                  <input
                    type="text"
                    value={content.contact.phoneLandline}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, phoneLandline: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Mobil / GSM Numarası</label>
                  <input
                    type="text"
                    value={content.contact.phoneMobile}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, phoneMobile: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">WhatsApp Numarası</label>
                  <input
                    type="text"
                    value={content.contact.whatsapp}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, whatsapp: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">E-posta Adresi</label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, email: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">Çalışma Saatleri</label>
                  <input
                    type="text"
                    value={content.contact.hours}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, hours: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">Açık Adres</label>
                  <input
                    type="text"
                    value={content.contact.addressFull}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, addressFull: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Merkez / İlçe Başlığı</label>
                  <input
                    type="text"
                    value={content.contact.district}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, district: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Slogan / Alt Başlık</label>
                  <input
                    type="text"
                    value={content.contact.tagline}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, tagline: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Ana Sayfa Metinleri */}
          {activeTab === "hero" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900">Ana Sayfa (Hero) Başlık ve Açıklamaları</h2>
              <p className="text-xs text-slate-500">
                Ana sayfaya ilk girildiğinde görünen karşılama alanının metinleri.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Üst Rozet Metni</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, badge: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Ana Başlık (H1)</label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, title: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Alt Açıklama Paragrafı</label>
                  <textarea
                    rows={3}
                    value={content.hero.description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, description: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="max-w-xs">
                  <label className="block text-xs font-semibold text-slate-700">Deneyim Yılı (Sayaç)</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={content.hero.experienceYears}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, experienceYears: Number(e.target.value) || 1 },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Duyuru Bandı */}
          {activeTab === "announcement" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Duyuru / Kampanya Bandı</h2>
                  <p className="text-xs text-slate-500">
                    Sitenin en üst kısmında ince bir şerit olarak gösterilir.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={content.announcement.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, enabled: e.target.checked },
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                  <span className="ml-3 text-xs font-semibold text-slate-700">
                    {content.announcement.enabled ? "Yayında (Aktif)" : "Gizli (Pasif)"}
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Duyuru Metni</label>
                  <input
                    type="text"
                    value={content.announcement.text}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, text: e.target.value },
                      })
                    }
                    placeholder="Örn: Daikin Klimalarda Bahar Kampanyası Başladı!"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Buton Metni (Opsiyonel)</label>
                    <input
                      type="text"
                      value={content.announcement.linkText || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, linkText: e.target.value },
                        })
                      }
                      placeholder="Örn: Teklif Al"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Hedef Link (Opsiyonel)</label>
                    <input
                      type="text"
                      value={content.announcement.linkHref || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, linkHref: e.target.value },
                        })
                      }
                      placeholder="Örn: /teklif-al"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Güven Unsurları */}
          {activeTab === "trust" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Güven Unsurları (Trust Points)</h2>
                <p className="text-xs text-slate-500">
                  Ana sayfada hero bölümünün hemen altındaki 4 maddelik garanti ve yetki kartları.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {content.trustPoints.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
                    <span className="inline-block rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      Kart #{index + 1}
                    </span>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Kart Başlığı</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...content.trustPoints];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setContent({ ...content, trustPoints: updated });
                        }}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Kart Açıklaması</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...content.trustPoints];
                          updated[index] = { ...updated[index], description: e.target.value };
                          setContent({ ...content, trustPoints: updated });
                        }}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Save bar */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-600/25 hover:bg-sky-500 disabled:opacity-50 transition"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
