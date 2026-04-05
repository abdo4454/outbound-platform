import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { BookCall } from "@/components/marketing/book-call";
import { CheckCircle2, TrendingUp, Search, Target } from "lucide-react";
import type { Metadata } from "next";
import { PixelViewContent } from "@/components/analytics/pixel-view-content";

export const metadata: Metadata = {
  title: "Free B2B SaaS Outbound Audit | Cold Email & ICP Analysis",
  description:
    "Get a free outbound audit for your B2B SaaS. We analyze your ICP, cold email sequences, competitor outbound tactics, and meeting volume potential — and hand you a specific action plan.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://accelratedgrowth.com"}/audit`,
  },
  openGraph: {
    title: "Free B2B SaaS Outbound Audit | ICP Gap Analysis & Cold Email Review",
    description:
      "Free 30-minute outbound audit for B2B SaaS. ICP gap analysis, cold email sequence review, competitor intelligence, and a meeting volume estimate for your market.",
  },
};

const AUDIT_INCLUDES = [
  {
    icon: Search,
    title: "ICP Gap Analysis",
    description:
      "We review your current targeting and identify the highest-value segments you're missing.",
  },
  {
    icon: Target,
    title: "Competitor Intelligence",
    description:
      "See what outbound tactics your direct competitors are running and how to win against them.",
  },
  {
    icon: TrendingUp,
    title: "Meeting Volume Estimate",
    description:
      "Based on your market size and ICP, we calculate a realistic meeting number you can hit each month.",
  },
  {
    icon: CheckCircle2,
    title: "Sequence & Copy Review",
    description:
      "If you're already running outbound, we'll grade your sequences and tell you exactly what's killing your reply rate.",
  },
];

export default function AuditPage() {
  return (
    <main>
      <PixelViewContent contentName="free-audit" contentCategory="Lead Generation" />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center bg-midnight-950 pt-24 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-600/15 blur-[128px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-brand-400/10 blur-[128px]" />
        </div>

        <div className="section relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-brand-300 text-sm font-medium">Free · No Commitment</span>
          </div>

          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-5">
            Get Your Free
            <br />
            <span className="text-gradient-dark">Outbound Audit</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            In 30 minutes, we&apos;ll analyze your market, map your ICP, identify
            gaps in your current approach, and hand you a specific action plan —
            whether you work with us or not.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {["No pitch · just strategy", "Works for any stage SaaS", "Delivered same day"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the audit includes */}
      <section className="py-20 bg-white">
        <div className="section">
          <div className="text-center mb-14">
            <h2 className="font-display text-display-sm text-gray-900 mb-3">
              What we cover in your audit
            </h2>
            <p className="text-lg text-gray-500">
              Every audit is custom — we actually look at your business before the call.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {AUDIT_INCLUDES.map((item) => (
              <div key={item.title} className="card-hover text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <p className="text-amber-800 font-semibold mb-1">Important:</p>
            <p className="text-amber-700 text-sm">
              We only take 8–10 new audit calls per month to keep quality high. If you&apos;re
              considering outbound as a growth channel, book now before slots fill.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <BookCall />

      <Footer />
    </main>
  );
}
