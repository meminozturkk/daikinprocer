"use client";

import type { SiteContent } from "@/lib/site-content-types";
import { ImagePickerInput } from "../ImagePickerInput";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function CampaignSection({ content, onChange }: Props) {
  const ann = content.announcement || { enabled: false, text: "", linkText: "Teklif Al", linkHref: "/teklif-al" };
  const camp = content.campaign || {
    enabled: true,
    image: "/campaigns/ilk-bakim-hediye.jpg",
    alt: "Proser Grup İlk Bakım Hediye Kampanyası",
    subtitle: "Daikin klima ve VRV sistemlerinde geçerli özel kampanya.",
    buttonText: "WhatsApp ile Teklif Al →",
    whatsappMessage: "Merhaba, İlk Bakım Hediye kampanyanız hakkında bilgi ve teklif almak istiyorum.",
    cooldownMinutes: 10,
  };

  const updateAnnouncement = (field: string, val: unknown) => {
    onChange({
      ...content,
      announcement: {
        ...ann,
        [field]: val,
      },
    });
  };

  const updateCampaign = (field: string, val: unknown) => {
    onChange({
      ...content,
      campaign: {
        ...camp,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🎁</span> Kampanya & Pop-Up Modal Yönetimi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sayfanın en üstündeki duyuru bandını ve ziyaretçilere açılan ilk bakım hediye pop-up modalını yönetin.
        </p>
      </div>

      {/* 1. Announcement Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>📢</span> Üst Duyuru Bandı (Announcement Bar)
          </h3>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={ann.enabled}
              onChange={(e) => updateAnnouncement("enabled", e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Aktif / Göster</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Duyuru Metni
          </label>
          <input
            type="text"
            value={ann.text || ""}
            onChange={(e) => updateAnnouncement("text", e.target.value)}
            placeholder="Daikin Klima ve Isı Pompalarında Ücretsiz Keşif ve Montaj Kampanyası Başladı!"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Buton / Link Metni
            </label>
            <input
              type="text"
              value={ann.linkText || ""}
              onChange={(e) => updateAnnouncement("linkText", e.target.value)}
              placeholder="Teklif Al"
              className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Link Hedefi (URL)
            </label>
            <input
              type="text"
              value={ann.linkHref || ""}
              onChange={(e) => updateAnnouncement("linkHref", e.target.value)}
              placeholder="/teklif-al"
              className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Campaign Popup Modal */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🎉</span> Kampanya Pop-Up Modalı (İlk Bakım Hediye)
          </h3>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={camp.enabled}
              onChange={(e) => updateCampaign("enabled", e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Pop-Up Aktif</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImagePickerInput
            label="Kampanya Görseli"
            value={camp.image || ""}
            onChange={(url) => updateCampaign("image", url)}
            placeholder="Kampanya görseli seçin veya yükleyin"
            description="Önerilen: 800x800 veya 1200x630"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Görsel Alt Metni (SEO)
            </label>
            <input
              type="text"
              value={camp.alt || ""}
              onChange={(e) => updateCampaign("alt", e.target.value)}
              placeholder="Proser Grup İlk Bakım Hediye Kampanyası"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alt Açıklama Metni (Subtitle)
            </label>
            <textarea
              rows={2}
              value={camp.subtitle || ""}
              onChange={(e) => updateCampaign("subtitle", e.target.value)}
              placeholder="Daikin klima ve VRV sistemlerinde geçerli özel kampanya."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tekrar Gösterim Süresi (Dakika)
            </label>
            <input
              type="number"
              min={1}
              value={camp.cooldownMinutes ?? 10}
              onChange={(e) => updateCampaign("cooldownMinutes", Number(e.target.value) || 10)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Buton Metni
            </label>
            <input
              type="text"
              value={camp.buttonText || ""}
              onChange={(e) => updateCampaign("buttonText", e.target.value)}
              placeholder="WhatsApp ile Teklif Al →"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              WhatsApp Gönderim Mesajı
            </label>
            <input
              type="text"
              value={camp.whatsappMessage || ""}
              onChange={(e) => updateCampaign("whatsappMessage", e.target.value)}
              placeholder="Merhaba, İlk Bakım Hediye kampanyanız hakkında bilgi ve teklif almak istiyorum."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
