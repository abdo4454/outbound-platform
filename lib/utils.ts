import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPercent(n: number, decimals = 1) {
  return `${n.toFixed(decimals)}%`;
}

export function formatCompactNumber(n: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function parseUTMs(searchParams: URLSearchParams) {
  return {
    source: searchParams.get("utm_source"),
    medium: searchParams.get("utm_medium"),
    campaign: searchParams.get("utm_campaign"),
    content: searchParams.get("utm_content"),
    term: searchParams.get("utm_term"),
    gclid: searchParams.get("gclid"),
    fbclid: searchParams.get("fbclid"),
  };
}

export function calculateRate(numerator: number, denominator: number) {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
