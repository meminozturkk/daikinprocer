import { JsonLd } from "@/components/seo/JsonLd";

export function PageHero({
  title,
  description,
  breadcrumbs,
  jsonLd,
}: {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  jsonLd?: object | object[];
}) {
  return (
    <div className="gradient-hero border-b border-slate-100">
      <div className="container-pro py-12 md:py-16">
        {/* breadcrumbs imported lazily to avoid circular - use inline */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--slate)]">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                  {item.href && !isLast ? (
                    <a href={item.href} className="hover:text-[var(--daikin-blue)]">
                      {item.label}
                    </a>
                  ) : (
                    <span className={isLast ? "font-medium text-[var(--navy)]" : undefined}>
                      {item.label}
                    </span>
                  )}
                  {!isLast ? <span aria-hidden>/</span> : null}
                </li>
              );
            })}
          </ol>
        </nav>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[var(--navy)] md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--slate)] md:text-lg">
          {description}
        </p>
        {jsonLd ? <JsonLd data={jsonLd} /> : null}
      </div>
    </div>
  );
}
