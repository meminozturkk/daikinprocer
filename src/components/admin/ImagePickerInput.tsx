"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export interface ImagePickerInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  description?: string;
}

type MediaFile = {
  name: string;
  url: string;
  size?: number;
};

export function ImagePickerInput({
  label,
  value,
  onChange,
  placeholder = "Görsel seçilmedi",
  description,
}: ImagePickerInputProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<MediaFile[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "brand" | "hero" | "references" | "uploads" | "catalog">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const openGallery = () => {
    setModalOpen(true);
    setLoadingGallery(true);
    Promise.all([
      fetch("/api/admin/media").then((r) => r.json()).catch(() => ({ files: [] })),
      fetch("/api/admin/catalog").then((r) => r.json()).catch(() => ({ files: [] })),
    ])
      .then(([mediaData, catData]) => {
        const mediaList: MediaFile[] = Array.isArray(mediaData.files) ? mediaData.files : [];
        const catList: MediaFile[] = Array.isArray(catData.files) ? catData.files : [];
        const map = new Map<string, MediaFile>();
        for (const item of [...mediaList, ...catList]) {
          if (!map.has(item.url)) {
            map.set(item.url, item);
          }
        }
        setGalleryFiles(Array.from(map.values()));
      })
      .finally(() => {
        setLoadingGallery(false);
      });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", files[0]);
      fd.append("files", files[0]);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      const uploadedUrl = data.files?.[0]?.url || data.file?.url;
      if (data.ok && uploadedUrl) {
        onChange(uploadedUrl);
        const newFile = data.files?.[0] || data.file;
        if (newFile) {
          setGalleryFiles((prev) => [newFile, ...prev]);
        }
        setModalOpen(false);
      } else {
        alert(data.message || "Fotoğraf yüklenemedi");
      }
    } catch {
      alert("Fotoğraf yükleme sırasında bağlantı hatası oluştu");
    } finally {
      setUploading(false);
    }
  };

  const filtered = galleryFiles.filter((item) => {
    if (activeTab === "uploads" && !item.url.startsWith("/uploads/")) return false;
    if (
      activeTab === "brand" &&
      !item.url.includes("brand") &&
      !item.url.includes("logo") &&
      !item.url.includes("icon")
    )
      return false;
    if (
      activeTab === "hero" &&
      !item.url.includes("hero") &&
      !item.url.includes("campaigns") &&
      !item.url.includes("misc")
    )
      return false;
    if (activeTab === "references" && !item.url.includes("references")) return false;
    if (activeTab === "catalog" && !item.url.includes("catalog")) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.url.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-1.5">
      {/* Hidden file input for direct computer upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          handleFileUpload(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* Label & Description */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {label}
          </label>
          {description && (
            <span className="text-[11px] text-slate-400 font-normal">{description}</span>
          )}
        </div>
      )}

      {/* Main Image Control Bar */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition">
        {/* Left: Thumbnail Preview & URL Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-12 w-16 shrink-0 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center shadow-xs">
            {value ? (
              <Image
                src={value}
                alt="Önizleme"
                fill
                className="object-contain p-0.5"
                unoptimized
              />
            ) : (
              <span className="text-xl opacity-40">🖼️</span>
            )}
          </div>

          <div className="min-w-0">
            {value ? (
              <>
                <p className="text-xs font-mono font-semibold text-slate-800 truncate" title={value}>
                  {value.split("/").pop() || value}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate" title={value}>
                  {value}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-400 italic">{placeholder}</p>
            )}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={openGallery}
            className="rounded-lg bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Mevcut fotoğraflardan seç"
          >
            <span>🖼️</span>
            <span className="hidden sm:inline">Galeriden Seç</span>
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Bilgisayarınızdan yeni fotoğraf yükleyin"
          >
            <span>{uploading ? "⏳" : "📤"}</span>
            <span className="hidden sm:inline">
              {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
            </span>
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition text-xs font-bold"
              title="Fotoğrafı Kaldır"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Visual Gallery Selection Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <span>🖼️</span> Fotoğraf Seç / Yükle
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fotoğrafa tıklayarak anında seçebilir veya bilgisayarınızdan yeni fotoğraf yükleyebilirsiniz.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Upload Zone & Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Direct Upload inside modal */}
              <input
                ref={modalFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileUpload(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => modalFileInputRef.current?.click()}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <span>{uploading ? "⏳" : "📤"}</span>
                <span>{uploading ? "Yükleniyor..." : "Bilgisayardan Yeni Yükle"}</span>
              </button>

              {/* Categorized Tabs */}
              <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeTab === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tümü ({galleryFiles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("brand")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeTab === "brand" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🏷️ Logolar ({galleryFiles.filter((f) => f.url.includes("brand") || f.url.includes("logo") || f.url.includes("icon")).length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("hero")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeTab === "hero" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🏠 Hero & Vitrin ({galleryFiles.filter((f) => f.url.includes("hero") || f.url.includes("campaigns") || f.url.includes("misc")).length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("references")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeTab === "references" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🏢 Referanslar ({galleryFiles.filter((f) => f.url.includes("references")).length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("uploads")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeTab === "uploads" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  📤 Yüklenenler ({galleryFiles.filter((f) => f.url.startsWith("/uploads/")).length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("catalog")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeTab === "catalog" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ❄️ Katalog ({galleryFiles.filter((f) => f.url.includes("catalog")).length})
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Görsel ara..."
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
              />
            </div>

            {/* Thumbnail Grid */}
            <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[50vh] pr-1">
              {loadingGallery ? (
                <div className="flex items-center justify-center h-48 text-xs text-slate-400">
                  <span className="animate-spin mr-2">⏳</span> Fotoğraflar yükleniyor...
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-xs text-slate-400">
                  Görsel bulunamadı.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filtered.map((item) => {
                    const isSelected = value === item.url;
                    return (
                      <div
                        key={item.url}
                        onClick={() => {
                          onChange(item.url);
                          setModalOpen(false);
                        }}
                        className={`group relative rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500"
                            : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm"
                        }`}
                      >
                        <div className="relative aspect-square w-full rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center">
                          <Image
                            src={item.url}
                            alt={item.name}
                            fill
                            className="object-contain p-1 group-hover:scale-105 transition"
                            unoptimized
                          />
                          {isSelected && (
                            <span className="absolute top-1 right-1 rounded-full bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                              ✓
                            </span>
                          )}
                        </div>

                        <p className="mt-1.5 text-[10px] font-mono text-slate-700 truncate" title={item.name}>
                          {item.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{filtered.length} fotoğraf listeleniyor</span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl bg-slate-100 px-4 py-1.5 font-bold text-slate-700 hover:bg-slate-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
