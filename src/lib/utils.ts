import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.prosergrup.com";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
