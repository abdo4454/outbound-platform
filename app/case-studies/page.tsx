import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ArrowRight, Target, Mail, TrendingUp, CalendarCheck, BarChart3 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results & Methodology | Accelerated Growth",
  description:
    "How Accelerated Growth builds B2B outbound engines for SaaS companies. Our four-phase methodology, what we measure, and what to expect from a fully managed outbound engagement.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/case-studies`,
  },
};

const METHODOLOGY = [
  {
    icon: Target,
    phase: "Phase 1",
    title: "ICP Research & Targeting",
    what: "We define your ideal customer profile down to specific firmographic filters, technographic signals, and behavioral triggers — funding rounds, hiring surges, competitive displacement signals. Every prospect on your list is there for a reason.",
    output: "A validated ICP brief and a hand-reviewed target list",
  },
  {
    icon: Mail,
    phase: "Phase 2",
    title: "Infrastructure & Sequence Build",
    what: "We configure dedicated sending domains, run email warmup, write multi-step sequences personalized to your buyer's pain points, and set up CRM and Slack integrations. Nothing goes live without your sign-off.",
    output: "Live sending infrastructure + approved sequence copy",
  },
  {
    icon: TrendingUp,
    phase: "Phase 3",
    title: "Launch & Weekly Optimization",
    what: "Emails start going out in week two. Every week we review open rates, reply rates, and positive reply rates by sequence step — and make at least one concrete change. Underperforming steps get rewritten. Winning variants get scaled.",
    output: "Weekly performance report + optimization log",
  },
  {
    icon: CalendarCheck,
    phase: "Phase 4",
    title: "Reply Management & Booking",
    what: "Every positive reply goes through our team. We qualify the prospect, handle objections, and book them directly onto your calendar with a pre-call brief. You show up to close, not to admin.",
    output: "Qualified meetings in your calendar, fully briefed",
  },
];

const BENCHMARKS = [
  {
    metric: "Reply rate",
    industry: "3–5%",
    ourTarget: "8–15%",
    note: "With tight ICP targeting and personalized copy",
  },
  {
    metric: "Open rate",
    industry: "20–30%",
    ourTarget: "40–60%",
    note: "Warmed infrastructure and clean domain reputation",
  },
  {
    metric: "Time to first meeting",
    industry: "8–12 weeks",
    ourTarget: "2–3 weeks",
    note: "From contract to first booked meeting",
  },
  {
    metric: "SDR ramp time",
    industry: "6–9 months",
    ourTarget: "2 weeks",
    note: "From signed contract to live campaign",
  },
];

const WHAT_YOU_SEE = [
  {
    icon: BarChart3,
    title: "Real-time dashboard",
    description: "Every email sent, every open, every reply, every meeting booked — visible to you at all times. No black boxes.",
  },
  {
    icon: TrendingUp,
    title: "Weekly performance report",
    description: "Delivered every Monday: what went out, what replied, what converted, and what we are changing this week.",
  },
  {
    icon: CalendarCheck,
    title: "Meeting notifications",
    description: "Slack alert every time a meeting is booked, with the prospect's details, sequence history, and a pre-call brief.",
  },
];

export default function CaseStudiesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-600/15 blur-[128px]" />
        </div>
        <div className="section relative z-10 max-w-3xl">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-3">Methodology & Results</p>
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-5">
            How we build your
            <br />
            outbound engine
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            We are in the early stages of building our client base. When case studies are ready, they will live here — with real numbers, real buyers, and real pipeline generated. Until then, here is exactly how the engagement works and what we are designed to deliver.
          </p>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-white">
        <div className="section">
          <div className="text-center mb-16">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">The Process</p>
            <h2 className="font-display text-display-sm text-gray-900 mb-4">
              Four phases. One machine.
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every engagement runs through the same four-phase system, regardless of market or ICP. This is what you are buying.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {METHODOLOGY.map((phase) => (
              <div key={phase.phase} className="rounded-2xl border border-gray-100 p-7 hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <phase.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">{phase.phase}</p>
                    <h3 className="font-display font-bold text-gray-900">{phase.title}</h3>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{phase.what}</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Output</p>
                  <p className="text-sm text-gray-700 font-medium">{phase.output}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="section max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">What to Expect</p>
            <h2 className="font-display text-display-sm text-gray-900 mb-4">
              Our targets vs. industry averages
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              These are the benchmarks we build toward — not guarantees for every market, but the standard we hold ourselves to. Your actual results depend on ICP, market size, and product-market fit.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 px-6 py-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Metric</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Industry avg.</div>
              <div className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Our target</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:block">Context</div>
            </div>
            {BENCHMARKS.map((b, i) => (
              <div key={b.metric} className={`grid grid-cols-4 px-6 py-5 ${i < BENCHMARKS.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="font-semibold text-gray-900 text-sm">{b.metric}</div>
                <div className="text-gray-400 text-sm">{b.industry}</div>
                <div className="text-brand-600 font-bold text-sm">{b.ourTarget}</div>
                <div className="text-gray-400 text-xs hidden sm:block self-center">{b.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you see */}
      <section className="py-20 bg-white">
        <div className="section max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-display-sm text-gray-900 mb-4">
              Full visibility, no black boxes
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every client gets complete access to campaign performance. You never have to ask what is happening — it is all visible in real time.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {WHAT_YOU_SEE.map((item) => (
              <div key={item.title} className="text-center p-7 rounded-2xl border border-gray-100 hover:border-brand-100 hover:shadow-sm transition-all">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-midnight-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-600/15 blur-[128px]" />
        </div>
        <div className="section relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-block bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            Founding Client Spots
          </div>
          <h2 className="font-display text-display-sm text-white mb-4">
            Be part of the first cohort
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            We are taking on our first clients and giving them founder-level attention, early-adopter pricing, and the full four-phase system described above. The case studies on this page will be theirs.
          </p>
          <Link href="/book" className="btn-primary btn-lg inline-flex">
            Book a Free Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-500 text-sm mt-4">30 minutes · free · no pitch · real strategy</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
