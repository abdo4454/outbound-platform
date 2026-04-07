import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ArrowRight, CheckCircle2, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The B2B SaaS Cold Email Playbook | Free Download",
  description:
    "The complete cold email playbook for B2B SaaS companies. ICP research, sequence templates, subject line formulas, deliverability setup, and reply handling — everything to book 30+ meetings per month.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/resources/playbook`,
  },
};

const CHAPTERS = [
  {
    number: "01",
    title: "Defining Your ICP with Signal Precision",
    topics: [
      "Why broad ICPs kill reply rates",
      "The 7 signals that identify high-intent prospects",
      "Building a targeting list that converts at 15%+",
      "ICP validation before you send a single email",
    ],
  },
  {
    number: "02",
    title: "Cold Email Infrastructure & Deliverability",
    topics: [
      "Domain setup: naming strategy for sending domains",
      "SPF, DKIM, DMARC — the technical minimum",
      "Inbox warmup: timeline and tooling",
      "Sending volume limits by domain age",
    ],
  },
  {
    number: "03",
    title: "Writing Cold Emails That Get Replies",
    topics: [
      "The anatomy of a high-converting cold email",
      "First-line personalization at scale",
      "Subject line formulas with real open rate data",
      "5-step sequence templates by ICP type",
    ],
  },
  {
    number: "04",
    title: "Appointment Setting & Reply Management",
    topics: [
      "How to handle the 8 most common objections",
      "Moving from reply to booked meeting in one exchange",
      "LinkedIn multi-touch coordination",
      "CRM handoff process and attribution",
    ],
  },
  {
    number: "05",
    title: "Optimization: Making the Machine Better Each Week",
    topics: [
      "What metrics actually matter (and which don't)",
      "Weekly optimization cadence",
      "A/B testing framework for subject lines and openers",
      "When to rebuild a sequence vs. tweak it",
    ],
  },
];

export default function PlaybookPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-600/15 blur-[128px]" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-400/10 blur-[128px]" />
        </div>
        <div className="section relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 mb-6">
            <Download className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-brand-300 text-sm font-medium">Free Resource</span>
          </div>
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-6">
            The B2B SaaS
            <br />
            <span className="text-gradient-dark">Cold Email Playbook</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            A practical guide to cold email outbound for B2B SaaS companies. ICP research, deliverability setup, sequence templates, reply handling, and a weekly optimization process. No fluff.
          </p>
          <Link href="/resources/playbook/download" className="btn-primary btn-lg inline-flex">
            <Download className="w-5 h-5" /> Read & Download Free
          </Link>
          <p className="text-gray-500 text-sm mt-3">Opens instantly — no email required. Print to PDF from your browser.</p>
        </div>
      </section>

      {/* What's inside */}
      <section className="py-20 bg-white">
        <div className="section max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-display-sm text-gray-900 mb-3">What&apos;s inside</h2>
            <p className="text-lg text-gray-500">5 chapters. Everything you need to build and run a cold email outbound motion.</p>
          </div>

          <div className="space-y-6">
            {CHAPTERS.map((ch) => (
              <div key={ch.number} className="flex gap-6 p-7 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="text-4xl font-display font-bold text-brand-100 flex-shrink-0 w-14">
                  {ch.number}
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-lg mb-4">{ch.title}</h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {ch.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 bg-midnight-950 rounded-2xl p-10 text-center">
            <h3 className="font-display text-2xl font-bold text-white mb-3">
              Read the full playbook
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Open it now, read it in your browser, and save as PDF. Or book a free call and we&apos;ll walk through it live — applied to your specific market and ICP.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/resources/playbook/download" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
                <Download className="w-5 h-5" /> Open Playbook
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
