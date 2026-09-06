"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  suffix = "",
  label,
  light = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  light?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="text-center">
      <motion.p
        className={
          light
            ? "text-3xl font-bold text-white md:text-4xl"
            : "text-3xl font-bold text-[var(--daikin-blue)] md:text-4xl"
        }
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        {value}
        {suffix}
      </motion.p>
      <p className={light ? "mt-1 text-sm text-sky-100" : "mt-1 text-sm text-[var(--slate)]"}>
        {label}
      </p>
    </div>
  );
}

export function AirflowBackdrop({ className }: { className?: string }) {
  return <div aria-hidden className={cn("airflow pointer-events-none absolute inset-0", className)} />;
}
