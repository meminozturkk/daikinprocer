"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import type { SiteContent } from "@/lib/site-content-types";
import { products, categories } from "@/content/products";
import type { Product } from "@/lib/types";
import { ImagePickerInput } from "../ImagePickerInput";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function ProductsSection({ content, onChange }: Props) {
  const overrides = useMemo(() => content.productOverrides || {}, [content.productOverrides]);
  const productImages = content.productImages || {};

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterMode, setFilterMode] = useState<"all" | "overridden" | "featured" | "hidden">("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editModalImage, setEditModalImage] = useState("");

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditModalImage(
      overrides[product.slug]?.image ||
      productImages[product.slug] ||
      ""
    );
  };

  // Direct Product Photo Picker & Upload Modal State
  const [photoModalProduct, setPhotoModalProduct] = useState<Product | null>(null);
  const [catalogFiles, setCatalogFiles] = useState<{ name: string; url: string }[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const openPhotoModal = (product: Product) => {
    setPhotoModalProduct(product);
    if (catalogFiles.length === 0) {
      setLoadingCatalog(true);
      Promise.all([
        fetch("/api/admin/catalog").then((r) => r.json()).catch(() => ({ files: [] })),
        fetch("/api/admin/media").then((r) => r.json()).catch(() => ({ files: [] })),
      ]).then(([catData, mediaData]) => {
        const catList: { name: string; url: string }[] = Array.isArray(catData.files) ? catData.files : [];
        const mediaList: { name: string; url: string }[] = Array.isArray(mediaData.files) ? mediaData.files : [];
        setCatalogFiles([...mediaList, ...catList]);
        setLoadingCatalog(false);
      });
    }
  };

  const handleDirectPhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !photoModalProduct) return;
    try {
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("files", files[0]);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const uploadedUrl = data.files?.[0]?.url || data.file?.url;
      if (data.ok && uploadedUrl) {
        handleAssignPhoto(photoModalProduct.slug, uploadedUrl);
        const newFile = data.files?.[0] || data.file;
        if (newFile) {
          setCatalogFiles((prev) => [newFile, ...prev]);
        }
      } else {
        alert(data.message || "Fotoğraf yüklenemedi");
      }
    } catch {
      alert("Fotoğraf yükleme sırasında bağlantı hatası oluştu");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAssignPhoto = (slug: string, url: string) => {
    onChange({
      ...content,
      productImages: {
        ...content.productImages,
        [slug]: url,
      },
      productOverrides: {
        ...overrides,
        [slug]: {
          ...overrides[slug],
          image: url,
        },
      },
    });
    setPhotoModalProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      const o = overrides[p.slug];

      if (filterMode === "overridden" && !o) return false;
      if (filterMode === "featured") {
        const isFeatured = o?.featured !== undefined ? o.featured : p.featured;
        if (!isFeatured) return false;
      }
      if (filterMode === "hidden") {
        if (!o?.hidden) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const displayName = o?.name || p.name;
        const match =
          displayName.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.series && p.series.toLowerCase().includes(q)) ||
          (p.modelCode && p.modelCode.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [selectedCategory, filterMode, search, overrides]);

  const updateOverride = (slug: string, updates: Partial<{
    name: string;
    summary: string;
    image: string;
    featured: boolean;
    hidden: boolean;
  }>) => {
    const current = overrides[slug] || {};
    onChange({
      ...content,
      productOverrides: {
        ...overrides,
        [slug]: {
          ...current,
          ...updates,
        },
      },
    });
  };

  const clearOverride = (slug: string) => {
    const next = { ...overrides };
    delete next[slug];
    onChange({
      ...content,
      productOverrides: next,
    });
  };

  const totalOverridden = Object.keys(overrides).length;
  const totalHidden = Object.values(overrides).filter((o) => o.hidden).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>❄️</span> Daikin Ürün Kataloğu (255 Ürün)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Katalogdaki tüm Daikin ürünlerini arayabilir; isim, açıklama, görsel üzerine yazabilir (override), öne çıkarabilir veya gizleyebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200 font-semibold">
            {totalOverridden} Özel Düzenleme
          </span>
          {totalHidden > 0 && (
            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg border border-amber-200 font-semibold">
              {totalHidden} Gizli
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Kategoriler ({products.length})</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterMode("overridden")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "overridden" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Özel Düzenlenenler
            </button>
            <button
              onClick={() => setFilterMode("featured")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "featured" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Öne Çıkanlar
            </button>
            <button
              onClick={() => setFilterMode("hidden")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "hidden" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Gizlenenler
            </button>
          </div>
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Model adı, seri veya kod ara..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 font-medium">
        Gösterilen: <span className="font-bold text-slate-800">{filteredProducts.length}</span> ürün
      </p>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.slice(0, 90).map((product) => {
          const o = overrides[product.slug];
          const displayImage = o?.image || productImages[product.slug] || product.image;
          const displayName = o?.name || product.name;
          const displaySummary = o?.summary || product.summary;
          const isFeatured = o?.featured !== undefined ? o.featured : product.featured;
          const isHidden = !!o?.hidden;

          return (
            <div
              key={product.slug}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition bg-white shadow-sm hover:shadow-md ${
                isHidden
                  ? "border-amber-300 bg-amber-50/30 opacity-70"
                  : o
                  ? "border-blue-300 ring-1 ring-blue-100"
                  : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="relative h-16 w-16 rounded-xl border border-slate-100 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center">
                    <Image
                      src={displayImage}
                      alt={displayName}
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {isHidden ? (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        🔒 Gizli
                      </span>
                    ) : isFeatured ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        ⭐ Öne Çıkan
                      </span>
                    ) : null}

                    {o && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        ✍️ Özelleştirildi
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono">
                      {product.series || product.category}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{displayName}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {displaySummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => startEditProduct(product)}
                    className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => openPhotoModal(product)}
                    className="rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100 transition flex items-center gap-1"
                    title="Fotoğraf Yükle veya Değiştir"
                  >
                    <span>📷</span>
                    <span>Fotoğraf</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateOverride(product.slug, { featured: !isFeatured })}
                    className={`text-xs p-1 rounded hover:bg-slate-100 transition ${
                      isFeatured ? "text-amber-500 font-bold" : "text-slate-400"
                    }`}
                    title={isFeatured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                  >
                    ⭐
                  </button>

                  <button
                    type="button"
                    onClick={() => updateOverride(product.slug, { hidden: !isHidden })}
                    className={`text-xs p-1 rounded hover:bg-slate-100 transition ${
                      isHidden ? "text-red-500 font-bold" : "text-slate-400"
                    }`}
                    title={isHidden ? "Katalogda göster" : "Katalogdan gizle"}
                  >
                    {isHidden ? "👁️" : "🔒"}
                  </button>

                  {o && (
                    <button
                      type="button"
                      onClick={() => clearOverride(product.slug)}
                      className="text-xs text-slate-400 hover:text-red-600 p-1"
                      title="Özelleştirmeyi sil"
                    >
                      ↺
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length > 90 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
          İlk 90 ürün listeleniyor. Diğer ürünlere ulaşmak için lütfen yukarıdaki arama kutusunu kullanın.
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Ürün Özelleştirme (Override)</h3>
                <p className="text-xs text-slate-400 font-mono">slug: {editingProduct.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Özel Ürün Adı (Varsayılan: {editingProduct.name})
                </label>
                <input
                  type="text"
                  defaultValue={overrides[editingProduct.slug]?.name || ""}
                  id="modal-product-name"
                  placeholder={editingProduct.name}
                  className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <ImagePickerInput
                label="Özel Ürün Görseli"
                value={editModalImage}
                onChange={(url) => setEditModalImage(url)}
                placeholder={editingProduct.image}
                description="Değiştirilmezse varsayılan katalog görseli kullanılır"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Özel Ürün Açıklaması / Özeti
                </label>
                <textarea
                  rows={3}
                  defaultValue={overrides[editingProduct.slug]?.summary || ""}
                  id="modal-product-summary"
                  placeholder={editingProduct.summary}
                  className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={
                      overrides[editingProduct.slug]?.featured !== undefined
                        ? overrides[editingProduct.slug].featured
                        : editingProduct.featured
                    }
                    id="modal-product-featured"
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span>⭐ Ana Sayfada Öne Çıkar</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={!!overrides[editingProduct.slug]?.hidden}
                    id="modal-product-hidden"
                    className="h-4 w-4 rounded text-red-600"
                  />
                  <span>🔒 Katalogdan Gizle</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => {
                  const nameVal = (document.getElementById("modal-product-name") as HTMLInputElement)?.value;
                  const summaryVal = (document.getElementById("modal-product-summary") as HTMLTextAreaElement)?.value;
                  const featuredVal = (document.getElementById("modal-product-featured") as HTMLInputElement)?.checked;
                  const hiddenVal = (document.getElementById("modal-product-hidden") as HTMLInputElement)?.checked;

                  updateOverride(editingProduct.slug, {
                    name: nameVal?.trim() ? nameVal.trim() : undefined,
                    image: editModalImage?.trim() ? editModalImage.trim() : undefined,
                    summary: summaryVal?.trim() ? summaryVal.trim() : undefined,
                    featured: featuredVal,
                    hidden: hiddenVal,
                  });
                  setEditingProduct(null);
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-md"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Picker & Direct Upload Modal */}
      {photoModalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setPhotoModalProduct(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center">
                  <Image
                    src={
                      overrides[photoModalProduct.slug]?.image ||
                      productImages[photoModalProduct.slug] ||
                      photoModalProduct.image
                    }
                    alt={photoModalProduct.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Ürün Fotoğrafını Değiştir</h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">{photoModalProduct.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPhotoModalProduct(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* 1. Direct Computer Upload */}
            <div className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-6 text-center space-y-2">
              <input
                ref={photoFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleDirectPhotoUpload(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={uploadingPhoto}
                  onClick={() => photoFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-600/20 hover:bg-sky-500 disabled:opacity-50 transition cursor-pointer"
                >
                  <span>{uploadingPhoto ? "⏳" : "📁"}</span>
                  <span>{uploadingPhoto ? "Fotoğraf Yükleniyor..." : "Bilgisayardan Yeni Fotoğraf Yükle & Ata"}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Seçtiğiniz görsel otomatik olarak sunucuya yüklenir ve anında bu ürüne atanır.
              </p>
            </div>

            {/* 2. Visual Catalog / Media Gallery Picker */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🖼️</span> Sitedeki Daikin Katalog ve Medya Arşivinden Seç:
                </label>
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Görsel ara..."
                  className="w-full sm:w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {loadingCatalog ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Katalog görselleri taranıyor...
                </div>
              ) : (
                <div className="grid max-h-56 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {catalogFiles
                    .filter((f) => {
                      if (!pickerSearch.trim()) return true;
                      const q = pickerSearch.toLowerCase();
                      return f.name.toLowerCase().includes(q) || f.url.toLowerCase().includes(q);
                    })
                    .map((file) => (
                      <button
                        key={file.url}
                        type="button"
                        onClick={() => handleAssignPhoto(photoModalProduct.slug, file.url)}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-left transition hover:border-sky-500 hover:ring-2 hover:ring-sky-500/20 hover:shadow-sm"
                        title={file.name}
                      >
                        <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-lg overflow-hidden">
                          <Image
                            src={file.url}
                            alt={file.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <span className="mt-1 block text-[10px] text-slate-600 truncate font-mono">
                          {file.name}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* 3. Manual URL Input */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Veya Manuel Görsel URL / Dosya Yolu:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  defaultValue={
                    overrides[photoModalProduct.slug]?.image ||
                    productImages[photoModalProduct.slug] ||
                    photoModalProduct.image
                  }
                  id="picker-manual-url"
                  placeholder="/sourced/catalog/stylish-silver.png"
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("picker-manual-url") as HTMLInputElement;
                    if (el?.value?.trim()) {
                      handleAssignPhoto(photoModalProduct.slug, el.value.trim());
                    }
                  }}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  Ata
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
