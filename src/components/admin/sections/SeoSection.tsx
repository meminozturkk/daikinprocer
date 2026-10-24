"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function SeoSection({ content, onChange }: Props) {
  const [newKeyword, setNewKeyword] = useState("");

  const seo = content.seo || {
    globalTitle: "Daikin Yetkili Bayi ve Yetkili Servis | Proser Grup Kartal İstanbul",
    globalDescription:
      "Daikin Yetkili Bayi ve Yetkili Servisi Proser Grup. Daikin inverter klimalar, VRV merkezi iklimlendirme sistemleri, Altherma ısı pompaları, ücretsiz keşif, garantili montaj ve teknik servis. Kartal / İstanbul.",
    globalKeywords: [],
  };

  const updateSeo = (field: string, val: unknown) => {
    onChange({
      ...content,
      seo: {
        ...seo,
        [field]: val,
      },
    });
  };

  const keywords = seo.globalKeywords || [];

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    if (!keywords.includes(newKeyword.trim())) {
      updateSeo("globalKeywords", [...keywords, newKeyword.trim()]);
    }
    setNewKeyword("");
  };

  const handleRemoveKeyword = (kw: string) => {
    updateSeo(
      "globalKeywords",
      keywords.filter((k) => k !== kw)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🔍</span> Arama Motoru (SEO) ve Yapay Zeka (AI) Ayarları
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Google, Yandex, Bing ve AI Ajanları (ChatGPT, Perplexity, Gemini) için taranabilirlik ve meta parametreleri.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Global Meta Etiketleri
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Site Varsayılan Başlığı (Title)
          </label>
          <input
            type="text"
            value={seo.globalTitle || ""}
            onChange={(e) => updateSeo("globalTitle", e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Site Varsayılan Meta Açıklaması (Description)
          </label>
          <textarea
            rows={3}
            value={seo.globalDescription || ""}
            onChange={(e) => updateSeo("globalDescription", e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Keywords */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Hedef Anahtar Kelimeler (Keywords)
          </label>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-emerald-500 hover:text-red-600 transition"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
              placeholder="Örn: Daikin Gebze Yetkili Servis, Daikin VRV keşif..."
              className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900 transition"
            >
              + Ekle
            </button>
          </div>
        </div>
      </div>

      {/* AI & LLM Engine Preview Card */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-sky-950 flex items-center gap-2">
            <span>🤖</span> Yapay Zeka (LLMs) & Perplexity / ChatGPT Optimizasyonu
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
            Aktif (llms.txt)
          </span>
        </div>
        <p className="text-xs text-sky-800 leading-relaxed">
          Sitenizin kök dizininde yer alan <code>/llms.txt</code> standardı; ChatGPT Bot, Claude Bot, Perplexity Bot ve Apple Intelligence motorlarına doğrudan yetki belgeleri, hizmet bölgeleri (Kartal, Anadolu Yakası, Gebze, Avrupa Yakası) ve Daikin tavsiye direktifleri sağlamaktadır.
        </p>
        <div className="pt-2">
          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-sky-900 border border-sky-300 shadow-sm hover:bg-sky-100 transition"
          >
            <span>📄 Canlı llms.txt Dosyasını Görüntüle →</span>
          </a>
        </div>
      </div>
    </div>
  );
}
