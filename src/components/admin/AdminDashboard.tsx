"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";
import { defaultSiteContent } from "@/lib/site-content-types";
import type { BlogPost } from "@/lib/types";

type TabKey = "contact" | "hero" | "announcement" | "trust" | "blog" | "media";

export type CatalogProductItem = {
  slug: string;
  name: string;
  category: string;
  series: string;
  modelCode?: string;
  defaultImage: string;
};

type BlogPostForm = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  tagsString: string;
  image: string;
  contentString: string;
};

type MediaItem = {
  name: string;
  url: string;
  size: number;
  createdAt: number;
};

const BLOG_IMAGE_PRESETS = [
  { label: "Klima Seçimi", url: "/sourced/blog/klima-secimi.jpg" },
  { label: "Duvar Tipi", url: "/sourced/products/duvar-tipi.jpg" },
  { label: "Multi Split", url: "/sourced/products/multi.jpg" },
  { label: "VRV Sistem", url: "/sourced/products/vrf.jpg" },
  { label: "Isı Pompası", url: "/sourced/products/isi-pompasi.jpg" },
  { label: "Teknik Servis", url: "/sourced/misc/service.jpg" },
  { label: "Modern Konut", url: "/sourced/hero/slide-1.jpg" },
];

const HERO_IMAGE_PRESETS = [
  { label: "Modern Salon (Varsayılan)", url: "/sourced/hero/slide-1.jpg" },
  { label: "Modern Mimari 2", url: "/sourced/hero/slide-2.jpg" },
  { label: "Modern Mimari 3", url: "/sourced/hero/slide-3.jpg" },
  { label: "VRF Vitrin", url: "/sourced/hero/vrf-showcase.png" },
];

