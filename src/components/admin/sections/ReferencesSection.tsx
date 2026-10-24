"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteContent } from "@/lib/site-content-types";
import { ImagePickerInput } from "../ImagePickerInput";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function ReferencesSection({ content, onChange }: Props) {
  const [newName, setNewName] = useState("");
  const [newSector, setNewSector] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newImage, setNewImage] = useState("");

  const refs = content.references || [];

  const handleAddRef = () => {
    if (!newName.trim() || !newSector.trim()) {
      alert("Lütfen referans adını ve sektörünü belirtin.");
      return;
    }
    onChange({
      ...content,
      references: [
        ...refs,
        {
          name: newName.trim(),
          sector: newSector.trim(),
          summary: newSummary.trim() || `${newName.trim()} iklimlendirme projesi.`,
          image: newImage.trim() || undefined,
        },
      ],
    });
    setNewName("");
    setNewSector("");
    setNewSummary("");
    setNewImage("");
  };

  const handleUpdateRef = (index: number, key: string, val: string) => {
    const list = [...refs];
    list[index] = { ...list[index], [key]: val };
    onChange({ ...content, references: list });
  };

  const handleRemoveRef = (index: number) => {
    if (!confirm("Bu referansı silmek istediğinize emin misiniz?")) return;
    onChange({
      ...content,
      references: refs.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🏢</span> Proje Referansları Yönetimi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ana sayfada referanslar bölümünde gösterilen kamu, otelcilik, perakende ve konut projeleri.
        </p>
      </div>

      {/* Add New Reference Form */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-blue-900">+ Yeni Referans Proje Ekle</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Firma / Kurum / Proje Adı"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <input
            type="text"
            value={newSector}
            onChange={(e) => setNewSector(e.target.value)}
            placeholder="Sektör (Örn: Kamu, Perakende, Otelcilik, Sağlık)"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            value={newSummary}
            onChange={(e) => setNewSummary(e.target.value)}
            placeholder="Proje Kapsamı (Örn: VRV merkezi iklimlendirme ve havalandırma)"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <ImagePickerInput
          label="Logo / Referans Görseli (Opsiyonel)"
          value={newImage}
          onChange={(url) => setNewImage(url)}
          placeholder="Logo veya referans görseli seçin veya yükleyin"
        />
        <button
          type="button"
          onClick={handleAddRef}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
        >
          Referansı Ekle
        </button>
      </div>

      {/* References Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {refs.map((ref, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                {ref.sector}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveRef(idx)}
                className="text-xs text-red-500 hover:text-red-700 font-bold"
                title="Sil"
              >
                🗑️
              </button>
            </div>

            {ref.image && (
              <div className="relative h-12 w-full rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                <Image
                  src={ref.image}
                  alt={ref.name}
                  width={120}
                  height={40}
                  className="max-h-10 w-auto object-contain"
                />
              </div>
            )}

            <input
              type="text"
              value={ref.name}
              onChange={(e) => handleUpdateRef(idx, "name", e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              value={ref.sector}
              onChange={(e) => handleUpdateRef(idx, "sector", e.target.value)}
              placeholder="Sektör"
              className="w-full rounded-xl border border-slate-200 p-1.5 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              rows={2}
              value={ref.summary}
              onChange={(e) => handleUpdateRef(idx, "summary", e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
