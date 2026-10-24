"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

type PageKey = "kurumsal" | "iletisim" | "teklifAl" | "servisTalebi" | "kvkk" | "gizlilik";

const PAGE_DEFINITIONS: { key: PageKey; label: string; hasParagraphs: boolean; hint: string }[] = [
  {
    key: "kurumsal",
    label: "Kurumsal Sayfası",
    hasParagraphs: true,
    hint: "Hakkımızda, şirket tarihi ve kurumsal kimlik metinleri.",
  },
  {
    key: "iletisim",
    label: "İletişim Sayfası",
    hasParagraphs: false,
    hint: "İletişim sayfasının üst başlık ve karşılama açıklaması.",
  },
  {
    key: "teklifAl",
    label: "Teklif Al Sayfası",
    hasParagraphs: false,
    hint: "Ücretsiz keşif ve teklif formunun üst karşılama metni.",
  },
  {
    key: "servisTalebi",
    label: "Servis Talebi Sayfası",
    hasParagraphs: false,
    hint: "Yetkili teknik servis formunun üst karşılama metni.",
  },
  {
    key: "kvkk",
    label: "KVKK Aydınlatma Metni",
    hasParagraphs: true,
    hint: "6698 sayılı kanun gereği kişisel verilerin korunması metni.",
  },
  {
    key: "gizlilik",
    label: "Gizlilik Politikası",
    hasParagraphs: true,
    hint: "Çerezler ve gizlilik politikası metni.",
  },
];

export function PagesSection({ content, onChange }: Props) {
  const [activePage, setActivePage] = useState<PageKey>("kurumsal");
  const [newParagraph, setNewParagraph] = useState("");

  const pages = content.pages || {};
  const currentPageData = (pages[activePage] || {}) as Record<string, unknown>;
  const currentDef = PAGE_DEFINITIONS.find((p) => p.key === activePage)!;

  const updatePage = (field: string, val: unknown) => {
    onChange({
      ...content,
      pages: {
        ...pages,
        [activePage]: {
          ...currentPageData,
          [field]: val,
        },
      } as SiteContent["pages"],
    });
  };

  const paragraphs: string[] =
    "paragraphs" in currentPageData && Array.isArray(currentPageData.paragraphs)
      ? (currentPageData.paragraphs as string[])
      : [];

  const handleAddParagraph = () => {
    if (!newParagraph.trim()) return;
    updatePage("paragraphs", [...paragraphs, newParagraph.trim()]);
    setNewParagraph("");
  };

  const handleUpdateParagraph = (index: number, val: string) => {
    const list = [...paragraphs];
    list[index] = val;
    updatePage("paragraphs", list);
  };

  const handleRemoveParagraph = (index: number) => {
    updatePage(
      "paragraphs",
      paragraphs.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>📄</span> Kurumsal ve Bilgi Sayfaları Yönetimi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Kurumsal, İletişim, Teklif Al, Servis Talebi, KVKK ve Gizlilik sayfalarının başlık ve metin paragraflarını düzenleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Page Selector */}
        <div className="lg:col-span-4 space-y-2">
          {PAGE_DEFINITIONS.map((p) => (
            <div
              key={p.key}
              onClick={() => setActivePage(p.key)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                activePage === p.key
                  ? "border-blue-500 bg-blue-50/70 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <p className="font-bold text-sm text-slate-900">{p.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{p.hint}</p>
            </div>
          ))}
        </div>

        {/* Right Page Editor */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">{currentDef.label} Düzenleniyor</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentDef.hint}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Sayfa Başlığı
            </label>
            <input
              type="text"
              value={(currentPageData.title as string) || ""}
              onChange={(e) => updatePage("title", e.target.value)}
              placeholder="Sayfa Başlığı"
              className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Sayfa Üst Açıklaması (Hero Description)
            </label>
            <textarea
              rows={2}
              value={(currentPageData.description as string) || ""}
              onChange={(e) => updatePage("description", e.target.value)}
              placeholder="Sayfanın üstünde görünen karşılama açıklaması..."
              className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Paragraphs list for Kurumsal, KVKK, Gizlilik */}
          {currentDef.hasParagraphs && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Metin Paragrafları ({paragraphs.length})
              </label>

              <div className="space-y-3">
                {paragraphs.map((para, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-slate-600">Paragraf #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveParagraph(idx)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Sil ×
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <textarea
                  rows={3}
                  value={newParagraph}
                  onChange={(e) => setNewParagraph(e.target.value)}
                  placeholder="Yeni paragraf metni yazın..."
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 transition"
                >
                  + Paragrafı Ekle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
