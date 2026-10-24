"use client";

import type { SiteContent } from "@/lib/site-content-types";
import { ImagePickerInput } from "../ImagePickerInput";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function HomeSection({ content, onChange }: Props) {

  const updateHero = (key: keyof SiteContent["hero"], val: unknown) => {
    onChange({
      ...content,
      hero: {
        ...content.hero,
        [key]: val,
      },
    });
  };

  const updateSectionMeta = (
    sectionKey: keyof SiteContent["homeSections"],
    field: string,
    val: unknown
  ) => {
    const current = content.homeSections?.[sectionKey] || {};
    onChange({
      ...content,
      homeSections: {
        ...content.homeSections,
        [sectionKey]: {
          ...current,
          [field]: val,
        },
      },
    });
  };

  const updateTrustPoint = (index: number, key: "title" | "description", val: string) => {
    const list = [...content.trustPoints];
    if (list[index]) {
      list[index] = { ...list[index], [key]: val };
      onChange({ ...content, trustPoints: list });
    }
  };

  const sysArch = content.homeSections?.systemArchitecture;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🏠</span> Ana Sayfa Bölümleri ve Başlık Yönetimi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Hero vitrini, bento güven kartları, sistem mimarisi ve tüm bölüm başlıklarını buradan yönetebilirsiniz.
        </p>
      </div>

      {/* 1. Hero Section Management */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🌟</span> 1. Hero Vitrini (Giriş Başlığı ve Metinleri)
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Üst Rozet Metni
          </label>
          <input
            type="text"
            value={content.hero.badge || ""}
            onChange={(e) => updateHero("badge", e.target.value)}
            placeholder="Resmi Daikin Yetkili Bayi & Yetkili Servis"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Ana Manşet Başlığı (H1)
          </label>
          <input
            type="text"
            value={content.hero.title || ""}
            onChange={(e) => updateHero("title", e.target.value)}
            placeholder="Mühendislik Güvencesiyle Resmi Daikin İklimlendirme"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Açıklama Paragrafı
          </label>
          <textarea
            rows={3}
            value={content.hero.description || ""}
            onChange={(e) => updateHero("description", e.target.value)}
            placeholder="Keşiften montaja, VRV projelerinden periyodik teknik servise..."
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImagePickerInput
            label="Hero Arka Plan Görseli"
            value={content.hero.image || ""}
            onChange={(url) => updateHero("image", url)}
            placeholder="Hero görseli seçin veya yükleyin"
            description="Önerilen: 1920x1080"
          />
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Saha Deneyimi (Yıl Sayacı)
            </label>
            <input
              type="number"
              value={content.hero.experienceYears ?? 10}
              onChange={(e) => updateHero("experienceYears", parseInt(e.target.value, 10) || 10)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Trust Bento Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🛡️</span> 2. Güven & Yetki (Bento Kartları)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bölüm Üst Yazı</label>
            <input
              type="text"
              value={content.homeSections?.trust?.eyebrow || ""}
              onChange={(e) => updateSectionMeta("trust", "eyebrow", e.target.value)}
              placeholder="Güven ve Yetki"
              className="w-full rounded-xl border border-slate-300 p-2 text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Bölüm Başlığı</label>
            <input
              type="text"
              value={content.homeSections?.trust?.title || ""}
              onChange={(e) => updateSectionMeta("trust", "title", e.target.value)}
              placeholder="Daikin Standartlarında Mühendislik Güvencesi"
              className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.trustPoints.map((point, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <span className="text-xs font-bold text-blue-700 uppercase">Kart 0{idx + 1}</span>
              <input
                type="text"
                value={point.title}
                onChange={(e) => updateTrustPoint(idx, "title", e.target.value)}
                placeholder="Kart Başlığı"
                className="w-full rounded-lg border border-slate-300 p-2 text-sm font-semibold bg-white"
              />
              <textarea
                rows={2}
                value={point.description}
                onChange={(e) => updateTrustPoint(idx, "description", e.target.value)}
                placeholder="Kart Açıklaması"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. System Architecture Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🏛️</span> 3. Sistem Mimarisi (Konut vs Ticari)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Residential */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
            <h4 className="text-sm font-bold text-blue-900">🏡 Konut İklimlendirme Kartı</h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Kart Başlığı</label>
              <input
                type="text"
                value={sysArch?.residentialTitle || ""}
                onChange={(e) => updateSectionMeta("systemArchitecture", "residentialTitle", e.target.value)}
                placeholder="Konut İklimlendirme Çözümleri"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Açıklama</label>
              <textarea
                rows={2}
                value={sysArch?.residentialDescription || ""}
                onChange={(e) => updateSectionMeta("systemArchitecture", "residentialDescription", e.target.value)}
                placeholder="Daireler, müstakil evler ve villalar için..."
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
              />
            </div>
          </div>

          {/* Commercial */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 text-white p-4 space-y-3">
            <h4 className="text-sm font-bold text-sky-300">🏢 Ticari & VRV Kartı</h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Kart Başlığı</label>
              <input
                type="text"
                value={sysArch?.commercialTitle || ""}
                onChange={(e) => updateSectionMeta("systemArchitecture", "commercialTitle", e.target.value)}
                placeholder="Ticari & VRV Merkezi Sistemler"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs font-bold text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Açıklama</label>
              <textarea
                rows={2}
                value={sysArch?.commercialDescription || ""}
                onChange={(e) => updateSectionMeta("systemArchitecture", "commercialDescription", e.target.value)}
                placeholder="Mağaza, ofis katı, otel, restoran..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Section Headings Strip (Categories, Workflow, Featured, References, FAQ, Blog) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>📑</span> 4. Diğer Ana Sayfa Bölüm Başlıkları
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700">Ürün Gamı / Kategoriler Bölümü</span>
            <input
              type="text"
              value={content.homeSections?.categories?.title || ""}
              onChange={(e) => updateSectionMeta("categories", "title", e.target.value)}
              placeholder="Daikin İklimlendirme Teknolojileri"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold bg-white"
            />
            <textarea
              rows={2}
              value={content.homeSections?.categories?.description || ""}
              onChange={(e) => updateSectionMeta("categories", "description", e.target.value)}
              placeholder="A+++ enerji verimliliği..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
            />
          </div>

          {/* Workflow */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700">4 Aşamalı İş Akışı Bölümü</span>
            <input
              type="text"
              value={content.homeSections?.workflow?.title || ""}
              onChange={(e) => updateSectionMeta("workflow", "title", e.target.value)}
              placeholder="Keşiften Servise 4 Aşamalı Mühendislik Akışı"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold bg-white"
            />
            <textarea
              rows={2}
              value={content.homeSections?.workflow?.description || ""}
              onChange={(e) => updateSectionMeta("workflow", "description", e.target.value)}
              placeholder="Şeffaf iletişim, resmi marka standartları..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
            />
          </div>

          {/* Featured Products */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700">Öne Çıkan Modeller Bölümü</span>
            <input
              type="text"
              value={content.homeSections?.featuredProducts?.title || ""}
              onChange={(e) => updateSectionMeta("featuredProducts", "title", e.target.value)}
              placeholder="En Çok Tercih Edilen Daikin Serileri"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold bg-white"
            />
            <textarea
              rows={2}
              value={content.homeSections?.featuredProducts?.description || ""}
              onChange={(e) => updateSectionMeta("featuredProducts", "description", e.target.value)}
              placeholder="Fiyat karmaşası yerine doğrudan ihtiyaca..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
            />
          </div>

          {/* References */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700">Referanslar Bölümü</span>
            <input
              type="text"
              value={content.homeSections?.references?.title || ""}
              onChange={(e) => updateSectionMeta("references", "title", e.target.value)}
              placeholder="Mühendisliğimize Güvenen Projeler"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold bg-white"
            />
            <textarea
              rows={2}
              value={content.homeSections?.references?.description || ""}
              onChange={(e) => updateSectionMeta("references", "description", e.target.value)}
              placeholder="Kamu kurumlarından otelcilik ve perakende..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
            />
          </div>

          {/* FAQ */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700">Sıkça Sorulan Sorular Bölümü</span>
            <input
              type="text"
              value={content.homeSections?.faq?.title || ""}
              onChange={(e) => updateSectionMeta("faq", "title", e.target.value)}
              placeholder="Sıkça Sorulan Sorular"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold bg-white"
            />
            <textarea
              rows={2}
              value={content.homeSections?.faq?.description || ""}
              onChange={(e) => updateSectionMeta("faq", "description", e.target.value)}
              placeholder="Yetki belgeleri, keşif süreci, garanti kapsamı..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
            />
          </div>

          {/* Blog */}
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <span className="text-xs font-bold text-slate-700">Blog & Rehberler Bölümü</span>
            <input
              type="text"
              value={content.homeSections?.blog?.title || ""}
              onChange={(e) => updateSectionMeta("blog", "title", e.target.value)}
              placeholder="İklimlendirme Uzmanlığı & Tavsiyeler"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold bg-white"
            />
            <textarea
              rows={2}
              value={content.homeSections?.blog?.description || ""}
              onChange={(e) => updateSectionMeta("blog", "description", e.target.value)}
              placeholder="Doğru klima seçimi, enerji verimliliği..."
              className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