function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c",
    ğ: "g", Ğ: "g",
    ı: "i", İ: "i",
    ö: "o", Ö: "o",
    ş: "s", Ş: "s",
    ü: "u", Ü: "u",
  };
  return text
    .split("")
    .map((char) => trMap[char] || char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function AdminDashboard({
  initialContent,
  catalogProducts = [],
}: {
  initialContent: SiteContent;
  catalogProducts?: CatalogProductItem[];
}) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<TabKey>("contact");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Media Library State
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Media Sub-tabs: 'uploads' | 'catalog' | 'products'
  const [mediaSubTab, setMediaSubTab] = useState<"uploads" | "catalog" | "products">("uploads");

  // Catalog Files State
  const [catalogFiles, setCatalogFiles] = useState<MediaItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");

  // Product Images Override State
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<CatalogProductItem | null>(null);
  const [pickerSearchQuery, setPickerSearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const catalogFileInputRef = useRef<HTMLInputElement>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const productCustomFileInputRef = useRef<HTMLInputElement>(null);

  // Blog Editor State
  const [editingPostIndex, setEditingPostIndex] = useState<number | null>(null);
  const [postFormData, setPostFormData] = useState<BlogPostForm>({
    slug: "",
    title: "",
    excerpt: "",
    date: new Date().toISOString().split("T")[0],
    readingMinutes: 5,
    tagsString: "",
    image: "/sourced/hero/slide-1.jpg",
    contentString: "",
  });
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [blogFormError, setBlogFormError] = useState<string | null>(null);
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Fetch Media on Mount
  const fetchMediaFiles = async () => {
    try {
      setMediaLoading(true);
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (data.ok && Array.isArray(data.files)) {
        setMediaFiles(data.files);
      }
    } catch {
      // ignore
    } finally {
      setMediaLoading(false);
    }
  };

  const fetchCatalogFiles = async () => {
    try {
      setCatalogLoading(true);
      const res = await fetch("/api/admin/catalog");
      const data = await res.json();
      if (data.ok && Array.isArray(data.files)) {
        setCatalogFiles(data.files);
      }
    } catch {
      // ignore
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
    fetchCatalogFiles();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleResetToDefault = () => {
    if (confirm("Tüm alanları, blog yazılarını ve ürün görsellerini varsayılan değerlere sıfırlamak istediğinize emin misiniz?")) {
      setContent(defaultSiteContent);
      setEditingPostIndex(null);
      setStatusMessage({ type: "success", text: "Varsayılan değerler yüklendi. Değişiklikleri yayına almak için 'Kaydet' butonuna basın." });
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Kaydetme sırasında bir hata oluştu");
      }

      setStatusMessage({ type: "success", text: "Değişiklikler başarıyla kaydedildi ve tüm sitede yayına alındı!" });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Beklenmedik bir hata oluştu",
      });
    } finally {
      setSaving(false);
    }
  };

  // Upload Handlers
  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/media", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.message || "Fotoğraf yüklenemedi");
    }

    await fetchMediaFiles();
    return data.file.url;
  };

  const handleMediaFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setStatusMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        await uploadSingleFile(files[i]);
      }
      setStatusMessage({ type: "success", text: `${files.length} adet fotoğraf başarıyla yüklendi!` });
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Görsel yüklenirken bir hata oluştu",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCatalogFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setStatusMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const res = await fetch("/api/admin/catalog", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || "Katalog görseli yüklenemedi");
      }
      await fetchCatalogFiles();
      setStatusMessage({ type: "success", text: `${files.length} adet katalog görseli başarıyla yüklendi!` });
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Katalog görseli yüklenirken hata oluştu",
      });
    } finally {
      setUploading(false);
      if (catalogFileInputRef.current) catalogFileInputRef.current.value = "";
    }
  };

  const handleDeleteMedia = async (filename: string) => {
    if (!confirm(`"${filename}" adlı fotoğrafı kalıcı olarak silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Fotoğraf silinemedi");
      }

      setMediaFiles((prev) => prev.filter((m) => m.name !== filename));
      setStatusMessage({ type: "success", text: `"${filename}" fotoğrafı silindi.` });
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Silme işlemi sırasında hata oluştu",
      });
    }
  };

  const handleDeleteCatalogFile = async (filename: string) => {
    if (!confirm(`"${filename}" katalog görselini arşivden silmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch("/api/admin/catalog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Katalog görseli silinemedi");
      }

      setCatalogFiles((prev) => prev.filter((m) => m.name !== filename));
      setStatusMessage({ type: "success", text: `"${filename}" katalog görseli silindi.` });
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Silme işlemi sırasında hata oluştu",
      });
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Product Image Overrides
  const handleSetProductImage = (productSlug: string, imageUrl: string) => {
    setContent({
      ...content,
      productImages: {
        ...(content.productImages || {}),
        [productSlug]: imageUrl,
      },
    });
    setSelectedProductToEdit(null);
    setStatusMessage({
      type: "success",
      text: "Ürün görseli başarıyla atandı! Değişiklikleri yayına almak için 'Değişiklikleri Kaydet' butonuna basınız.",
    });
  };

  const handleResetProductImage = (productSlug: string) => {
    const updated = { ...(content.productImages || {}) };
    delete updated[productSlug];
    setContent({
      ...content,
      productImages: updated,
    });
    setStatusMessage({
      type: "success",
      text: "Ürün görseli varsayılan katalog görseline sıfırlandı. Yayına almak için 'Değişiklikleri Kaydet' butonuna basınız.",
    });
  };

  const handleProductDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProductToEdit) return;

    setUploading(true);
    try {
      const newUrl = await uploadSingleFile(file);
      handleSetProductImage(selectedProductToEdit.slug, newUrl);
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Görsel yüklenemedi",
      });
    } finally {
      setUploading(false);
      if (productCustomFileInputRef.current) productCustomFileInputRef.current.value = "";
    }
  };

  // Direct Upload for Hero
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newUrl = await uploadSingleFile(file);
      setContent({
        ...content,
        hero: { ...content.hero, image: newUrl },
      });
      setStatusMessage({
        type: "success",
        text: "Hero görseli başarıyla yüklendi! Değişiklikleri yayına almak için 'Değişiklikleri Kaydet' butonuna basınız.",
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Fotoğraf yüklenemedi",
      });
    } finally {
      setUploading(false);
      if (heroFileInputRef.current) heroFileInputRef.current.value = "";
    }
  };

  // Direct Upload for Blog
  const handleBlogFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newUrl = await uploadSingleFile(file);
      setPostFormData((prev) => ({ ...prev, image: newUrl }));
      setStatusMessage({
        type: "success",
        text: "Kapak görseli yüklendi ve blog yazısına uygulandı!",
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Fotoğraf yüklenemedi",
      });
    } finally {
      setUploading(false);
      if (blogFileInputRef.current) blogFileInputRef.current.value = "";
    }
  };

  // Blog Handlers
  const handleStartAddPost = () => {
    setEditingPostIndex(-1);
    setPostFormData({
      slug: "",
      title: "",
      excerpt: "",
      date: new Date().toISOString().split("T")[0],
      readingMinutes: 5,
      tagsString: "Daikin, Klima, Rehber",
      image: "/sourced/blog/klima-secimi.jpg",
      contentString: "",
    });
    setIsSlugManuallyEdited(false);
    setBlogFormError(null);
    setShowPreview(false);
  };

  const handleStartEditPost = (index: number) => {
    const post = content.posts[index];
    if (!post) return;
    setEditingPostIndex(index);
    setPostFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      readingMinutes: post.readingMinutes,
      tagsString: post.tags.join(", "),
      image: post.image || "/sourced/hero/slide-1.jpg",
      contentString: post.content.join("\n\n"),
    });
    setIsSlugManuallyEdited(true);
    setBlogFormError(null);
    setShowPreview(false);
  };

  const handleTitleChange = (newTitle: string) => {
    setPostFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: isSlugManuallyEdited ? prev.slug : slugify(newTitle),
    }));
  };

  const handleAutoSlug = () => {
    setPostFormData((prev) => ({
      ...prev,
      slug: slugify(prev.title),
    }));
    setIsSlugManuallyEdited(false);
  };

  const handleSavePostForm = (e: React.FormEvent) => {
    e.preventDefault();
    setBlogFormError(null);

    const cleanTitle = postFormData.title.trim();
    const cleanSlug = slugify(postFormData.slug.trim());
    const cleanExcerpt = postFormData.excerpt.trim();
    const cleanDate = postFormData.date.trim() || new Date().toISOString().split("T")[0];
    const readingMins = Math.max(1, Number(postFormData.readingMinutes) || 5);
    const tags = postFormData.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const paragraphs = postFormData.contentString
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (!cleanTitle) {
      setBlogFormError("Lütfen bir yazı başlığı girin.");
      return;
    }
    if (!cleanSlug) {
      setBlogFormError("Lütfen geçerli bir URL slug girin.");
      return;
    }
    if (!cleanExcerpt) {
      setBlogFormError("Lütfen kısa bir yazı özeti girin.");
      return;
    }
    if (paragraphs.length === 0) {
      setBlogFormError("Lütfen en az bir paragraf içerik girin.");
      return;
    }

    const isConflict = content.posts.some(
      (p, idx) => idx !== editingPostIndex && p.slug === cleanSlug
    );
    if (isConflict) {
      setBlogFormError(`"${cleanSlug}" adresi başka bir blog yazısında zaten kullanılıyor. Lütfen benzersiz bir URL slug belirleyin.`);
      return;
    }

    const updatedPost: BlogPost = {
      slug: cleanSlug,
      title: cleanTitle,
      excerpt: cleanExcerpt,
      date: cleanDate,
      readingMinutes: readingMins,
      tags,
      image: postFormData.image.trim() || undefined,
      content: paragraphs,
    };

    let updatedPosts = [...(content.posts || [])];
    if (editingPostIndex === -1) {
      updatedPosts = [updatedPost, ...updatedPosts];
    } else if (editingPostIndex !== null) {
      updatedPosts[editingPostIndex] = updatedPost;
    }

    setContent({ ...content, posts: updatedPosts });
    setEditingPostIndex(null);
    setStatusMessage({
      type: "success",
      text: editingPostIndex === -1
        ? `"${cleanTitle}" yazısı listeye eklendi. Sitede yayına almak için yukarıdaki "Değişiklikleri Kaydet" butonuna basınız.`
        : `"${cleanTitle}" yazısı güncellendi. Sitede yayına almak için yukarıdaki "Değişiklikleri Kaydet" butonuna basınız.`
    });
  };

  const handleDeletePost = (index: number) => {
    const post = content.posts[index];
    if (!post) return;
    if (confirm(`"${post.title}" başlıklı yazıyı silmek istediğinize emin misiniz?`)) {
      const updated = content.posts.filter((_, i) => i !== index);
      setContent({ ...content, posts: updated });
      if (editingPostIndex === index) {
        setEditingPostIndex(null);
      }
      setStatusMessage({
        type: "success",
        text: `"${post.title}" yazısı silindi. Yayına almak için "Değişiklikleri Kaydet" butonuna basınız.`,
      });
    }
  };

  const handleMovePost = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= content.posts.length) return;
    const updated = [...content.posts];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setContent({ ...content, posts: updated });
  };

  const filteredPosts = (content.posts || []).filter((post) => {
    if (!blogSearchQuery.trim()) return true;
    const q = blogSearchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.slug.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const filteredMedia = mediaFiles.filter((item) => {
    if (!mediaSearchQuery.trim()) return true;
    return item.name.toLowerCase().includes(mediaSearchQuery.toLowerCase());
  });

  const filteredCatalog = catalogFiles.filter((item) => {
    if (!catalogSearchQuery.trim()) return true;
    return item.name.toLowerCase().includes(catalogSearchQuery.toLowerCase());
  });

  const filteredProducts = catalogProducts.filter((product) => {
    if (productCategoryFilter !== "all" && product.category !== productCategoryFilter) return false;
    if (!productSearchQuery.trim()) return true;
    const q = productSearchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(q) ||
      product.series.toLowerCase().includes(q) ||
      (product.modelCode && product.modelCode.toLowerCase().includes(q))
    );
  });

  const customProductCount = Object.keys(content.productImages || {}).length;

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <Image
                src="/sourced/brand/logo.png"
                alt="Proser Grup"
                width={130}
                height={32}
                className="h-7 w-auto"
              />
            </Link>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 hidden sm:inline">
              Site Yönetim Paneli
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <span>Siteyi Gör</span>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">İçerik, Medya & Katalog Yönetimi</h1>
            <p className="mt-1 text-sm text-slate-500">
              Telefon numaraları, blog yazıları, katalog görselleri ve Daikin ürün fotoğraflarını yönetin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              Varsayılana Sıfırla
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-600/20 hover:bg-sky-500 disabled:opacity-50 transition"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>

        {/* Status Message Alert */}
        {statusMessage && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm font-medium shadow-sm transition-all ${
              statusMessage.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { key: "contact", label: "📞 İletişim & Konum" },
            { key: "hero", label: "🏠 Ana Sayfa Metinleri" },
            { key: "announcement", label: "📢 Duyuru Bandı" },
            { key: "trust", label: "🛡️ Güven Unsurları" },
            { key: "blog", label: `📝 Blog Yönetimi (${content.posts?.length || 0})` },
            {
              key: "media",
              label: `📸 Fotoğraf & Katalog (${mediaFiles.length + (catalogFiles.length || 251)})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="mt-6 space-y-6">
          {/* TAB 1: İletişim & Konum */}
          {activeTab === "contact" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900">İletişim ve Konum Bilgileri</h2>
              <p className="text-xs text-slate-500">
                Sitenin üst barında, footer alanında ve iletişim butonlarında yer alan bilgiler.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Sabit Hat Telefonu</label>
                  <input
                    type="text"
                    value={content.contact.phoneLandline}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, phoneLandline: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Mobil / GSM Numarası</label>
                  <input
                    type="text"
                    value={content.contact.phoneMobile}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, phoneMobile: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">WhatsApp Numarası</label>
                  <input
                    type="text"
                    value={content.contact.whatsapp}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, whatsapp: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">E-posta Adresi</label>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, email: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">Çalışma Saatleri</label>
                  <input
                    type="text"
                    value={content.contact.hours}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, hours: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">Açık Adres</label>
                  <input
                    type="text"
                    value={content.contact.addressFull}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, addressFull: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Merkez / İlçe Başlığı</label>
                  <input
                    type="text"
                    value={content.contact.district}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, district: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Slogan / Alt Başlık</label>
                  <input
                    type="text"
                    value={content.contact.tagline}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, tagline: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Ana Sayfa Metinleri & Hero Görseli */}
          {activeTab === "hero" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Ana Sayfa (Hero) Karşılama Alanı</h2>
                <p className="text-xs text-slate-500">
                  Ana sayfaya ilk girildiğinde görünen başlık, sayaç ve arka plan fotoğrafı.
                </p>
              </div>

              {/* Hero Background Image Picker & Upload */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Hero Arka Plan Fotoğrafı
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ana sayfanın üst karşılama alanındaki büyük arka plan fotoğrafı.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      ref={heroFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => heroFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50 transition"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>{uploading ? "Yükleniyor..." : "Bilgisayardan Fotoğraf Yükle"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-xl border border-slate-300 bg-slate-900 shadow">
                    <Image
                      src={content.hero.image || "/sourced/hero/slide-1.jpg"}
                      alt="Hero Önizleme"
                      fill
                      className="object-cover opacity-80"
                      unoptimized
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
                      Aktif Görsel
                    </span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600">Görsel URL / Yolu</label>
                      <input
                        type="text"
                        value={content.hero.image || "/sourced/hero/slide-1.jpg"}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, image: e.target.value },
                          })
                        }
                        className="mt-0.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-slate-500">
                        Hazır Şablonlar:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {HERO_IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() =>
                              setContent({
                                ...content,
                                hero: { ...content.hero, image: preset.url },
                              })
                            }
                            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                              (content.hero.image || "/sourced/hero/slide-1.jpg") === preset.url
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Metinleri */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Üst Rozet Metni</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, badge: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Ana Başlık (H1)</label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, title: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Alt Açıklama Paragrafı</label>
                  <textarea
                    rows={3}
                    value={content.hero.description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, description: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="max-w-xs">
                  <label className="block text-xs font-semibold text-slate-700">Deneyim Yılı (Sayaç)</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={content.hero.experienceYears}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, experienceYears: Number(e.target.value) || 1 },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Duyuru Bandı */}
          {activeTab === "announcement" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Duyuru / Kampanya Bandı</h2>
                  <p className="text-xs text-slate-500">
                    Sitenin en üst kısmında ince bir şerit olarak gösterilir.
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={content.announcement.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, enabled: e.target.checked },
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                  <span className="ml-3 text-xs font-semibold text-slate-700">
                    {content.announcement.enabled ? "Yayında (Aktif)" : "Gizli (Pasif)"}
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Duyuru Metni</label>
                  <input
                    type="text"
                    value={content.announcement.text}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, text: e.target.value },
                      })
                    }
                    placeholder="Örn: Daikin Klimalarda Bahar Kampanyası Başladı!"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Buton Metni (Opsiyonel)</label>
                    <input
                      type="text"
                      value={content.announcement.linkText || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, linkText: e.target.value },
                        })
                      }
                      placeholder="Örn: Teklif Al"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Hedef Link (Opsiyonel)</label>
                    <input
                      type="text"
                      value={content.announcement.linkHref || ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, linkHref: e.target.value },
                        })
                      }
                      placeholder="Örn: /teklif-al"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Güven Unsurları */}
          {activeTab === "trust" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Güven Unsurları (Trust Points)</h2>
                <p className="text-xs text-slate-500">
                  Ana sayfada hero bölümünün hemen altındaki 4 maddelik garanti ve yetki kartları.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {content.trustPoints.map((item, index) => (
                  <div key={index} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
                    <span className="inline-block rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      Kart #{index + 1}
                    </span>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Kart Başlığı</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...content.trustPoints];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setContent({ ...content, trustPoints: updated });
                        }}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Kart Açıklaması</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...content.trustPoints];
                          updated[index] = { ...updated[index], description: e.target.value };
                          setContent({ ...content, trustPoints: updated });
                        }}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Blog Yönetimi */}
          {activeTab === "blog" && (
            <div className="space-y-6">
              {/* Top Controls */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Blog & Rehber Yazıları</h2>
                    <p className="text-xs text-slate-500">
                      Sitedeki tüm blog içeriklerini düzenleyin, yeni makale ekleyin veya silin.
                    </p>
                  </div>
                  {editingPostIndex === null && (
                    <button
                      type="button"
                      onClick={handleStartAddPost}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 transition"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Yeni Blog Yazısı Ekle</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Blog Post Editor (Inline Form) */}
              {editingPostIndex !== null && (
                <div className="rounded-2xl border-2 border-sky-500 bg-white p-6 shadow-lg space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-bold text-sm">
                        {editingPostIndex === -1 ? "+" : "✏️"}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {editingPostIndex === -1
                            ? "Yeni Blog Yazısı Oluştur"
                            : `Yazıyı Düzenle: ${postFormData.title || "İsimsiz Yazı"}`}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {editingPostIndex === -1
                            ? "Gerekli alanları doldurarak yeni blog yazısını listeye ekleyin."
                            : "Yazı detaylarını güncelleyip 'Yazıyı Güncelle' butonuna basın."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPostIndex(null)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                      title="Kapat"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {blogFormError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-800">
                      ⚠️ {blogFormError}
                    </div>
                  )}

                  <form onSubmit={handleSavePostForm} className="space-y-5">
                    {/* Başlık & Slug */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Yazı Başlığı <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={postFormData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Örn: Klima Seçerken Nelere Dikkat Etmeliyiz?"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-slate-700">
                            URL Adresi (Slug) <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleAutoSlug}
                            className="text-[11px] font-medium text-sky-600 hover:underline"
                          >
                            Başlıktan Otomatik Oluştur
                          </button>
                        </div>
                        <div className="mt-1 flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20">
                          <span className="flex items-center bg-slate-50 px-3 text-xs font-mono text-slate-500 border-r border-slate-200 select-none">
                            /blog/
                          </span>
                          <input
                            type="text"
                            value={postFormData.slug}
                            onChange={(e) => {
                              setPostFormData({ ...postFormData, slug: e.target.value });
                              setIsSlugManuallyEdited(true);
                            }}
                            placeholder="klima-secerken-nelere-dikkat-etmeliyiz"
                            className="w-full bg-white px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:outline-none"
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Yalnızca küçük harf, rakam ve tire kullanın (örn: klima-secim-rehberi).
                        </p>
                      </div>
                    </div>

                    {/* Özet */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        Kısa Özet (Excerpt) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={postFormData.excerpt}
                        onChange={(e) => setPostFormData({ ...postFormData, excerpt: e.target.value })}
                        placeholder="Blog listesinde ve arama motorlarında görünen 1-2 cümlelik tanıtım özeti."
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>

                    {/* Tarih, Okuma Süresi, Etiketler */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">
                          Yayın Tarihi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={postFormData.date}
                          onChange={(e) => setPostFormData({ ...postFormData, date: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700">
                          Okuma Süresi (Dakika) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={postFormData.readingMinutes}
                          onChange={(e) =>
                            setPostFormData({
                              ...postFormData,
                              readingMinutes: Number(e.target.value) || 1,
                            })
                          }
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700">
                          Etiketler (Virgülle Ayrılmış)
                        </label>
                        <input
                          type="text"
                          value={postFormData.tagsString}
                          onChange={(e) => setPostFormData({ ...postFormData, tagsString: e.target.value })}
                          placeholder="klima seçimi, BTU, enerji"
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>
                    </div>

                    {/* Kapak Görseli Seçimi, Yükleme & Önizleme */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700">
                              Kapak Görseli Yolu / URL
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                ref={blogFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleBlogFileUpload}
                                className="hidden"
                              />
                              <button
                                type="button"
                                disabled={uploading}
                                onClick={() => blogFileInputRef.current?.click()}
                                className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span>{uploading ? "Yükleniyor..." : "Bilgisayardan Fotoğraf Yükle"}</span>
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={postFormData.image}
                            onChange={(e) => setPostFormData({ ...postFormData, image: e.target.value })}
                            placeholder="/sourced/blog/klima-secimi.jpg veya /uploads/..."
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                          />
                        </div>
                        {postFormData.image && (
                          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                            <Image
                              src={postFormData.image}
                              alt="Önizleme"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>

                      {/* Hazır Katalog Şablonları */}
                      <div>
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Hazır Kapak Görselleri:
                        </span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {BLOG_IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() => setPostFormData({ ...postFormData, image: preset.url })}
                              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                                postFormData.image === preset.url
                                  ? "bg-sky-600 text-white shadow-sm"
                                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* İçerik (Paragraflar) */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-700">
                          Yazı İçeriği (Paragraflar) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-slate-400">
                            {
                              postFormData.contentString
                                .split(/\n\s*\n/)
                                .filter((p) => p.trim().length > 0).length
                            }{" "}
                            paragraf algılandı
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                          >
                            {showPreview ? "Önizlemeyi Gizle" : "Canlı Önizle"}
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={10}
                        value={postFormData.contentString}
                        onChange={(e) => setPostFormData({ ...postFormData, contentString: e.target.value })}
                        placeholder="İlk paragrafı yazın...&#10;&#10;İkinci paragraf için araya bir satır boşluk bırakın (Enter tuşuna iki kez basın)..."
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-sans text-sm leading-relaxed text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                      <p className="mt-1 text-[11px] text-slate-400">
                        💡 Her paragraf arasına boş bir satır (çift Enter) bırakın. Otomatik olarak ayrı paragraflar halinde yayınlanacaktır.
                      </p>
                    </div>

                    {/* Canlı Önizleme Kutusu */}
                    {showPreview && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                        <span className="inline-block rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800">
                          Canlı Sayfa Önizlemesi
                        </span>
                        <h2 className="text-xl font-bold text-slate-900">{postFormData.title || "Yazı Başlığı"}</h2>
                        <p className="text-xs text-slate-500">
                          {postFormData.date} · {postFormData.readingMinutes} dk okuma
                        </p>
                        <div className="space-y-3 text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-4">
                          {postFormData.contentString
                            .split(/\n\s*\n/)
                            .filter((p) => p.trim().length > 0)
                            .map((p, idx) => (
                              <p key={idx}>{p.trim()}</p>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Form Eylemleri */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingPostIndex(null)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-sky-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-sky-600/20 hover:bg-sky-500 transition"
                      >
                        {editingPostIndex === -1 ? "Yazıyı Listeye Ekle" : "Yazıyı Güncelle"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Arama & Filtreleme */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                  <input
                    type="text"
                    value={blogSearchQuery}
                    onChange={(e) => setBlogSearchQuery(e.target.value)}
                    placeholder="Başlık veya etikete göre ara..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pl-9 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Toplam {filteredPosts.length} blog yazısı listeleniyor
                </span>
              </div>

              {/* Blog Yazıları Listesi */}
              <div className="space-y-3">
                {filteredPosts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      {blogSearchQuery ? "Aramanıza uygun blog yazısı bulunamadı." : "Henüz blog yazısı eklenmemiş."}
                    </p>
                    <button
                      type="button"
                      onClick={handleStartAddPost}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:underline"
                    >
                      + İlk blog yazısını ekleyin
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post) => {
                    const originalIndex = content.posts.findIndex((p) => p.slug === post.slug);
                    return (
                      <div
                        key={post.slug}
                        className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          {/* Thumbnail */}
                          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                            {post.image ? (
                              <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                Görsel yok
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-semibold text-slate-500">
                                {post.date} · {post.readingMinutes} dk okuma
                              </span>
                              <span className="text-slate-300">•</span>
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-600 hover:underline"
                              >
                                <span>/blog/{post.slug}</span>
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </Link>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {post.title}
                            </h4>

                            <p className="text-xs text-slate-500 line-clamp-1">
                              {post.excerpt}
                            </p>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center border-t border-slate-100 pt-2 sm:border-t-0 sm:pt-0">
                          <button
                            type="button"
                            disabled={originalIndex <= 0}
                            onClick={() => handleMovePost(originalIndex, "up")}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 transition"
                            title="Yukarı Taşı"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            disabled={originalIndex >= content.posts.length - 1}
                            onClick={() => handleMovePost(originalIndex, "down")}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-20 transition"
                            title="Aşağı Taşı"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartEditPost(originalIndex)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Düzenle</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePost(originalIndex)}
                            className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Sil</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Fotoğraf, Katalog & Ürün Görselleri Yönetimi */}
          {activeTab === "media" && (
            <div className="space-y-6">
              {/* Media Sub-navigation Bar */}
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setMediaSubTab("uploads")}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    mediaSubTab === "uploads"
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  📁 Yüklenen Fotoğraflar ({mediaFiles.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaSubTab("catalog");
                    if (catalogFiles.length === 0) fetchCatalogFiles();
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    mediaSubTab === "catalog"
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  🏷️ Katalog Görselleri Arşivi ({catalogFiles.length || 251})
                </button>
                <button
                  type="button"
                  onClick={() => setMediaSubTab("products")}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    mediaSubTab === "products"
                      ? "bg-slate-900 text-white shadow"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  ❄️ Ürün Görseli Değiştirme ({catalogProducts.length} Ürün · {customProductCount} Özel Görsel)
                </button>
              </div>

              {/* SUB-TAB 1: Yüklenen Fotoğraflar */}
              {mediaSubTab === "uploads" && (
                <div className="space-y-6">
                  {/* Upload Zone */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Fotoğraf Yükleme & Özel Medyalar</h2>
                      <p className="text-xs text-slate-500">
                        Blog yazıları ve sayfalarda kullanmak üzere bilgisayarınızdan yeni fotoğraflar yükleyin.
                      </p>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center transition hover:border-sky-500 hover:bg-sky-50/30 cursor-pointer"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleMediaFilesUpload(e.target.files)}
                        className="hidden"
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200 group-hover:border-sky-300 transition">
                        <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-slate-900">
                        {uploading ? "Fotoğraflar Yükleniyor..." : "Fotoğraf Seçin veya Buraya Sürükleyin"}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG, WEBP, GIF veya SVG dosyaları (Maksimum 10MB)
                      </p>
                    </div>
                  </div>

                  {/* Media Search & Stats */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                      <input
                        type="text"
                        value={mediaSearchQuery}
                        onChange={(e) => setMediaSearchQuery(e.target.value)}
                        placeholder="Yüklenen dosyalarda ara..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pl-9 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                      <svg className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={fetchMediaFiles}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Yenile</span>
                      </button>
                      <span className="text-xs font-medium text-slate-500">
                        Toplam {filteredMedia.length} dosya yüklü
                      </span>
                    </div>
                  </div>

                  {/* Uploaded Photos Grid */}
                  {mediaLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
                      Fotoğraflar yükleniyor...
                    </div>
                  ) : filteredMedia.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        {mediaSearchQuery ? "Aramanıza uygun fotoğraf bulunamadı." : "Henüz fotoğraf yüklenmemiş."}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:underline"
                      >
                        + Bilgisayarınızdan ilk fotoğrafınızı yükleyin
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {filteredMedia.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                          <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
                            <Image
                              src={item.url}
                              alt={item.name}
                              fill
                              className="object-cover transition duration-300 group-hover:scale-105"
                              unoptimized
                            />
                          </div>

                          <div className="flex flex-1 flex-col justify-between p-3.5 space-y-2.5">
                            <div>
                              <p className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                                {item.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {formatBytes(item.size)} · {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                              </p>
                            </div>

                            <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => handleCopyLink(item.url)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                <span>{copiedUrl === item.url ? "Kopyalandı!" : "Linki Kopyala"}</span>
                              </button>

                              <div className="flex items-center gap-1">
                                <Link
                                  href={item.url}
                                  target="_blank"
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                                  title="Yeni Sekmede Aç"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMedia(item.name)}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                  title="Fotoğrafı Sil"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 2: Katalog Görselleri Arşivi */}
              {mediaSubTab === "catalog" && (
                <div className="space-y-6">
                  {/* Top Bar for Catalog */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Daikin Katalog Görselleri Arşivi</h2>
                        <p className="text-xs text-slate-500">
                          Sitede tanımlı tüm Daikin klimaların, dış ünitelerin ve kumandaların katalog görselleri.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          ref={catalogFileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleCatalogFilesUpload(e.target.files)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={() => catalogFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50 transition"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>{uploading ? "Yükleniyor..." : "Yeni Katalog Görseli Ekle"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Search and Counts */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                      <input
                        type="text"
                        value={catalogSearchQuery}
                        onChange={(e) => setCatalogSearchQuery(e.target.value)}
                        placeholder="Model veya seri adına göre ara (örn: emura, ftxa, perfera, vrv)..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pl-9 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                      <svg className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      Toplam {filteredCatalog.length} katalog görseli listeleniyor
                    </span>
                  </div>

                  {/* Catalog Images Grid */}
                  {catalogLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
                      Katalog arşivi yükleniyor...
                    </div>
                  ) : filteredCatalog.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        {catalogSearchQuery ? "Aramanıza uygun katalog görseli bulunamadı." : "Katalog görseli bulunamadı."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {filteredCatalog.map((item) => (
                        <div
                          key={item.name}
                          className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-[#121826] shadow-sm transition hover:shadow-md"
                        >
                          {/* Image Box */}
                          <div className="relative aspect-[4/3] w-full overflow-hidden p-2">
                            <Image
                              src={item.url}
                              alt={item.name}
                              fill
                              className="object-contain p-2 transition duration-300 group-hover:scale-105"
                              unoptimized
                            />
                          </div>

                          {/* Info Footer */}
                          <div className="flex flex-col justify-between border-t border-slate-800 bg-[#0e131f] p-2.5 space-y-1.5">
                            <p className="text-[11px] font-mono text-slate-200 truncate" title={item.name}>
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {formatBytes(item.size)}
                            </p>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                              <button
                                type="button"
                                onClick={() => handleCopyLink(item.url)}
                                className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 hover:underline"
                              >
                                {copiedUrl === item.url ? "✓ Kopyalandı" : "URL Kopyala"}
                              </button>

                              <div className="flex items-center gap-1">
                                <Link
                                  href={item.url}
                                  target="_blank"
                                  className="rounded p-1 text-slate-400 hover:text-white transition"
                                  title="Yeni Sekmede Aç"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCatalogFile(item.name)}
                                  className="rounded p-1 text-slate-500 hover:text-red-400 transition"
                                  title="Görseli Sil"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 3: Ürün Bazlı Görsel Değiştirme */}
              {mediaSubTab === "products" && (
                <div className="space-y-6">
                  {/* Top Bar */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Daikin Cihazlarının Fotoğraflarını Değiştirme</h2>
                      <p className="text-xs text-slate-500">
                        Sitedeki herhangi bir Daikin ürününün görselini doğrudan değiştirebilir, yeni görsel yükleyebilir veya varsayılana döndürebilirsiniz.
                      </p>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                      {[
                        { slug: "all", label: "Tüm Ürünler" },
                        { slug: "bireysel-klimalar", label: "Bireysel Klimalar" },
                        { slug: "multi-split", label: "Multi Split" },
                        { slug: "ticari-klimalar", label: "Ticari Klimalar" },
                        { slug: "vrv-sistemleri", label: "VRV Sistemleri" },
                        { slug: "isi-pompalari", label: "Isı Pompaları" },
                        { slug: "havalandirma", label: "Havalandırma" },
                      ].map((cat) => (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => setProductCategoryFilter(cat.slug)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            productCategoryFilter === cat.slug
                              ? "bg-slate-900 text-white shadow-sm"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search and Counts */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                      <input
                        type="text"
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        placeholder="Model kodu veya seri ara (örn: FTXA, Sensira, Perfera, VRV)..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pl-9 text-xs text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                      <svg className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {filteredProducts.length} ürün listeleniyor ({customProductCount} üründe özel görsel aktif)
                    </span>
                  </div>

                  {/* Products Grid */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => {
                      const hasOverride = Boolean(content.productImages?.[product.slug]);
                      const currentImage = content.productImages?.[product.slug] || product.defaultImage;

                      return (
                        <div
                          key={product.slug}
                          className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                            hasOverride ? "border-emerald-300 ring-1 ring-emerald-300/40" : "border-slate-200"
                          }`}
                        >
                          <div>
                            {/* Product Image Header */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#121826]">
                              <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                className="object-contain p-3"
                                unoptimized
                              />
                              {hasOverride && (
                                <span className="absolute top-2 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                                  ✓ Özel Görsel
                                </span>
                              )}
                            </div>

                            {/* Info */}
                            <div className="mt-3 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                                  {product.series}
                                </span>
                                {product.modelCode && (
                                  <span className="text-[11px] font-mono font-semibold text-slate-500">
                                    {product.modelCode}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 line-clamp-2" title={product.name}>
                                {product.name}
                              </h4>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                            <button
                              type="button"
                              onClick={() => setSelectedProductToEdit(product)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 shadow-sm transition"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span>Görseli Değiştir</span>
                            </button>

                            {hasOverride && (
                              <button
                                type="button"
                                onClick={() => handleResetProductImage(product.slug)}
                                className="text-[11px] font-semibold text-slate-500 hover:text-red-600 transition"
                              >
                                Sıfırla
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODAL: Ürün Görseli Seçici / Yükleyici */}
              {selectedProductToEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                          {selectedProductToEdit.series} · {selectedProductToEdit.modelCode}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">
                          Ürün Görselini Değiştir
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {selectedProductToEdit.name}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedProductToEdit(null)}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-5 space-y-5">
                      {/* 1. Bilgisayardan Yükle Butonu */}
                      <div className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-5 text-center">
                        <input
                          ref={productCustomFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProductDirectFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={() => productCustomFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-600/20 hover:bg-sky-500 disabled:opacity-50 transition"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>{uploading ? "Yükleniyor..." : "Bilgisayardan Yeni Fotoğraf Yükle & Ata"}</span>
                        </button>
                        <p className="mt-1.5 text-[11px] text-slate-500">
                          Yüklediğiniz fotoğraf anında bu ürüne atanır ve sitede yayına alınmaya hazır hale gelir.
                        </p>
                      </div>

                      {/* 2. Katalog veya Yüklenen Fotoğraflardan Seç */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">
                            Veya Katalog / Medya Arşivinden Bir Görsel Seçin:
                          </label>
                          <input
                            type="text"
                            value={pickerSearchQuery}
                            onChange={(e) => setPickerSearchQuery(e.target.value)}
                            placeholder="Görsel ara..."
                            className="w-48 rounded-lg border border-slate-200 px-2.5 py-1 text-xs focus:border-sky-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid max-h-64 grid-cols-3 gap-2.5 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
                          {catalogFiles
                            .filter((f) => !pickerSearchQuery || f.name.toLowerCase().includes(pickerSearchQuery.toLowerCase()))
                            .slice(0, 32)
                            .map((file) => (
                              <button
                                key={file.url}
                                type="button"
                                onClick={() => handleSetProductImage(selectedProductToEdit.slug, file.url)}
                                className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-[#121826] p-1.5 text-left transition hover:border-sky-500 hover:ring-2 hover:ring-sky-500/20"
                              >
                                <div className="relative aspect-[4/3] w-full">
                                  <Image
                                    src={file.url}
                                    alt={file.name}
                                    fill
                                    className="object-contain p-1"
                                    unoptimized
                                  />
                                </div>
                                <span className="mt-1 block text-[10px] text-slate-300 truncate font-mono">
                                  {file.name}
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Manuel URL Girişi */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">Veya Görsel URL / Yolu Girin:</label>
                        <div className="mt-1 flex gap-2">
                          <input
                            type="text"
                            defaultValue={content.productImages?.[selectedProductToEdit.slug] || selectedProductToEdit.defaultImage}
                            id="manualProductImageUrl"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-sky-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById("manualProductImageUrl") as HTMLInputElement;
                              if (input?.value) {
                                handleSetProductImage(selectedProductToEdit.slug, input.value.trim());
                              }
                            }}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                          >
                            Ata
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Save bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-600/25 hover:bg-sky-500 disabled:opacity-50 transition"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
