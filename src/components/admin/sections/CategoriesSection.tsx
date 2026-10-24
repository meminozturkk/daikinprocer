"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";
import { categories as defaultCategories } from "@/content/products";
import { ImagePickerInput } from "../ImagePickerInput";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

const CATEGORY_SHOWCASE_META: Record<
  string,
  {
    badgeDefault: string;
    badgeLabel: string;
    locationLabel: string;
    descriptionHint: string;
  }
> = {
  "bireysel-klimalar": {
    badgeDefault: "AMİRAL GEMİSİ SERİSİ",
    badgeLabel: "Üst Rozet (Varsayılan: AMİRAL GEMİSİ SERİSİ)",
    locationLabel: "🏠 Ana Sayfa Amiral Gemisi (Büyük Vitrin Kartı - 2 Sütun)",
    descriptionHint: "Ana sayfada Bireysel Klimalar kartının altında gösterilen tanıtım açıklaması.",
  },
  "vrv-sistemleri": {
    badgeDefault: "MERKEZİ ÇÖZÜM",
    badgeLabel: "Üst Rozet (Varsayılan: MERKEZİ ÇÖZÜM)",
    locationLabel: "🏢 Ana Sayfa Sağ Üst Vitrin Kartı (VRV Sistemleri)",
    descriptionHint: "Ana sayfada VRV Merkezi Sistemler kartının altında gösterilen tanıtım açıklaması.",
  },
  "isi-pompalari": {
    badgeDefault: "DÜŞÜK KARBON",
    badgeLabel: "Üst Rozet (Varsayılan: DÜŞÜK KARBON)",
    locationLabel: "🌱 Ana Sayfa Sağ Alt Vitrin Kartı (Altherma Isı Pompaları)",
    descriptionHint: "Ana sayfada Altherma Isı Pompaları kartının altında gösterilen tanıtım açıklaması.",
  },
  "multi-split": {
    badgeDefault: "ÇOKLU ODA",
    badgeLabel: "Üst Rozet",
    locationLabel: "🏠 Ana Sayfa Alt Şerit Kartı & /urunler/multi-split",
    descriptionHint: "Multi Split kartında ve ürünler sayfasında görünen açıklama.",
  },
  "ticari-klimalar": {
    badgeDefault: "SKY AIR",
    badgeLabel: "Üst Rozet",
    locationLabel: "🏬 Ana Sayfa Alt Şerit Kartı & /urunler/ticari-klimalar",
    descriptionHint: "Ticari Klimalar (Sky Air) kartında ve ürünler sayfasında görünen açıklama.",
  },
  "havalandirma": {
    badgeDefault: "İÇ ORTAM HAVA",
    badgeLabel: "Üst Rozet",
    locationLabel: "💨 Ana Sayfa Alt Şerit Kartı & /urunler/havalandirma",
    descriptionHint: "Havalandırma & Hava Kalitesi kartında ve ürünler sayfasında görünen açıklama.",
  },
};

export function CategoriesSection({ content, onChange }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string>("bireysel-klimalar");

  const overrides = content.categoryOverrides || {};
  const currentCategory = defaultCategories.find((c) => c.slug === selectedSlug) || defaultCategories[0];
  const currentOverride = overrides[selectedSlug] || {};
  const meta = CATEGORY_SHOWCASE_META[selectedSlug] || {
    badgeDefault: "KATEGORİ",
    badgeLabel: "Üst Rozet",
    locationLabel: "Ana Sayfa ve Ürünler Sayfası",
    descriptionHint: "Kategori açıklama metni.",
  };

  const updateCategoryOverride = (field: string, val: string) => {
    onChange({
      ...content,
      categoryOverrides: {
        ...overrides,
        [selectedSlug]: {
          ...currentOverride,
          [field]: val,
        },
      },
    });
  };

  const clearCategoryOverride = () => {
    if (!confirm("Bu kategori için yapılan özel metin ve görsel değişikliklerini sıfırlamak istiyor musunuz?")) return;
    const nextOverrides = { ...overrides };
    delete nextOverrides[selectedSlug];
    onChange({
      ...content,
      categoryOverrides: nextOverrides,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🏷️</span> Daikin Kategori Vitrinleri & Tanıtımları
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ana sayfadaki bento kartlarının ve ürün kategori sayfalarının rozet, isim, açıklama ve görsellerini özelleştirin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category List */}
        <div className="lg:col-span-4 space-y-2">
          {defaultCategories.map((cat) => {
            const hasOverride = !!overrides[cat.slug];
            const isSelected = selectedSlug === cat.slug;
            return (
              <div
                key={cat.slug}
                onClick={() => setSelectedSlug(cat.slug)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/70 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-slate-900">{cat.name}</p>
                  {hasOverride && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                      Özel
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">/urunler/{cat.slug}</p>
              </div>
            );
          })}
        </div>

        {/* Category Editor */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {meta.locationLabel}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{currentCategory.name}</h3>
            </div>
            {overrides[selectedSlug] && (
              <button
                type="button"
                onClick={clearCategoryOverride}
                className="text-xs text-slate-500 hover:text-red-600 underline font-medium self-start sm:self-auto"
              >
                Varsayılana Sıfırla
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Başlığı
              </label>
              <input
                type="text"
                value={currentOverride.name ?? currentCategory.name}
                onChange={(e) => updateCategoryOverride("name", e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {meta.badgeLabel}
              </label>
              <input
                type="text"
                value={currentOverride.badge ?? meta.badgeDefault}
                onChange={(e) => updateCategoryOverride("badge", e.target.value)}
                placeholder={meta.badgeDefault}
                className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tanıtım Açıklaması
            </label>
            <textarea
              rows={3}
              value={currentOverride.description ?? currentCategory.description}
              onChange={(e) => updateCategoryOverride("description", e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-400 mt-1 block">{meta.descriptionHint}</span>
          </div>

          <ImagePickerInput
            label="Kategori Vitrin Görseli"
            value={currentOverride.image ?? currentCategory.image}
            onChange={(url) => updateCategoryOverride("image", url)}
            placeholder="Kategori vitrin görseli seçin veya yükleyin"
            description="Ana sayfa bento ve kategori sayfalarında görünür"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                SEO Sayfa Başlığı (Title)
              </label>
              <input
                type="text"
                value={currentOverride.seoTitle ?? currentCategory.seoTitle}
                onChange={(e) => updateCategoryOverride("seoTitle", e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                SEO Meta Açıklaması (Description)
              </label>
              <input
                type="text"
                value={currentOverride.seoDescription ?? currentCategory.seoDescription}
                onChange={(e) => updateCategoryOverride("seoDescription", e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
