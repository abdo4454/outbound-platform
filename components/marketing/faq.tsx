"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What is B2B appointment setting and how does it work for SaaS?",
    a: "B2B appointment setting is the process of identifying your ideal-fit prospects, reaching out via cold email or LinkedIn, handling replies and objections, and booking qualified sales meetings directly onto your calendar. For SaaS companies, it replaces or supplements an internal SDR team — giving you a consistent, predictable flow of qualified pipeline without the overhead of hiring and managing reps.",
  },
  {
    q: "How does your go-to-market outbound support work?",
    a: "We embed into your go-to-market motion as a fully managed outbound layer. We handle ICP definition, contact sourcing, email infrastructure setup, sequence copywriting, A/B testing, reply management, CRM handoff, and weekly reporting. You focus on running discovery calls and closing deals — we handle everything upstream from first contact to booked meeting.",
  },
  {
    q: "Do you work with early-stage SaaS or only funded companies?",
    a: "We work with SaaS companies from seed stage to Series C. The main requirements are: you have a clear ICP, a product that's actively selling, and an AE (or founder) who can run discovery calls. Budget typically starts at $2,500/month.",
  },
  {
    q: "Our buyers are technical — CTOs, engineers, developers. Can you write for them?",
    a: "Yes, and we're better at it than most agencies. Technical buyers hate generic sales copy. We research each prospect, reference real technical pain points, and keep emails short and direct. Our DevTools and infrastructure SaaS clients consistently see 30%+ reply rates with technical ICP.",
  },
  {
    q: "What cold email strategies do you use to get high reply rates?",
    a: "We combine four things that most agencies skip: hyper-personalized first lines based on real prospect research, trigger-based targeting (funding rounds, hiring surges, tech stack signals), multi-step sequences with value at every touchpoint, and rigorous deliverability management with dedicated sending domains. Our average reply rate is 18.7% versus the 3–5% industry average.",
  },
  {
    q: "We're PLG — can you add enterprise outbound alongside our self-serve motion?",
    a: "Absolutely. This is actually one of our most common setups. We identify companies that are already using your product at the team level and run targeted outreach to the economic buyer to convert them to enterprise contracts. It's one of the highest-converting motions we run.",
  },
  {
    q: "How quickly can we start seeing meetings?",
    a: "Week 1 is setup — domains, warm-up, sequence writing, and ICP targeting. Week 2 emails start going out. Most clients see their first booked meetings in week 2-3. By month 2 you're in full swing.",
  },
  {
    q: "What CRMs do you integrate with?",
    a: "HubSpot, Salesforce, Pipedrive, Close, and Attio. Every booked meeting flows directly into your pipeline with contact data, sequence history, and full attribution. We also sync to Slack so you get a ping every time a meeting is booked.",
  },
  {
    q: "What's your guarantee?",
    a: "We guarantee a minimum number of qualified meetings per month based on your ICP and plan. If we fall short, we work for free until we make it up. We've only triggered this guarantee twice in three years — and both times we over-delivered in the following month.",
  },
  {
    q: "Do you run LinkedIn outreach too?",
    a: "Yes, as an add-on or included in the Scale plan. LinkedIn outreach is coordinated with email — we never spray the same person on both channels at once. The two-touch approach (email first, LinkedIn follow-up after a reply or open) consistently lifts conversion by 20-30%.",
  },
  {
    q: "How do you handle GDPR and data privacy?",
    a: "All prospect data is sourced from B2B databases (Apollo, LinkedIn) with legitimate interest as the lawful basis. We include unsubscribe links in all emails, honor opt-outs immediately, and never store data longer than necessary. We're happy to sign a DPA.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="section-narrow">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            Common questions
          </h2>
          <p className="text-lg text-gray-500">
            From SaaS founders and VPs who&apos;ve been through the process.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl border transition-all duration-200",
                openIndex === i
                  ? "border-brand-200 bg-brand-50/30 shadow-sm"
                  : "border-gray-100 bg-white hover:border-gray-200"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-display font-semibold text-gray-900 pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-200",
                    openIndex === i && "rotate-180 text-brand-600"
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 -mt-2">
                  <p className="text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
