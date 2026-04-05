import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { CASE_STUDIES } from "@/lib/case-studies";
import { ArrowLeft, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cs = CASE_STUDIES.find((c) => c.slug === params.slug);
  if (!cs) return {};
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://accelratedgrowth.com";
  return {
    title: `${cs.company} — B2B SaaS Cold Email & Appointment Setting Case Study`,
    description: `${cs.result} See how Accelrated Growth built the outbound engine for this ${cs.stage} ${cs.industry} company using cold email and appointment setting.`,
    alternates: { canonical: `${base}/case-studies/${cs.slug}` },
    openGraph: {
      title: `${cs.company} Cold Email Case Study | Accelrated Growth`,
      description: `${cs.result} ${cs.timeframe} to results using cold email outreach and appointment setting.`,
      url: `${base}/case-studies/${cs.slug}`,
    },
  };
}

// Detailed story content per case study
const STORY_CONTENT: Record<string, {
  situation: string[];
  approach: string[];
  results: string[];
  quote: { text: string; name: string; title: string };
}> = {
  "devtools-series-a": {
    situation: [
      "They had a great product but zero outbound motion. The founder was sending cold emails manually — maybe 20–30 per week — getting 3–4 meetings a month, mostly from warm intros.",
      "Their ICP was very specific: VP Engineering and CTO at Series A–B SaaS companies with 20–200 employees. A narrow, high-value segment with strong buying intent if reached correctly.",
      "The challenge: technical buyers hate generic cold email. Low personalization = instant delete.",
    ],
    approach: [
      "We spent the first two weeks on ICP research — building a precise profile of what their ideal buyer looked like: company stage, tech stack signals, recent hiring patterns, funding recency.",
      "Built three sequences targeting different buyer triggers: recent Series A raise, engineering team hiring surge, and companies replacing legacy tooling.",
      "Personalized the first line of every email with a specific observation about their company — not a template. Combined with a clear, specific value prop tied to their stage.",
      "Set up 4 sending domains with proper warmup, rotating across sequences to maintain deliverability.",
    ],
    results: [
      "Week 3: First batch of replies. Reply rate hit 14% — 3x their previous attempts.",
      "Week 5: 18 meetings booked. Pipeline starting to form.",
      "Week 8: 43 meetings/month run rate. 18.7% reply rate. 11 closed deals.",
      "Outbound became their primary pipeline source, replacing founder-led warm intros.",
    ],
    quote: {
      text: "Within 8 weeks we went from 4 meetings a month to 43. I was skeptical at first — we'd tried cold email before and it never worked. The difference was the specificity of the targeting and the quality of the copy. These felt like messages from someone who actually understood our buyers.",
      name: "Marcus T.",
      title: "CEO, B2B DevTools SaaS",
    },
  },
  "hr-tech-enterprise": {
    situation: [
      "Series B HR tech company with a strong product but struggling to crack enterprise. Their SDR team was running cold email but deliverability was broken — 30% bounce rate, emails landing in spam.",
      "They needed to reach VP HR and Chief People Officers at companies with 200–2,000 employees. A notoriously hard-to-reach segment.",
      "Previous agency had promised results but delivered generic campaigns with no ICP precision.",
    ],
    approach: [
      "First step was fixing the infrastructure: new sending domains, proper DMARC/SPF/DKIM, domain warmup over 3 weeks before sending a single email.",
      "Rebuilt the ICP from scratch. Identified three high-signal triggers: companies undergoing rapid headcount growth, companies with recent CHRO hires, and companies with open roles in HR Operations.",
      "Built a multi-channel approach: cold email sequence paired with LinkedIn connection requests from the client's team for the top 20% of accounts.",
      "Monthly reporting to show pipeline impact so the client's leadership could attribute revenue to the channel.",
    ],
    results: [
      "Month 1: Deliverability fixed. Open rate jumped from 23% to 71%.",
      "Month 2: 34 meetings booked. First enterprise pilots launched.",
      "Month 3: $2.4M in net-new pipeline. 8 enterprise deals closed in Q1.",
      "Cost per qualified meeting dropped 68% vs their previous SDR-led approach.",
    ],
    quote: {
      text: "The infrastructure fix alone was worth the price. We had no idea how broken our deliverability was. Once that was sorted and the targeting was precise, the meetings started flowing consistently. $2.4M in Q1 pipeline speaks for itself.",
      name: "Jennifer P.",
      title: "VP Sales, HR Tech Platform",
    },
  },
  "fintech-seed": {
    situation: [
      "Seed-stage FinTech company with a compliance product for mid-market financial services companies. Very niche, very technical — their buyers were CFOs, VPs of Finance, and Compliance Officers.",
      "Founders had tried LinkedIn outreach themselves. Getting maybe 1–2 meetings per month. Not enough to prove the channel worked.",
      "Small team, no dedicated sales resources. Needed to outsource the entire outbound motion.",
    ],
    approach: [
      "Deeply researched the compliance landscape — specific regulations (SOX, Basel III) that drove buying urgency. Built messaging around pain that compliance officers feel every quarter-end.",
      "Focused exclusively on email since LinkedIn was saturated with generic fintech pitches. Used regulatory language that made it obvious these weren't generic blasts.",
      "Built a 5-step sequence with a specific compliance pain point in each step, ending with a risk calculator offer.",
      "Hand-verified every contact before sending — no volume approaches for this ICP. Quality over quantity.",
    ],
    results: [
      "Week 2: 9 replies from CFOs and Compliance Officers — unusually fast for a niche segment.",
      "Week 4: 18 meetings booked. 87% were C-suite or VP level.",
      "Week 6: 28 total meetings. 3 enterprise pilots launched from initial calls.",
      "Founders described it as \"unlocking a channel we thought didn't work for us.\"",
    ],
    quote: {
      text: "We'd written off cold email for our market. CFOs don't respond to generic outreach. But when the messaging actually addressed our specific compliance angle, it was completely different. These people wanted to talk to us. 28 meetings in 6 weeks with C-suite buyers — that was a complete surprise.",
      name: "Sarah L.",
      title: "Co-Founder, FinTech Compliance SaaS",
    },
  },
  "saas-marketplace": {
    situation: [
      "Two-sided marketplace needing supply-side partnerships at scale. The buyer was a Operations or Partnerships lead at companies that could supply inventory to their platform.",
      "Previous outreach was done by the founding team between product sprints — inconsistent, no system.",
      "Goal: build a repeatable supply-side acquisition channel so growth wasn't dependent on founder relationships.",
    ],
    approach: [
      "Mapped the supply-side ICP precisely — specific company types, size bands, and operational indicators that signaled a good fit.",
      "Built separate sequences for warm (already knew the brand) and cold (no prior contact) segments with different messaging angles.",
      "Added LinkedIn touchpoints for the top 30% of accounts to create multi-channel presence before the cold email landed.",
      "Weekly optimization cycles — pulled top-performing subject lines and opening lines, killed underperformers within 72 hours.",
    ],
    results: [
      "Month 1: 28 partnership meetings. 22.4% reply rate — best we've seen for a marketplace use case.",
      "Month 2: 62 meetings total. Cost per meeting at $81.",
      "Outbound became the #1 supply acquisition channel, replacing founder-led intros.",
      "Team expanded from 1 to 3 supply partnerships closed per month.",
    ],
    quote: {
      text: "The iteration speed was what separated this from other agencies. They killed underperforming sequences within days, not months. By week 4 they'd found the angle that worked and doubled down. 62 meetings in 10 weeks, $81 cost per meeting — that's a machine.",
      name: "Jordan K.",
      title: "Head of Partnerships, B2B Marketplace",
    },
  },
};

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = CASE_STUDIES.find((c) => c.slug === params.slug);
  if (!cs) notFound();

  const story = STORY_CONTENT[cs.slug];
  const currentIdx = CASE_STUDIES.findIndex((c) => c.slug === params.slug);
  const nextStudy = CASE_STUDIES[(currentIdx + 1) % CASE_STUDIES.length];

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className={`bg-gradient-to-br ${cs.accentColor} to-midnight-950 pt-32 pb-16 relative overflow-hidden`}>
        <div className="section relative z-10">
          <Link href="/case-studies" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Case Studies
          </Link>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-gray">{cs.industry}</span>
            <span className="text-white/60 text-sm bg-white/10 rounded-full px-3 py-1">{cs.stage}</span>
            <span className="text-white/60 text-sm bg-white/10 rounded-full px-3 py-1">{cs.timeframe} to results</span>
          </div>

          <h1 className="font-display text-display-sm text-white mb-4">{cs.company}</h1>
          <p className="text-xl text-white/80 max-w-2xl">{cs.result}</p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl">
            {cs.metrics.map((m) => (
              <div key={m.label} className="bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-display font-bold text-white">{m.value}</div>
                <div className="text-sm text-white/60 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="section max-w-3xl mx-auto">
          <div className="space-y-12">
            {/* Situation */}
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                The Situation
              </h2>
              <div className="space-y-3 ml-11">
                {story.situation.map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
                ))}
              </div>
            </div>

            {/* Approach */}
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                How We Approached It
              </h2>
              <div className="space-y-3 ml-11">
                {story.approach.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                The Results
              </h2>
              <div className="space-y-3 ml-11">
                {story.results.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 font-medium leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
              <blockquote className="text-lg text-gray-700 leading-relaxed italic mb-5">
                &ldquo;{story.quote.text}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                  {story.quote.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{story.quote.name}</div>
                  <div className="text-sm text-gray-400">{story.quote.title}</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-midnight-950 rounded-2xl p-10">
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Want results like this?
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Book a free 30-minute strategy call. We&apos;ll map your ICP, estimate your meeting potential, and give you a plan.
            </p>
            <Link href="/book" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors group">
              Book a Strategy Call
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Next study */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="section max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/case-studies" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> All case studies
          </Link>
          <Link href={`/case-studies/${nextStudy.slug}`} className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
            Next: {nextStudy.company} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
