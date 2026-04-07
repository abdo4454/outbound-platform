"use client";

export type ConsentLevel = "all" | "necessary" | null;

const CONSENT_KEY = "ag-cookie-consent";
const CONSENT_COOKIE = "ag-cc";

export function getConsent(): ConsentLevel {
  if (typeof window === "undefined") return null;
  try {
    return (localStorage.getItem(CONSENT_KEY) as ConsentLevel) ?? null;
  } catch {
    return null;
  }
}

export function setConsent(level: "all" | "necessary") {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_KEY, level);
    // Also set a cookie so the server can read it (1 year)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${CONSENT_COOKIE}=${level}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: level }));
  } catch {
    // ignore
  }
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === "all";
}

export function hasMarketingConsent(): boolean {
  return getConsent() === "all";
}
