"use client";

import { useEffect, useState } from "react";
import type { LeadItem, LeadStatus } from "@/lib/leads";

export function LeadsSection() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.ok && Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else {
        setError(data.message || "Talepler yüklenemedi");
      }
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.ok && Array.isArray(data.leads)) {
          setLeads(data.leads);
        } else {
          setError(data.message || "Talepler yüklenemedi");
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setError("Bağlantı hatası");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
      } else {
        alert(data.message || "Durum güncellenemedi");
      }
    } catch {
      alert("Bağlantı hatası");
    }
  };

  const handleSaveNote = async (id: string) => {
    try {
      setSavingNote(true);
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, adminNote: noteDraft }),
      });
      const data = await res.json();
      if (data.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, adminNote: noteDraft } : l))
        );
        setEditingNoteId(null);
      } else {
        alert(data.message || "Not kaydedilemedi");
      }
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu talebi kalıcı olarak silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert(data.message || "Silme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    }
  };

  const filtered = leads.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.productInterest && item.productInterest.toLowerCase().includes(q)) ||
        (item.issue && item.issue.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q)) ||
        (item.adminNote && item.adminNote.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const countTotal = leads.length;
  const countNew = leads.filter((l) => l.status === "yeni").length;
  const countCalled = leads.filter((l) => l.status === "arandi").length;
  const countDone = leads.filter((l) => l.status === "tamamlandi").length;

  return (
    <div className="space-y-6">
      {/* Header and Counters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📬</span> Gelen Talepler (Leads & WhatsApp)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Web sitesi teklif ve servis formlarından gelen talepler diske kaydedilir ve burada listelenir.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition"
        >
          <span>🔄</span> {loading ? "Yenileniyor..." : "Yenile"}
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Talep</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{countTotal}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Bekleyen / Yeni</p>
          <p className="text-2xl font-black text-amber-900 mt-1">{countNew}</p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 shadow-sm">
          <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">Arandı / İletişimde</p>
          <p className="text-2xl font-black text-sky-900 mt-1">{countCalled}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Tamamlandı</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{countDone}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Talep Türleri</option>
            <option value="teklif">Teklif Talepleri</option>
            <option value="servis">Servis Talepleri</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="yeni">Yeni / Bekliyor</option>
            <option value="arandi">Arandı</option>
            <option value="tamamlandi">Tamamlandı</option>
          </select>
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İsim, telefon, mesaj ara..."
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

      {/* Leads List */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <div className="animate-spin text-3xl mb-3">⏳</div>
          <p className="text-sm font-medium">Talepler yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchLeads}
            className="mt-3 inline-flex rounded-xl bg-red-600 text-white px-4 py-1.5 text-xs font-bold hover:bg-red-700 transition"
          >
            Yeniden Dene
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-base font-semibold text-slate-700">Henüz eşleşen bir talep bulunamadı</p>
          <p className="text-xs text-slate-400 mt-1">
            Müşteriler web sitenizdeki formları doldurduğunda anında burada görünecektir.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => {
            const cleanPhone = lead.phone.replace(/\D/g, "");
            const waTarget = cleanPhone.startsWith("0")
              ? "90" + cleanPhone.slice(1)
              : cleanPhone.startsWith("90")
              ? cleanPhone
              : "90" + cleanPhone;

            const dateStr = new Date(lead.createdAt).toLocaleString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={lead.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                  lead.status === "yeni"
                    ? "border-amber-300 ring-1 ring-amber-200"
                    : lead.status === "arandi"
                    ? "border-sky-200"
                    : "border-slate-200 opacity-90"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Badges & Customer Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          lead.type === "teklif"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-purple-100 text-purple-800 border border-purple-200"
                        }`}
                      >
                        {lead.type === "teklif" ? "❄️ TEKLİF TALEBİ" : "🛠️ SERVİS TALEBİ"}
                      </span>

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          lead.status === "yeni"
                            ? "bg-amber-100 text-amber-800"
                            : lead.status === "arandi"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {lead.status === "yeni"
                          ? "⏳ Yeni / Bekliyor"
                          : lead.status === "arandi"
                          ? "📞 Arandı"
                          : "✅ Tamamlandı"}
                      </span>

                      <span className="text-xs text-slate-400">🕒 {dateStr}</span>
                      <span className="text-xs text-slate-400 font-mono">#{lead.id.slice(-6)}</span>
                    </div>

                    <div className="pt-1">
                      <h3 className="text-lg font-bold text-slate-900">{lead.name}</h3>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">📞 {lead.phone}</span>
                        {lead.email && <span>✉️ {lead.email}</span>}
                        {lead.city && <span>📍 {lead.city}</span>}
                      </div>
                    </div>

                    {lead.address && (
                      <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-100">
                        🏠 <strong>Adres:</strong> {lead.address}
                      </p>
                    )}

                    {lead.productInterest && (
                      <p className="text-sm text-slate-700">
                        <strong>İlgilenilen Ürün/Sistem:</strong>{" "}
                        <span className="text-blue-700 font-medium">{lead.productInterest}</span>
                      </p>
                    )}

                    {lead.deviceType && (
                      <p className="text-sm text-slate-700">
                        <strong>Cihaz Tipi:</strong> {lead.deviceType}
                        {lead.preferredTime ? ` · Zaman: ${lead.preferredTime}` : ""}
                      </p>
                    )}

                    {lead.issue && (
                      <div className="rounded-xl bg-amber-50/80 p-3 text-xs text-amber-900 border border-amber-200">
                        <strong>Arıza / Talep Detayı:</strong> {lead.issue}
                      </div>
                    )}

                    {lead.message && (
                      <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100">
                        <strong>Mesaj:</strong> {lead.message}
                      </div>
                    )}

                    {/* Admin Note Section */}
                    <div className="pt-2">
                      {editingNoteId === lead.id ? (
                        <div className="space-y-2 mt-2">
                          <textarea
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Müşteriyle görüşme notu ekleyin..."
                            rows={2}
                            className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveNote(lead.id)}
                              disabled={savingNote}
                              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              {savingNote ? "Kaydediliyor..." : "Kaydet"}
                            </button>
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
                            >
                              İptal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          {lead.adminNote ? (
                            <span className="italic bg-yellow-50 text-yellow-900 px-2 py-1 rounded border border-yellow-200">
                              📝 Not: {lead.adminNote}
                            </span>
                          ) : null}
                          <button
                            onClick={() => {
                              setEditingNoteId(lead.id);
                              setNoteDraft(lead.adminNote || "");
                            }}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {lead.adminNote ? "Notu Düzenle" : "+ Görüşme Notu Ekle"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions & Status Management */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-slate-500">Durum:</label>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="yeni">Yeni</option>
                        <option value="arandi">Arandı</option>
                        <option value="tamamlandi">Tamamlandı</option>
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                          `Merhaba ${lead.name}, Daikin Proser Grup'tan iletişime geçiyorum. ${
                            lead.type === "teklif" ? "Teklif" : "Servis"
                          } talebiniz ile ilgili görüşebilir miyiz?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#1EBE5D] transition"
                      >
                        <span>💬 WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-slate-900 transition"
                      >
                        <span>📞 Ara</span>
                      </a>

                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition"
                        title="Talebi Sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
