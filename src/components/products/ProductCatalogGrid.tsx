"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
  seriesList: string[];
};

export function ProductCatalogGrid({ products, seriesList }: Props) {
  const [series, setSeries] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return products.filter((p) => {
      if (series !== "all" && p.series !== series) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.series} ${p.modelCode ?? ""} ${p.subcategory ?? ""}`.toLocaleLowerCase(
        "tr",
      );
      return hay.includes(q);
    });
  }, [products, series, query]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="block w-full max-w-md text-sm text-[var(--slate)]">
          <span className="sr-only">Ürün ara</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Model veya seri ara…"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[var(--navy)] outline-none focus:border-[var(--daikin-blue)]"
          />
        </label>
        <p className="text-sm text-[var(--slate)]">
          {filtered.length} / {products.length} ürün
        </p>
      </div>

      {seriesList.length > 1 ? (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSeries("all")}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              series === "all"
                ? "bg-[var(--navy)] text-white"
                : "bg-[var(--ice)] text-[var(--slate)] hover:text-[var(--navy)]"
            }`}
          >
            Tümü
          </button>
          {seriesList.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeries(s)}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                series === s
                  ? "bg-[var(--navy)] text-white"
                  : "bg-[var(--ice)] text-[var(--slate)] hover:text-[var(--navy)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-[var(--slate)]">
          Bu filtreye uygun ürün bulunamadı.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((product) => (
            <Link
              key={product.slug}
              href={`/urunler/${product.category}/${product.slug}`}
              className="card-surface flex gap-4 overflow-hidden p-0"
            >
              <div className="relative h-28 w-36 shrink-0 bg-[var(--ice)] sm:h-32 sm:w-44">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  sizes="176px"
                />
              </div>
              <div className="p-4 pr-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--daikin-blue)]">
                  {product.series}
                  {product.modelCode ? ` · ${product.modelCode}` : ""}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--navy)]">{product.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--slate)]">{product.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
