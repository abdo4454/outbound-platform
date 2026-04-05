"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, CheckCircle2, Shield, Clock } from "lucide-react";
import { pixel } from "@/lib/pixel";

const TRUST = [
  "Free · no commitment",
  "30 minutes",
  "Real strategy, not a sales pitch",
];

const WHAT_WE_COVER = [
  "Your exact ICP and where to find them",
  "Realistic meeting volume estimate for your market",
  "Which channels work best for your buyer",
  "What a 90-day ramp looks like",
];

export function BookCall() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      companySize: (form.elements.namedItem("arr") as HTMLSelectElement).value,
      interest: (form.elements.namedItem("meetingGoal") as HTMLSelectElement).value,
      message: (form.elements.namedItem("challenge") as HTMLSelectElement).value,
      source: "book-call-form",
      landingPage: typeof window !== "undefined" ? window.location.href : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Something went wrong");
      }

      pixel.lead({ content_name: "book-call-form" });
      pixel.schedule();
      setStatus("success");
      setTimeout(() => {
        window.location.href = "https://calendly.com/accelerateyourgrowthtoday";
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="book" className="py-24 bg-gray-50">
      <div className="section">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Value prop */}
            <div>
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
                Free Strategy Call
              </p>
              <h2 className="font-display text-display-sm text-gray-900 mb-5">
                Let&apos;s map your outbound machine
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Book a free 30-minute call with our team. We&apos;ll look at your
                specific SaaS market, buyer profile, and current pipeline — and
                show you exactly what a predictable outbound engine looks like
                for you.
              </p>

              <div className="space-y-3 mb-8">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  What we cover:
                </p>
                {WHAT_WE_COVER.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {TRUST.map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="mt-10 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  &ldquo;The strategy call alone was worth it. They showed me exactly
                  why our previous outbound failed and what to do differently. We
                  signed up that week.&rdquo;
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  — Sarah K., VP Sales · B2B SaaS, Series A
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                    You&apos;re booked in!
                  </h3>
                  <p className="text-gray-500 mb-6">
                    We&apos;ll send a calendar invite within 1 business hour. Check
                    your inbox (and spam, just in case).
                  </p>
                  <div className="flex items-center gap-2 justify-center text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Usually responds within 1 hour</span>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-1">
                    Book your strategy call
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Takes 60 seconds. We&apos;ll reach out to confirm timing.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Your name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="name"
                          type="text"
                          required
                          className="input w-full"
                          placeholder="Alex Johnson"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Work email <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          className="input w-full"
                          placeholder="alex@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="company"
                        type="text"
                        required
                        className="input w-full"
                        placeholder="Acme SaaS"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Current ARR
                      </label>
                      <select name="arr" className="input w-full">
                        <option value="">Select range...</option>
                        <option value="pre-revenue">Pre-revenue</option>
                        <option value="under-1m">Under $1M ARR</option>
                        <option value="1m-5m">$1M – $5M ARR</option>
                        <option value="5m-20m">$5M – $20M ARR</option>
                        <option value="20m+">$20M+ ARR</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Biggest outbound challenge
                      </label>
                      <select name="challenge" className="input w-full">
                        <option value="">Select...</option>
                        <option value="not-enough-leads">Not enough leads in the pipeline</option>
                        <option value="low-reply-rates">Low reply rates / emails ignored</option>
                        <option value="need-enterprise">Need to land enterprise clients</option>
                        <option value="just-starting">Just starting outbound from scratch</option>
                        <option value="inconsistent">Results are inconsistent month to month</option>
                        <option value="scaling">Need to scale what's already working</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Qualified meetings needed per month
                      </label>
                      <select name="meetingGoal" className="input w-full">
                        <option value="">Select goal...</option>
                        <option value="5-10">5–10 meetings/month</option>
                        <option value="10-20">10–20 meetings/month</option>
                        <option value="20-40">20–40 meetings/month</option>
                        <option value="40+">40+ meetings/month</option>
                      </select>
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-primary w-full btn-lg justify-center group disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        "Booking..."
                      ) : (
                        <>
                          Book My Free Strategy Call
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-gray-400">
                      No spam. No pitch. We respect your inbox.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
