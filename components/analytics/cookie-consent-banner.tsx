"use client";

import { useState, useEffect } from "react";
import { X, Cookie, ChevronDown, ChevronUp } from "lucide-react";
import { getConsent, setConsent } from "@/lib/cookie-consent";
import Link from "next/link";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Only show if no choice has been made yet
    if (getConsent() === null) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    setConsent("all");
    setVisible(false);
    // Fire GTM/Pixel/PostHog now that consent is given
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: "all" }));
  }

  function decline() {
    setConsent("necessary");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
    >
      <div className="max-w-3xl mx-auto bg-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Main bar */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Cookie className="w-4 h-4 text-brand-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm mb-1">
                We use cookies to improve your experience
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                We use analytics and marketing cookies to understand how visitors use our site and to show relevant content.
                Strictly necessary cookies are always active.{" "}
                <Link href="/privacy" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
                  Privacy Policy
                </Link>
              </p>

              {/* Expanded details */}
              {expanded && (
                <div className="mt-4 space-y-3 text-xs text-gray-400 border-t border-white/10 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-white font-medium">Strictly Necessary</span> — Always active. Required for the site to function (session management, security, form submissions). Cannot be disabled.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-white font-medium">Analytics</span> — Helps us understand which pages are visited and how visitors navigate the site. Used to improve content and user experience.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-white font-medium">Marketing</span> — Used to measure the effectiveness of our advertising and to show relevant ads on other platforms (e.g. LinkedIn, Meta) after you've visited our site.
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 mt-2 transition-colors"
              >
                {expanded ? (
                  <><ChevronUp className="w-3 h-3" /> Show less</>
                ) : (
                  <><ChevronDown className="w-3 h-3" /> Cookie details</>
                )}
              </button>
            </div>

            <button
              onClick={decline}
              className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0 mt-0.5"
              aria-label="Decline cookies"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:ml-13">
            <button
              onClick={accept}
              className="flex-1 sm:flex-none sm:min-w-[140px] bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={decline}
              className="flex-1 sm:flex-none sm:min-w-[140px] bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold px-5 py-2.5 rounded-xl border border-white/10 transition-colors"
            >
              Necessary Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
