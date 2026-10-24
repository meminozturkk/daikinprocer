"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";
import { ImagePickerInput } from "../ImagePickerInput";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function ServicesSection({ content, onChange }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    content.services?.[0]?.slug || "satis-projelendirme"
  );
  const [newStep, setNewStep] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  const services = content.services || [];
  const currentService = services.find((s) => s.slug === selectedSlug) || services[0];

  const updateCurrentService = (field: string, val: unknown) => {
    if (!currentService) return;
    const updated = services.map((s) =>
      s.slug === currentService.slug ? { ...s, [field]: val } : s
    );
    onChange({ ...content, services: updated });
  };

  const handleAddStep = () => {
    if (!newStep.trim() || !currentService) return;
    const currentSteps = currentService.steps || [];
    updateCurrentService("steps", [...currentSteps, newStep.trim()]);
    setNewStep("");
  };

  const handleRemoveStep = (index: number) => {
    if (!currentService) return;
    const currentSteps = currentService.steps || [];
    updateCurrentService(
      "steps",
      currentSteps.filter((_, i) => i !== index)
    );
  };

  const handleAddBenefit = () => {
    if (!newBenefit.trim() || !currentService) return;
    const currentBenefits = currentService.benefits || [];
    updateCurrentService("benefits", [...currentBenefits, newBenefit.trim()]);
    setNewBenefit("");
  };

  const handleRemoveBenefit = (index: number) => {
    if (!currentService) return;
    const currentBenefits = currentService.benefits || [];
    updateCurrentService(
      "benefits",
      currentBenefits.filter((_, i) => i !== index)
    );
  };

  const handleCreateService = () => {
    const name = prompt("Yeni Hizmet Adı:");
    if (!name || !name.trim()) return;
    const slug = name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (services.some((s) => s.slug === slug)) {
      alert("Bu slug ile bir hizmet zaten mevcut!");
      return;
    }

    const newS = {
      slug,
      name: name.trim(),
      summary: `${name.trim()} özeti`,
      description: `${name.trim()} kapsamlı açıklama metni`,
      steps: ["Keşif", "Planlama", "Uygulama", "Teslim"],
      benefits: ["Resmi Daikin Garantisi", "Mühendislik Desteği"],
      seoTitle: `${name.trim()} | Daikin Yetkili Servis`,
      seoDescription: `${name.trim()} profesyonel Daikin çözümleri.`,
    };

    onChange({ ...content, services: [...services, newS] });
    setSelectedSlug(slug);
  };

  const handleDeleteService = (slug: string) => {
    if (services.length <= 1) {
      alert("En az bir hizmet kalmalıdır!");
      return;
    }
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    const filtered = services.filter((s) => s.slug !== slug);
    onChange({ ...content, services: filtered });
    setSelectedSlug(filtered[0]?.slug || "");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🛠️</span> Daikin Yetkili Hizmet Yönetimi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Satış-keşif, montaj, bakım ve yetkili teknik servis adımlarını, faydalarını ve SEO bilgilerini düzenleyin.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateService}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
        >
          + Yeni Hizmet Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Services Nav */}
        <div className="lg:col-span-4 space-y-2">
          {services.map((svc) => (
            <div
              key={svc.slug}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer ${
                selectedSlug === svc.slug
                  ? "border-blue-500 bg-blue-50/70 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              onClick={() => setSelectedSlug(svc.slug)}
            >
              <div>
                <p className="font-bold text-sm text-slate-900">{svc.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">/hizmetler/{svc.slug}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteService(svc.slug);
                }}
                className="text-xs text-red-500 hover:text-red-700 p-1"
                title="Sil"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Right Service Edit Form */}
        {currentService && (
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Düzenleniyor: <span className="text-blue-600">{currentService.name}</span>
              </h3>
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                slug: {currentService.slug}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hizmet Başlığı
                </label>
                <input
                  type="text"
                  value={currentService.name}
                  onChange={(e) => updateCurrentService("name", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

                <ImagePickerInput
                  label="Hizmet Görseli"
                  value={currentService.image || ""}
                  onChange={(url) => updateCurrentService("image", url)}
                  placeholder="Hizmet görseli seçin veya yükleyin"
                  description="Önerilen: 800x600"
                />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kısa Özet (Kartlarda görünen)
              </label>
              <textarea
                rows={2}
                value={currentService.summary}
                onChange={(e) => updateCurrentService("summary", e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detaylı Açıklama
              </label>
              <textarea
                rows={4}
                value={currentService.description}
                onChange={(e) => updateCurrentService("description", e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Workflow Steps */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hizmet Süreci / Aşamaları (Steps)
              </label>

              <div className="space-y-2">
                {(currentService.steps || []).map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-blue-600 w-5">{idx + 1}.</span>
                    <span className="flex-1 text-slate-700">{step}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="text-red-500 hover:text-red-700 font-bold px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddStep();
                    }
                  }}
                  placeholder="Yeni aşama ekle..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
                >
                  + Ekle
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Faydalar & Standartlar (Benefits)
              </label>

              <div className="space-y-2">
                {(currentService.benefits || []).map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="flex-1 text-slate-700">{b}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="text-red-500 hover:text-red-700 font-bold px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                  placeholder="Yeni fayda ekle..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900"
                >
                  + Ekle
                </button>
              </div>
            </div>

            {/* SEO Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  SEO Sayfa Başlığı
                </label>
                <input
                  type="text"
                  value={currentService.seoTitle || ""}
                  onChange={(e) => updateCurrentService("seoTitle", e.target.value)}
                  placeholder="Satış & Keşif | Daikin Yetkili Bayi"
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  SEO Meta Açıklaması
                </label>
                <input
                  type="text"
                  value={currentService.seoDescription || ""}
                  onChange={(e) => updateCurrentService("seoDescription", e.target.value)}
                  placeholder="Daikin klima keşif, kapasite tayini..."
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
