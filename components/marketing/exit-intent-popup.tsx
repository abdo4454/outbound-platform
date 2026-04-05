"use client";

import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { pixel } from "@/lib/pixel";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const triggered = useRef(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("exit_popup_dismissed")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered.current && !dismissed) {
        triggered.current = true;
        setShow(true);
      }
    };

    // Also trigger after 45s of inactivity on mobile
    const timer = setTimeout(() => {
      if (!triggered.current && !dismissed) {
        triggered.current = true;
        setShow(true);
      }
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, [dismissed]);

  function handleDismiss() {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("exit_popup_dismissed", "1");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: "",
          source: "exit-intent-popup",
          interest: "lead-magnet",
          landingPage: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (res.ok) {
        pixel.lead({ content_name: "lead-magnet-popup" });
        setStatus("success");
        setTimeout(handleDismiss, 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative bg-midnight-950 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-glow-lg animate-fade-up">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              It&apos;s on its way!
            </h3>
            <p className="text-gray-400">
              Check your inbox for the B2B SaaS Outbound Playbook.
            </p>
          </div>
        ) : (
          <>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              <span className="text-brand-300 text-xs font-medium">Free Resource</span>
            </div>

            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Before you go — grab the playbook
            </h2>
            <p className="text-gray-400 mb-1 text-sm">
              <span className="text-white font-semibold">The B2B SaaS Outbound Playbook:</span> How we book 30–50 qualified meetings/month for SaaS companies.
            </p>

            <ul className="space-y-1.5 mb-6 mt-4">
              {[
                "The exact 3-step cold email sequence that gets 18%+ reply rates",
                "ICP definition framework for SaaS buyers",
                "How to handle 6 common objections and convert them",
                "Our domain warmup checklist (avoid spam folders)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors whitespace-nowrap text-sm disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : (
                  <>Send it <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {status === "error" && (
              <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>
            )}

            <p className="text-center text-xs text-gray-600 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
