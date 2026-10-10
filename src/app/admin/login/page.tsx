"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Giriş başarısız");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Giriş yapılırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-slate-800/90 p-8 shadow-2xl border border-slate-700/80 backdrop-blur-xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-white p-3 shadow-md">
            <Image
              src="/sourced/brand/logo.png"
              alt="Proser Grup"
              width={160}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">Yönetim Paneli</h1>
          <p className="mt-2 text-sm text-slate-400">
            Site metinlerini ve iletişim bilgilerini güncellemek için şifrenizi girin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Yönetici Şifresi
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white placeholder-slate-500 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:opacity-50 transition"
          >
            {loading ? "Giriş yapılıyor..." : "Panele Giriş Yap"}
          </button>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
              &larr; Ana Sayfaya Dön
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
