import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("section-pad", className)}>
      <div className="container-pro">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-10 max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <span className="eyebrow mb-4">{eyebrow}</span> : null}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--navy)] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-[var(--slate)] md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
