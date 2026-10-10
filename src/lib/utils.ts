import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.prosergrup.com";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getWhatsAppUrl(phone = "0 536 860 87 70", message?: string) {
  const digits = phone.replace(/\D/g, "");
  const formatted = digits.startsWith("90") ? digits : `90${digits.replace(/^0/, "")}`;
  const textParam = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${formatted}${textParam}`;
}

