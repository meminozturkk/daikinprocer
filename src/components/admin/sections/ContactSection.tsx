"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function ContactSection({ content, onChange }: Props) {
  const [newDistrict, setNewDistrict] = useState("");

  const updateContact = (key: keyof SiteContent["contact"], val: unknown) => {
    onChange({
      ...content,
      contact: {
        ...content.contact,
        [key]: val,
      },
    });
  };

  const handleAddDistrict = () => {
    if (!newDistrict.trim()) return;
    const currentList = content.contact.serviceArea || [];
    if (!currentList.includes(newDistrict.trim())) {
      updateContact("serviceArea", [...currentList, newDistrict.trim()]);
    }
    setNewDistrict("");
  };

  const handleRemoveDistrict = (district: string) => {
    const currentList = content.contact.serviceArea || [];
    updateContact(
      "serviceArea",
      currentList.filter((d) => d !== district)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>📞</span> İletişim, Konum ve Hizmet Bölgeleri
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Web sitesinde, arama motorlarında (SEO), Schema.org ve WhatsApp butonlarında kullanılan resmi iletişim bilgileri.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Brand & Phone Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Genel Marka & Telefon Numaraları
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Marka / Görünür İsim
            </label>
            <input
              type="text"
              value={content.contact.brandName || ""}
              onChange={(e) => updateContact("brandName", e.target.value)}
              placeholder="Proser Grup"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sabit Telefon (Santral)
              </label>
              <input
                type="text"
                value={content.contact.phoneLandline || ""}
                onChange={(e) => updateContact("phoneLandline", e.target.value)}
                placeholder="0 216 759 41 13"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobil / GSM Hattı
              </label>
              <input
                type="text"
                value={content.contact.phoneMobile || ""}
                onChange={(e) => updateContact("phoneMobile", e.target.value)}
                placeholder="0 536 860 87 70"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp Numarası
              </label>
              <input
                type="text"
                value={content.contact.whatsapp || ""}
                onChange={(e) => updateContact("whatsapp", e.target.value)}
                placeholder="0 536 860 87 70"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400">Teklif ve servis bildirimleri bu numaraya yönlendirilir.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={content.contact.email || ""}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="info@prosergrup.com"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Çalışma Saatleri
            </label>
            <input
              type="text"
              value={content.contact.hours || ""}
              onChange={(e) => updateContact("hours", e.target.value)}
              placeholder="Pzt–Cmt 09:00–18:00"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Physical Address & Districts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Fiziksel Konum & Adres
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tam Açık Adres
            </label>
            <textarea
              rows={3}
              value={content.contact.addressFull || ""}
              onChange={(e) => updateContact("addressFull", e.target.value)}
              placeholder="Gümüşpınar Mah. Elmaağacı Sk. No:6A-B Kartal / İstanbul"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                İlçe
              </label>
              <input
                type="text"
                value={content.contact.district || ""}
                onChange={(e) => updateContact("district", e.target.value)}
                placeholder="Kartal"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Şehir
              </label>
              <input
                type="text"
                value={content.contact.city || ""}
                onChange={(e) => updateContact("city", e.target.value)}
                placeholder="İstanbul"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Service Area Management (SEO & LLMs) */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hizmet Verilen Bölgeler (SEO, AI & JSON-LD)
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Bu ilçeler arka planda Google Arama ve LLM (ChatGPT, Perplexity vb.) motorlarına yetki bölgesi olarak bildirilir.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {(content.contact.serviceArea || []).map((district) => (
                <span
                  key={district}
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 border border-sky-200"
                >
                  <span>{district}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDistrict(district)}
                    className="text-sky-500 hover:text-red-600 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddDistrict();
                  }
                }}
                placeholder="Örn: Gebze, Beşiktaş, Pendik..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddDistrict}
                className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-900 transition"
              >
                + Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
