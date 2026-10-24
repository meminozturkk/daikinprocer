"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type MediaItem = {
  name: string;
  url: string;
  size: number;
  createdAt: number;
};

export function MediaSection() {
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "brand" | "hero" | "references" | "uploads" | "catalog">("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const [mediaRes, catRes] = await Promise.all([
        fetch("/api/admin/media").then((r) => r.json()).catch(() => ({ files: [] })),
        fetch("/api/admin/catalog").then((r) => r.json()).catch(() => ({ files: [] })),
      ]);

      const mediaList: MediaItem[] = Array.isArray(mediaRes.files) ? mediaRes.files : [];
      const catList: MediaItem[] = Array.isArray(catRes.files) ? catRes.files : [];

      const map = new Map<string, MediaItem>();
      for (const item of [...mediaList, ...catList]) {
        if (!map.has(item.url)) {
          map.set(item.url, item);
        }
      }
      setMediaFiles(Array.from(map.values()));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/media").then((r) => r.json()).catch(() => ({ files: [] })),
      fetch("/api/admin/catalog").then((r) => r.json()).catch(() => ({ files: [] })),
    ]).then(([mediaRes, catRes]) => {
      if (!active) return;
      const mediaList: MediaItem[] = Array.isArray(mediaRes.files) ? mediaRes.files : [];
      const catList: MediaItem[] = Array.isArray(catRes.files) ? catRes.files : [];
      const map = new Map<string, MediaItem>();
      for (const item of [...mediaList, ...catList]) {
        if (!map.has(item.url)) {
          map.set(item.url, item);
        }
      }
      setMediaFiles(Array.from(map.values()));
      setLoading(false);
    }).catch(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      setUploading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
        formData.append("files", files[i]);
      }
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        fetchMedia();
      } else {
        alert(data.message || "Yükleme başarısız");
      }
    } catch {
      alert("Yükleme sırasında hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`"${filename}" dosyasını silmek istediğinize emin misiniz?`)) return;
    try {
      const res = await fetch(`/api/admin/media?name=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setMediaFiles((prev) => prev.filter((m) => m.name !== filename));
      } else {
        alert(data.message || "Silme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filtered = mediaFiles.filter((m) => {
    if (activeTab === "uploads" && !m.url.startsWith("/uploads/")) return false;
    if (
      activeTab === "brand" &&
      !m.url.includes("brand") &&
      !m.url.includes("logo") &&
      !m.url.includes("icon")
    )
      return false;
    if (
      activeTab === "hero" &&
      !m.url.includes("hero") &&
      !m.url.includes("campaigns") &&
      !m.url.includes("misc")
    )
      return false;
    if (activeTab === "references" && !m.url.includes("references")) return false;
    if (activeTab === "catalog" && !m.url.includes("catalog")) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🖼️</span> Medya ve Fotoğraf Galerisi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sitedeki tüm logoları, hero arka planlarını, referans görsellerini, ürün fotoğraflarını ve özel yüklemeleri yönetin.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            handleUpload(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200 mx-auto group-hover:scale-105 transition">
          <span className="text-2xl">📤</span>
        </div>
        <h3 className="mt-3 text-sm font-bold text-slate-900">
          {uploading ? "Fotoğraflar Yükleniyor..." : "Yeni Fotoğraf Seçin veya Buraya Sürükleyin"}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          JPG, PNG, WEBP veya SVG formatları (Maks. 10MB)
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              activeTab === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tümü ({mediaFiles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("brand")}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              activeTab === "brand" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏷️ Logolar ({mediaFiles.filter((f) => f.url.includes("brand") || f.url.includes("logo") || f.url.includes("icon")).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              activeTab === "hero" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏠 Hero & Vitrin ({mediaFiles.filter((f) => f.url.includes("hero") || f.url.includes("campaigns") || f.url.includes("misc")).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("references")}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              activeTab === "references" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏢 Referanslar ({mediaFiles.filter((f) => f.url.includes("references")).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("uploads")}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              activeTab === "uploads" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📤 Özel Yüklenenler ({mediaFiles.filter((f) => f.url.startsWith("/uploads/")).length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("catalog")}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              activeTab === "catalog" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ❄️ Katalog ({mediaFiles.filter((f) => f.url.includes("catalog")).length})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Fotoğraf veya dosya yolunda ara..."
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:max-w-xs"
          />
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <button
              onClick={fetchMedia}
              className="font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>🔄 Yenile</span>
            </button>
            <span>Toplam {filtered.length} dosya gösteriliyor</span>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          Fotoğraflar yükleniyor...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          {search ? "Aramanıza uygun fotoğraf bulunamadı." : "Henüz yüklenmiş özel fotoğraf bulunmuyor."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.url}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition"
            >
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center p-1">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-contain group-hover:scale-105 transition duration-300"
                  unoptimized
                />
              </div>

              <div className="p-2.5 space-y-2">
                <p className="text-[11px] font-mono text-slate-700 truncate" title={item.url}>
                  {item.name}
                </p>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {copiedUrl === item.url ? "✓ Kopyalandı!" : "Linki Kopyala"}
                  </button>

                  {item.url.startsWith("/uploads/") ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.name)}
                      className="text-[10px] text-red-500 hover:text-red-700 cursor-pointer"
                      title="Sil"
                    >
                      🗑️
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-300" title="Sistem Dosyası">
                      🔒
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
