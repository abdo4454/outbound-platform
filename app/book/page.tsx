import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { BookCall } from "@/components/marketing/book-call";
import { CheckCircle2 } from "lucide-react";
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

const WHAT_YOU_GET = [
  {
    heading: "Your ICP, mapped",
    body: "We'll identify your best-fit buyers, which channels reach them, and what they actually care about.",
  },
  {
    heading: "A realistic meeting estimate",
    body: "Based on your market, we'll give you an honest number — not a sales pitch number.",
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

      {/* What you get on the call */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="section">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">What we cover on the call</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {WHAT_YOU_GET.map((item) => (
              <div key={item.heading} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-gray-900 mb-2">{item.heading}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
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
              "30 minutes, free",
              "Real advice, whether you work with us or not",
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
