import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { BookCall } from "@/components/marketing/book-call";
import { Star, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { PixelViewContent } from "@/components/analytics/pixel-view-content";

export const metadata: Metadata = {
  title: "Book a Free B2B Outbound Strategy Call | Appointment Setting Consultation",
  description:
    "Book a free 30-minute strategy call with Accelerated Growth. We'll map your B2B SaaS ICP, estimate qualified meeting volume, and give you a go-to-market outbound plan — no pitch, just strategy.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/book`,
  },
  openGraph: {
    title: "Book a Free B2B SaaS Outbound Strategy Call | Accelerated Growth",
    description:
      "30-minute free strategy call. ICP mapping, meeting volume estimate, and a go-to-market outbound plan for your SaaS — whether you work with us or not.",
  },
};

const TESTIMONIALS = [
  {
    quote: "The call alone was worth an hour of my time. They showed me exactly why our previous outbound failed and what to fix. We signed up that week.",
    name: "Sarah K.",
    title: "VP Sales · B2B SaaS, Series A",
    initials: "SK",
  },
  {
    quote: "Most agencies pitch you on the call. These guys actually audited our existing sequences and told us what was broken before we even paid anything.",
    name: "David M.",
    title: "CEO · HR Tech, Seed",
    initials: "DM",
  },
];

export default function BookPage() {
  return (
    <main>
      <PixelViewContent contentName="book-strategy-call" contentCategory="Lead Generation" />
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-brand-600/15 blur-[128px]" />
        </div>

        <div className="section relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-brand-300 text-sm font-medium">Slots available for Q2 2026</span>
          </div>

          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-4">
            Book Your Free
            <br />
            <span className="text-gradient-dark">Strategy Call</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            30 minutes. No pitch. We&apos;ll map your exact outbound opportunity,
            show you what&apos;s possible, and give you a plan you can act on today.
          </p>
        </div>
      </section>

      {/* Testimonials above fold */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="section">
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <BookCall />

      {/* Trust bar */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="section">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            {[
              "No pitch — just strategy",
              "Booked within 1 business hour",
              "30 SaaS companies helped this quarter",
              "92% client retention rate",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
