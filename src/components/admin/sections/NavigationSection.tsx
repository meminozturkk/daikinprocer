"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function NavigationSection({ content, onChange }: Props) {
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");

  const nav = content.navigation || [];

  const handleAddItem = () => {
    if (!newLabel.trim() || !newHref.trim()) {
      alert("Lütfen menü başlığı ve linkini yazın.");
      return;
    }
    onChange({
      ...content,
      navigation: [...nav, { label: newLabel.trim(), href: newHref.trim() }],
    });
    setNewLabel("");
    setNewHref("");
  };

  const handleUpdateItem = (index: number, key: "label" | "href", val: string) => {
    const list = [...nav];
    list[index] = { ...list[index], [key]: val };
    onChange({ ...content, navigation: list });
  };

  const handleRemoveItem = (index: number) => {
    if (!confirm("Bu menü linkini silmek istediğinize emin misiniz?")) return;
    onChange({
      ...content,
      navigation: nav.filter((_, i) => i !== index),
    });
  };

  const handleAddChild = (parentIndex: number) => {
    const childLabel = prompt("Alt menü başlığı:");
    if (!childLabel) return;
    const childHref = prompt("Alt menü linki (Örn: /urunler/bireysel-klimalar):");
    if (!childHref) return;

    const list = [...nav];
    const parent = list[parentIndex];
    const children = parent.children || [];
    list[parentIndex] = {
      ...parent,
      children: [...children, { label: childLabel.trim(), href: childHref.trim() }],
    };
    onChange({ ...content, navigation: list });
  };

  const handleRemoveChild = (parentIndex: number, childIndex: number) => {
    const list = [...nav];
    const parent = list[parentIndex];
    const children = parent.children || [];
    list[parentIndex] = {
      ...parent,
      children: children.filter((_, i) => i !== childIndex),
    };
    onChange({ ...content, navigation: list });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🧭</span> Menü & Navigasyon Yönetimi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Üst menü çubuğunda (Header) ve mobil menüde yer alan bağlantıları ve açılır alt menüleri yönetin.
        </p>
      </div>

      {/* Add New Nav Item */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-blue-900">+ Yeni Menü Bağlantısı Ekle</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Menü Başlığı (Örn: Blog & Rehberler)"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <input
            type="text"
            value={newHref}
            onChange={(e) => setNewHref(e.target.value)}
            placeholder="Bağlantı URL (Örn: /blog)"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
        >
          Menüye Ekle
        </button>
      </div>

      {/* Existing Menu Items */}
      <div className="space-y-3">
        {nav.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateItem(idx, "label", e.target.value)}
                  className="rounded-xl border border-slate-300 p-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => handleUpdateItem(idx, "href", e.target.value)}
                  className="rounded-xl border border-slate-300 p-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddChild(idx)}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 text-xs font-bold transition whitespace-nowrap"
                  title="Alt Menü Ekle"
                >
                  + Alt Menü
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-red-500 hover:text-red-700 text-sm p-1 font-bold"
                  title="Menüyü Sil"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Sub-items (Dropdown Children) */}
            {item.children && item.children.length > 0 && (
              <div className="pl-6 border-l-2 border-blue-200 space-y-2 pt-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Açılır Alt Menü Linkleri</p>
                {item.children.map((child, cIdx) => (
                  <div key={cIdx} className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg text-xs">
                    <span className="font-semibold text-slate-700">{child.label}</span>
                    <span className="text-slate-400 font-mono">{child.href}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(idx, cIdx)}
                      className="text-red-500 hover:text-red-700 font-bold px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
