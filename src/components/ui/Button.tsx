import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  external?: boolean;
};

const variants = {
  primary:
    "bg-[var(--daikin-blue)] text-white hover:bg-[var(--daikin-blue-dark)] shadow-lg shadow-sky-200/60",
  secondary:
    "bg-[var(--navy)] text-white hover:bg-[var(--navy-soft)]",
  ghost:
    "bg-white text-[var(--navy)] border border-slate-200 hover:border-[var(--daikin-blue)]",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe57]",
};

const sizes = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  onClick,
  external,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-ring",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
