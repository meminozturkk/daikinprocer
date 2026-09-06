"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
  seriesList: string[];
};

export function ProductCatalogGrid({ products, seriesList }: Props) {
  const [series, setSeries] = useState<string>("all");
  const [query, setQuery] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return products.filter((p) => {
      if (series !== "all" && p.series !== series) return false;
      if (!q) return true;
      const hay =
        `${p.name} ${p.series} ${p.modelCode ?? ""} ${p.subcategory ?? ""}`.toLocaleLowerCase(
          "tr",
        );
      return hay.includes(q);
    });
  }, [products, series, query]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [seriesList]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="block w-full text-sm text-[var(--slate)] sm:max-w-md">
            <span className="sr-only">Ürün ara</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Model veya seri ara…"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[var(--navy)] outline-none focus:border-[var(--daikin-blue)]"
            />
          </label>
          <p className="shrink-0 text-sm font-medium text-[var(--navy)]">
            {filtered.length} / {products.length} ürün
          </p>
        </div>
      </div>

      {seriesList.length > 1 ? (
        <div className="relative mb-8">
          <div
            ref={scrollerRef}
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              onClick={() => setSeries("all")}
              className={`min-h-9 shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
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
                className={`min-h-9 shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
                  series === s
                    ? "bg-[var(--navy)] text-white"
                    : "bg-[var(--ice)] text-[var(--slate)] hover:text-[var(--navy)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {canScrollLeft ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
          ) : null}
          {canScrollRight ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
          ) : null}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-[var(--slate)]">
          Bu filtreye uygun ürün bulunamadı.
        </p>
      ) : (
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {filtered.map((product) => (
            <Link
              key={product.slug}
              href={`/urunler/${product.category}/${product.slug}`}
              className="card-surface flex gap-0 overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-28 w-28 shrink-0 bg-[#121826] sm:h-36 sm:w-40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2.5 sm:p-3"
                  sizes="160px"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center p-3.5 pr-4 sm:p-4 sm:pr-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--daikin-blue)] sm:text-xs">
                  {product.series}
                  {product.modelCode ? ` · ${product.modelCode}` : ""}
                </p>
                <h2 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--navy)] sm:text-lg">
                  {product.name}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-sm text-[var(--slate)]">{product.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
