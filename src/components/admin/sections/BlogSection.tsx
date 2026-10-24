"use client";

import { useState } from "react";
import Image from "next/image";
import type { SiteContent } from "@/lib/site-content-types";
import type { BlogPost } from "@/lib/types";
import { ImagePickerInput } from "../ImagePickerInput";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

type PostDraft = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingMinutes: number;
  tagsString: string;
  image: string;
  content: string;
};

export function BlogSection({ content, onChange }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<PostDraft | null>(null);
  const [search, setSearch] = useState("");

  const posts = content.posts || [];

  const handleStartAdd = () => {
    const today = new Date().toISOString().split("T")[0];
    setDraft({
      slug: "",
      title: "",
      excerpt: "",
      date: today,
      readingMinutes: 5,
      tagsString: "Daikin, Klima, Enerji Verimliliği",
      image: "/sourced/blog/klima-secimi.jpg",
      content: "",
    });
    setEditingIndex(-1);
  };

  const handleStartEdit = (idx: number) => {
    const p = posts[idx];
    if (!p) return;
    setDraft({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      readingMinutes: p.readingMinutes,
      tagsString: (p.tags || []).join(", "),
      image: p.image || "/sourced/blog/klima-secimi.jpg",
      content: Array.isArray(p.content) ? p.content.join("\n\n") : ((p as unknown as { content: string }).content || ""),
    });
    setEditingIndex(idx);
  };

  const handleSavePost = () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.slug.trim()) {
      alert("Lütfen başlık ve slug alanlarını doldurun.");
      return;
    }

    const tags = draft.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const contentParagraphs = draft.content
      .split("\n\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const postData: BlogPost = {
      slug: draft.slug.trim(),
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      date: draft.date,
      readingMinutes: Number(draft.readingMinutes) || 5,
      tags,
      image: draft.image || "/sourced/blog/klima-secimi.jpg",
      content: contentParagraphs.length > 0 ? contentParagraphs : [draft.excerpt.trim()],
    };

    if (editingIndex === -1) {
      // Check duplicate slug
      if (posts.some((p) => p.slug === postData.slug)) {
        alert("Bu slug ile bir yazı zaten var!");
        return;
      }
      onChange({
        ...content,
        posts: [postData, ...posts],
      });
    } else if (editingIndex !== null) {
      const nextPosts = [...posts];
      nextPosts[editingIndex] = postData;
      onChange({
        ...content,
        posts: nextPosts,
      });
    }

    setEditingIndex(null);
    setDraft(null);
  };

  const handleDeletePost = (idx: number) => {
    if (!confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    onChange({
      ...content,
      posts: posts.filter((_, i) => i !== idx),
    });
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>✍️</span> Blog & Rehber Yazıları Yönetimi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            İklimlendirme tavsiyeleri, teknik makaleler ve müşteri rehberlerini oluşturun ve güncelleyin.
          </p>
        </div>
        {editingIndex === null && (
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            + Yeni Blog Yazısı Ekle
          </button>
        )}
      </div>

      {/* Editor Modal / Inline form */}
      {draft && (
        <div className="rounded-2xl border-2 border-blue-500 bg-white p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">
              {editingIndex === -1 ? "Yeni Blog Yazısı" : "Yazıyı Düzenle"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingIndex(null);
                setDraft(null);
              }}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕ Kapat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Yazı Başlığı
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const autoSlug = title
                    .toLowerCase()
                    .replace(/ğ/g, "g")
                    .replace(/ü/g, "u")
                    .replace(/ş/g, "s")
                    .replace(/ı/g, "i")
                    .replace(/ö/g, "o")
                    .replace(/ç/g, "c")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
                  setDraft({
                    ...draft,
                    title,
                    slug: editingIndex === -1 ? autoSlug : draft.slug,
                  });
                }}
                placeholder="Örn: Ev İçin En Doğru Daikin Klima Nasıl Seçilir?"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                URL Slug (/blog/[slug])
              </label>
              <input
                type="text"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder="klima-nasil-secilir"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Yayın Tarihi
              </label>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Okuma Süresi (Dk)
              </label>
              <input
                type="number"
                value={draft.readingMinutes}
                onChange={(e) => setDraft({ ...draft, readingMinutes: Number(e.target.value) || 5 })}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Etiketler (Virgülle ayırın)
              </label>
              <input
                type="text"
                value={draft.tagsString}
                onChange={(e) => setDraft({ ...draft, tagsString: e.target.value })}
                placeholder="Daikin, Klima, Tasarruf"
                className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <ImagePickerInput
            label="Kapak Görseli"
            value={draft.image}
            onChange={(url) => setDraft({ ...draft, image: url })}
            placeholder="Yazı kapak görseli seçin veya yükleyin"
            description="Önerilen: 800x450"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Kısa Özet (Excerpt)
            </label>
            <textarea
              rows={2}
              value={draft.excerpt}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              placeholder="Yazı kartlarında ve arama motorlarında görünen özet cümle..."
              className="w-full rounded-xl border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Yazı İçeriği (Markdown / Paragraflar)
            </label>
            <textarea
              rows={12}
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              placeholder="Yazınızı buraya yazın. ## Alt Başlıklar ve standart paragraflar kullanabilirsiniz..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setEditingIndex(null);
                setDraft(null);
              }}
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleSavePost}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-md"
            >
              Yazıyı Listeye Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Posts Search and List */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Blog başlığı ara..."
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
        />
        <span className="text-xs text-slate-500 font-medium">
          Toplam {filtered.length} blog yazısı
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((post) => (
          <div
            key={post.slug}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              {post.image && (
                <div className="relative aspect-[16/9] bg-slate-100">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{post.date}</span>
                  <span>{post.readingMinutes} dk</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{post.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const origIdx = posts.findIndex((p) => p.slug === post.slug);
                  if (origIdx !== -1) handleStartEdit(origIdx);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                ✏️ Düzenle
              </button>
              <button
                type="button"
                onClick={() => {
                  const origIdx = posts.findIndex((p) => p.slug === post.slug);
                  if (origIdx !== -1) handleDeletePost(origIdx);
                }}
                className="text-xs text-red-500 hover:text-red-700"
              >
                🗑️ Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
