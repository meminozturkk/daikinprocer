"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content-types";

type Props = {
  content: SiteContent;
  onChange: (newContent: SiteContent) => void;
};

export function FaqSection({ content, onChange }: Props) {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const faqs = content.faqs || [];

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      alert("Lütfen soru ve cevabı doldurun.");
      return;
    }
    onChange({
      ...content,
      faqs: [...faqs, { question: newQuestion.trim(), answer: newAnswer.trim() }],
    });
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleUpdateFaq = (index: number, key: "question" | "answer", val: string) => {
    const list = [...faqs];
    list[index] = { ...list[index], [key]: val };
    onChange({ ...content, faqs: list });
  };

  const handleRemoveFaq = (index: number) => {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    onChange({
      ...content,
      faqs: faqs.filter((_, i) => i !== index),
    });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    const list = [...faqs];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    onChange({ ...content, faqs: list });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>❓</span> Sıkça Sorulan Sorular (FAQ) Yönetimi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ana sayfadaki ve Schema.org JSON-LD arama motoru sonuçlarında çıkan soru-cevapları yönetin.
        </p>
      </div>

      {/* Add New FAQ Form */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-blue-900">+ Yeni Soru & Cevap Ekle</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Soru metni (Örn: Daikin klimaların garanti süresi kaç yıldır?)"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <textarea
            rows={3}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Cevap metni (Örn: Daikin cihazları resmi 3 yıl distribütör garantisi altındadır...)"
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAddFaq}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
        >
          Soruyu Listeye Ekle
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Mevcut Sorular ({faqs.length})
        </p>

        {faqs.map((faq, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Yukarı Taşı"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === faqs.length - 1}
                  className="p-1 text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Aşağı Taşı"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="p-1 text-xs text-red-500 hover:text-red-700 font-bold ml-2"
                  title="Sil"
                >
                  🗑️
                </button>
              </div>
            </div>

            <input
              type="text"
              value={faq.question}
              onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              rows={3}
              value={faq.answer}
              onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
