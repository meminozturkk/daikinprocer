"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";

export type BackupItem = {
  filename: string;
  name?: string;
  title: string;
  note?: string;
  type: "manual" | "auto";
  createdAt: string;
  date?: string;
  sizeBytes: number;
  size?: number;
};

type Props = {
  onRestored: (newContent: SiteContent) => void;
};

const PRESET_TITLES = [
  "📌 Fiyat Güncellemesi Öncesi",
  "🚀 Kampanya Lansmanı Öncesi",
  "✍️ Blog & İçerik Revizyonu",
  "❄️ Ürün Kataloğu Değişikliği",
  "🏢 İletişim / Bayi Bilgisi Düzenlemesi",
  "🛡️ Periyodik Güvenlik Yedeği",
];

export function BackupsSection({ onRestored }: Props) {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // New Backup Modal / Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");

  // Filters & Search
  const [filterType, setFilterType] = useState<"all" | "manual" | "auto">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Feedback message
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Confirmation modals
  const [confirmRestore, setConfirmRestore] = useState<BackupItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BackupItem | null>(null);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/backups");
      const data = await res.json();
      if (data.ok && Array.isArray(data.backups)) {
        setBackups(data.backups);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/backups")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.ok && Array.isArray(data.backups)) {
          setBackups(data.backups);
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setMessage({ type: "error", text: "Lütfen yedek için açıklayıcı bir ad veya başlık girin." });
      return;
    }

    try {
      setCreating(true);
      setMessage(null);
      const res = await fetch("/api/admin/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          title: newTitle.trim(),
          note: newNote.trim(),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        if (Array.isArray(data.backups)) {
          setBackups(data.backups);
        } else {
          await fetchBackups();
        }
        setMessage({
          type: "success",
          text: `"${newTitle.trim()}" başlıklı yedek başarıyla oluşturuldu!`,
        });
        setNewTitle("");
        setNewNote("");
        setShowCreateModal(false);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Yedek oluşturulamadı.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası oluştu." });
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (backup: BackupItem) => {
    try {
      setRestoring(backup.filename);
      setMessage(null);
      const res = await fetch("/api/admin/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", filename: backup.filename }),
      });
      const data = await res.json();
      if (data.ok && data.content) {
        onRestored(data.content);
        if (Array.isArray(data.backups)) {
          setBackups(data.backups);
        } else {
          await fetchBackups();
        }
        setMessage({
          type: "success",
          text: `"${backup.title}" yedeği başarıyla geri yüklendi ve siteye uygulandı! (Önceki durum otomatik olarak yedeklendi)`,
        });
        setConfirmRestore(null);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Geri yükleme başarısız oldu.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası oluştu." });
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (backup: BackupItem) => {
    try {
      setDeleting(backup.filename);
      setMessage(null);
      const res = await fetch(`/api/admin/backups?filename=${encodeURIComponent(backup.filename)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        if (Array.isArray(data.backups)) {
          setBackups(data.backups);
        } else {
          await fetchBackups();
        }
        setMessage({
          type: "success",
          text: `"${backup.title}" yedeği silindi.`,
        });
        setConfirmDelete(null);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Yedek silinemedi.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası oluştu." });
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (filename: string) => {
    window.open(`/api/admin/backups?filename=${encodeURIComponent(filename)}&download=true`, "_blank");
  };

  // Filtered backups list
  const filteredBackups = useMemo(() => {
    return backups.filter((b) => {
      // Type filter
      if (filterType === "manual" && b.type !== "manual") return false;
      if (filterType === "auto" && b.type !== "auto") return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = b.title?.toLowerCase().includes(q);
        const noteMatch = b.note?.toLowerCase().includes(q);
        const fileMatch = b.filename?.toLowerCase().includes(q);
        if (!titleMatch && !noteMatch && !fileMatch) return false;
      }

      return true;
    });
  }, [backups, filterType, searchQuery]);

  const manualCount = backups.filter((b) => b.type === "manual").length;
  const autoCount = backups.filter((b) => b.type === "auto").length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide border border-blue-400/20">
              <span>🛡️</span> Daikin Procer Sürüm Kontrol Sistemi
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Yedekleme ve Sürüm Geçmişi
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Önemli bir değişiklik yapmadan önce dilediğiniz isim ve notla manuel yedek oluşturabilir,
              otomatik kayıtları inceleyebilir ve tek tıkla eski bir sürüme güvenle geri dönebilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setNewTitle("");
                setNewNote("");
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white px-5 py-3 text-sm font-bold shadow-lg shadow-blue-500/25 transition transform active:scale-95"
            >
              <span className="text-base">➕</span> Yeni Yedek Oluştur
            </button>
            <button
              type="button"
              onClick={fetchBackups}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white px-4 py-3 text-sm font-semibold backdrop-blur transition disabled:opacity-50"
            >
              <span>🔄</span> {loading ? "Yenileniyor..." : "Yenile"}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center justify-between transition-all shadow-sm ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span>{message.type === "success" ? "✅" : "⚠️"}</span>
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Manual Backup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💾</span>
                <div>
                  <h3 className="font-bold text-lg">Yeni Manuel Yedek Oluştur</h3>
                  <p className="text-xs text-blue-100">Mevcut site içeriğini adlandırarak arşivleyin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBackup} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Yedek Adı / Başlığı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="örn: Daikin Shira Plus Fiyat Güncellemesi Öncesi"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Quick suggestion tags */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Hızlı Başlık Önerileri:</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TITLES.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewTitle(preset.replace(/^[^\s]+\s*/, ""))}
                      className="px-2.5 py-1 text-xs rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-medium transition border border-slate-200/60"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Açıklama / Not <span className="text-slate-400 text-xs font-normal">(İsteğe Bağlı)</span>
                </label>
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Bu yedeği neden aldığınızı belirten bir not yazabilirsiniz (örn: VRV sistem sayfaları ve broşür linkleri güncellenmeden önceki durum)."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition disabled:opacity-50"
                >
                  {creating ? "Yedek Alınıyor..." : "💾 Yedeği Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Restore */}
      {confirmRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto">
              ↺
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg text-slate-900">Bu Yedeğe Geri Dönülsün mü?</h3>
              <p className="text-xs text-slate-500">
                Sitenin şu anki yayındaki tüm içerikleri aşağıdaki yedekle değiştirilecektir:
              </p>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
                <p className="font-bold text-slate-800 text-sm">{confirmRestore.title}</p>
                {confirmRestore.note && <p className="text-slate-500">{confirmRestore.note}</p>}
                <p className="text-slate-400 font-mono text-[11px] pt-1">{confirmRestore.filename}</p>
              </div>
              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-100 font-medium">
                🛡️ Güvenlik Notu: Geri yüklemeden önce mevcut durumunuz otomatik olarak yedeklenecektir.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmRestore(null)}
                disabled={Boolean(restoring)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => handleRestore(confirmRestore)}
                disabled={Boolean(restoring)}
                className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition disabled:opacity-50"
              >
                {restoring === confirmRestore.filename ? "Yükleniyor..." : "Evet, Geri Yükle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-2xl mx-auto">
              🗑️
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-bold text-lg text-slate-900">Bu Yedeği Silmek İstiyor musunuz?</h3>
              <p className="text-xs text-slate-500">
                Bu işlem geri alınamaz. Arşivlenen bu yedek dosyası sunucudan kalıcı olarak kaldırılacaktır:
              </p>
              <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-200 text-left text-xs space-y-1">
                <p className="font-bold text-slate-800 text-sm">{confirmDelete.title}</p>
                <p className="text-slate-400 font-mono text-[11px]">{confirmDelete.filename}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={Boolean(deleting)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDelete)}
                disabled={Boolean(deleting)}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition disabled:opacity-50"
              >
                {deleting === confirmDelete.filename ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              filterType === "all"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tüm Yedekler ({backups.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("manual")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              filterType === "manual"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏷️ Manuel Yedekler ({manualCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("auto")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              filterType === "auto"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚙️ Otomatik Kayıtlar ({autoCount})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Yedek adı, notu veya dosya ara..."
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Backups List / Table */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-slate-500 shadow-sm">
          <div className="animate-spin text-4xl mb-3">⏳</div>
          <p className="text-sm font-semibold text-slate-700">Yedekler taranıyor ve listeleniyor...</p>
        </div>
      ) : filteredBackups.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-slate-500 shadow-sm">
          <p className="text-4xl mb-3">📂</p>
          <p className="text-base font-bold text-slate-800">
            {searchQuery ? "Arama kriterlerine uygun yedek bulunamadı" : "Henüz bu kategoride yedek bulunmuyor"}
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {searchQuery
              ? "Arama filtrenizi temizleyerek tüm yedekleri görebilirsiniz."
              : "Yukarıdaki '➕ Yeni Yedek Oluştur' butonuna basarak ilk manuel yedeğinizi hemen alabilirsiniz."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Aramayı Temizle
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Yedek Adı ve Açıklama</th>
                  <th className="px-5 py-4">Tür</th>
                  <th className="px-5 py-4">Tarih & Saat</th>
                  <th className="px-5 py-4">Boyut</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBackups.map((b) => {
                  const dateObj = new Date(b.createdAt);
                  const isValidDate = !isNaN(dateObj.getTime());
                  const formattedDate = isValidDate
                    ? dateObj.toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : b.createdAt || "-";

                  const kb = ((b.sizeBytes || b.size || 0) / 1024).toFixed(1);
                  const isManual = b.type === "manual";

                  return (
                    <tr key={b.filename} className="hover:bg-slate-50/70 transition group">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{isManual ? "🏷️" : "⚙️"}</span>
                            <span className="font-bold text-slate-900 text-sm">
                              {b.title || b.filename}
                            </span>
                          </div>
                          {b.note && (
                            <p className="text-xs text-slate-500 pl-6 leading-relaxed line-clamp-2">
                              {b.note}
                            </p>
                          )}
                          <div className="pl-6 pt-0.5">
                            <span className="inline-block font-mono text-[11px] text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md">
                              {b.filename}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {isManual ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            <span>🏷️</span> Manuel
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                            <span>⚙️</span> Otomatik
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600 font-medium whitespace-nowrap">
                        {formattedDate}
                      </td>

                      <td className="px-5 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {kb} KB
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Restore */}
                          <button
                            type="button"
                            onClick={() => setConfirmRestore(b)}
                            disabled={restoring === b.filename}
                            title="Bu yedeği geri yükle"
                            className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
                          >
                            <span>↺</span> Geri Dön
                          </button>

                          {/* Download JSON */}
                          <button
                            type="button"
                            onClick={() => handleDownload(b.filename)}
                            title="Yedeği JSON olarak bilgisayara indir"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-xs font-semibold"
                          >
                            📥
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(b)}
                            disabled={deleting === b.filename}
                            title="Yedeği sil"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition text-xs font-semibold disabled:opacity-50"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
