// Meta Pixel event helpers
// Usage: import { pixelEvent } from "@/lib/pixel"

declare global {
  interface Window {
    fbq: (
      action: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq: unknown;
  }
}

export function pixelEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", eventName, params);
}

export const pixel = {
  pageView: () => pixelEvent("PageView"),
  lead: (params?: { content_name?: string; value?: number; currency?: string }) =>
    pixelEvent("Lead", params),
  viewContent: (params?: { content_name?: string; content_category?: string }) =>
    pixelEvent("ViewContent", params),
  initiateCheckout: (params?: { value?: number; currency?: string; content_name?: string }) =>
    pixelEvent("InitiateCheckout", params),
  contact: () => pixelEvent("Contact"),
  schedule: () => pixelEvent("Schedule"),
};
