import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ArrowRight, CheckCircle2, Download, Target, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free B2B SaaS ICP Template | Ideal Customer Profile Framework",
  description:
    "Download our B2B SaaS ICP (Ideal Customer Profile) template. Define firmographics, technographics, buying triggers, and persona signals — the foundation for cold email that gets replies.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/resources/icp-template`,
  },
};

const SECTIONS = [
  {
    icon: Target,
    title: "Firmographic filters",
    description: "Company size, industry vertical, revenue range, funding stage, growth signals, and geography. The hard filters that define your addressable market.",
    fields: ["Employee count range", "Industry & sub-vertical", "Annual revenue / ARR range", "Funding stage & recency", "Headcount growth rate (6-month)"],
  },
  {
    icon: Zap,
    title: "Technographic triggers",
    description: "The tech stack signals that indicate buying intent. Companies using complementary or competing tools have already proven willingness to buy in your category.",
    fields: ["Current tech stack (CRM, ERP, etc.)", "Competing products they use", "Integration triggers", "Tech spend signals", "Recent tool migrations"],
  },
  {
    icon: TrendingUp,
    title: "Buying intent signals",
    description: "Real-time triggers that tell you a prospect is in-market right now. These are the signals that turn a cold email into a warm one.",
    fields: ["Recent funding announcement", "New C-suite or VP hire", "Job postings in target department", "Product/category-related content engagement", "Competitor contract renewal dates"],
  },
  {
    icon: Users,
    title: "Persona & messaging matrix",
    description: "The specific buyer persona for each ICP segment — their title, pain points, language, and what they care about vs. what they don't.",
    fields: ["Decision maker title & seniority", "Day-to-day pain points", "Business outcome they own", "How they measure success", "What objections they raise"],
  },
];

export default function ICPTemplatePage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-brand-600/15 blur-[128px]" />
        </div>
        <div className="section relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 mb-6">
            <Target className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-brand-300 text-sm font-medium">Free Resource</span>
          </div>
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-6">
            The B2B SaaS
            <br />
            <span className="text-gradient-dark">ICP Template</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            A structured ICP framework covering firmographics, technographics, buying triggers, and persona mapping — the foundation of any outbound campaign that actually converts.
          </p>
          <Link href="/resources/icp-template/download" className="btn-primary btn-lg inline-flex">
            <Download className="w-5 h-5" /> Open Template Free
          </Link>
          <p className="text-gray-500 text-sm mt-3">Opens instantly — no email required. Print to PDF from your browser.</p>
        </div>
      </section>

      {/* Why ICP matters */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="section max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
            Why ICP precision is everything
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            The single biggest driver of cold email performance is not your subject line or your copy — it is whether you are emailing the right people. A precisely defined ICP with real targeting signals is what separates campaigns that get replies from campaigns that get ignored. Every other optimization is secondary.
          </p>
        </div>
      </section>

      {/* Template sections */}
      <section className="py-20 bg-white">
        <div className="section max-w-5xl mx-auto">
          <h2 className="font-display text-display-sm text-gray-900 mb-12 text-center">What the template covers</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {SECTIONS.map((s) => (
              <div key={s.title} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-gray-900">{s.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.description}</p>
                <ul className="space-y-1.5">
                  {s.fields.map((field) => (
                    <li key={field} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 bg-midnight-950 rounded-2xl p-10 text-center">
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Open the template now
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Fill it out yourself, or book a free call and we&apos;ll work through it with you — applied to your actual market and buyer personas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/resources/icp-template/download" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
                <Download className="w-5 h-5" /> Open Template
              </Link>
              <Link href="/book" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors border border-white/10">
                Book a Strategy Call <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
