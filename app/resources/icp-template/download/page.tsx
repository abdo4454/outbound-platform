"use client";

import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

const SECTIONS = [
  {
    letter: "A",
    title: "Company Filters (Firmographics)",
    description: "Define the hard boundaries of your addressable market. Be as specific as possible — tight filters mean better targeting.",
    fields: [
      { label: "Industry vertical", note: "Be specific. Not 'software' — 'project management SaaS', 'HR tech', 'fintech for SMBs', etc.", value: "" },
      { label: "Sub-vertical (if applicable)", note: "e.g. within HR tech: payroll, performance management, recruiting", value: "" },
      { label: "Company headcount range", note: "Pick a tight band — e.g. 25–150. Avoid ranges wider than 10× (e.g. 10–1000).", value: "" },
      { label: "Annual revenue / ARR range", note: "e.g. $1M–$20M ARR, or 'Series A funded'", value: "" },
      { label: "Funding stage", note: "e.g. Bootstrapped / Seed / Series A / Series B / Series C", value: "" },
      { label: "Geography", note: "e.g. US + Canada, English-speaking markets, DACH region", value: "" },
      { label: "Business model", note: "e.g. B2B SaaS, marketplace, services, product-led growth", value: "" },
    ],
  },
  {
    letter: "B",
    title: "Technographic Signals",
    description: "The tools a company uses reveals their maturity, their problems, and whether your product fits their stack.",
    fields: [
      { label: "Tools in the same category as yours (competitors they use)", note: "Companies paying a competitor have proven willingness to buy in this category", value: "" },
      { label: "Complementary tools (indicates your product will fit)", note: "e.g. if you sell a sales tool, companies using Salesforce + Outreach are primed", value: "" },
      { label: "Tools that signal they DON'T need you", note: "Companies using X are already solving this — exclude them", value: "" },
      { label: "Tech stack signals that indicate buying stage", note: "e.g. companies still on spreadsheets vs. companies with a full GTM stack", value: "" },
    ],
  },
  {
    letter: "C",
    title: "Behavioral Triggers (Highest Priority)",
    description: "Triggers identify companies in motion — they convert at 3–5× the rate of static list targeting. These are the signals that make a cold email feel timely.",
    fields: [
      { label: "Funding event", note: "New funding = new budget + urgency to execute. Best window: 30–90 days post-announcement", value: "" },
      { label: "Leadership hire in target function", note: "New VP of Sales, new CRO, new Head of Marketing — they want to make changes and build their stack", value: "" },
      { label: "Headcount growth in target department", note: "Scaling = growing pains = buying opportunities. Look for 20%+ department growth in 6 months", value: "" },
      { label: "Job postings that indicate your pain point", note: "e.g. 'SDR Manager' posting = they are building outbound. If you sell outbound tools, contact them now", value: "" },
      { label: "Product launch or expansion announcement", note: "Companies entering a new market or launching a new product often need new tools immediately", value: "" },
      { label: "Competitor churn signal", note: "If you can identify when a competitor's contracts are up for renewal, this is a high-intent window", value: "" },
    ],
  },
  {
    letter: "D",
    title: "Buyer Persona (per ICP segment)",
    description: "For each ICP segment, define the exact person you are emailing — their title, their real pain, and what they care about. If you have multiple buyer types, fill this section out for each one.",
    fields: [
      { label: "Primary decision maker title(s)", note: "e.g. VP of Sales, Head of Revenue, Founder/CEO (at seed stage)", value: "" },
      { label: "Secondary stakeholder / influencer title(s)", note: "Who else is in the buying process but does not have final say?", value: "" },
      { label: "Their primary metric (what they are measured on)", note: "e.g. pipeline generated, meetings booked, revenue closed, CAC", value: "" },
      { label: "Their day-to-day pain points", note: "What problems do they complain about in Slack, in team meetings, on LinkedIn?", value: "" },
      { label: "The business outcome they own", note: "What does success look like for them in the next 90 days?", value: "" },
      { label: "Common objections they raise", note: "What do they push back with when you reach out? Plan your handling.", value: "" },
      { label: "What they DO NOT care about", note: "Features, awards, company history — these kill cold emails. List what to avoid.", value: "" },
    ],
  },
  {
    letter: "E",
    title: "Messaging Framework",
    description: "Translate your ICP knowledge into the core elements of your outreach. This is the brief your copywriter or your own email writing will be based on.",
    fields: [
      { label: "Core pain point to lead with", note: "The one problem most prospects in this ICP share that your product solves", value: "" },
      { label: "The outcome you promise (not the feature)", note: "Not 'we provide AI-powered X' — 'companies like yours typically see Y as a result'", value: "" },
      { label: "Best proof point available", note: "A result, a specific use case, an industry stat — anything concrete that builds credibility", value: "" },
      { label: "Primary CTA", note: "The single, low-friction ask. Usually a short call or a specific question. Keep it to one ask.", value: "" },
      { label: "Subject line angles to test (list 3–5)", note: "Question / company name / forward-style / curiosity gap — test all of them", value: "" },
      { label: "Opening line template", note: "What specific, real thing about the prospect or company will you reference in line 1?", value: "" },
    ],
  },
  {
    letter: "F",
    title: "ICP Validation Checklist",
    description: "Run this check before building your list. Pull 20 companies manually and answer these questions.",
    fields: [
      { label: "Do 15+ of 20 sample companies feel like a good fit?", note: "If not, which filter is wrong?", value: "Yes / No / Adjust: ___" },
      { label: "Do the target titles actually have buying authority?", note: "Or do you need to go one level up?", value: "Yes / No" },
      { label: "Can you find real proof of the pain point at these companies?", note: "Job postings, LinkedIn posts, public interviews", value: "Yes / No" },
      { label: "Is the list size between 500 and 10,000 companies?", note: "Smaller = too niche, larger = too broad", value: "List size: ___" },
      { label: "Do you have a specific, real opening line for the first 5 prospects?", note: "If you cannot write a specific opener for them, your ICP is not specific enough", value: "Yes / No" },
    ],
  },
];

export default function ICPTemplateDownloadPage() {
  return (
    <>
      {/* Screen navigation — hidden on print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/resources/icp-template" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" />
          Download as PDF
        </button>
      </div>

      {/* Document */}
      <div className="max-w-3xl mx-auto px-6 py-12 print:py-6 print:px-0">
        {/* Cover */}
        <div className="mb-16 print:mb-10">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3 print:text-gray-600">
            Accelerated Growth · Free Resource
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            B2B SaaS ICP Template
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
            A structured framework for defining your ideal customer profile — the foundation that determines whether your outbound generates replies or gets ignored.
          </p>
          <div className="mt-6 p-5 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-600 font-semibold mb-1">How to use this template</p>
            <p className="text-sm text-gray-500">Work through each section in order. Be specific — vague answers produce vague targeting. If you cannot answer a field, that is a gap in your ICP knowledge worth closing before you run outbound. Download as PDF, print, and fill in by hand, or duplicate it in Notion or Google Docs.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400">
            <span>6 Sections</span>
            <span>·</span>
            <span>acceleratedgrowth.com</span>
            <span>·</span>
            <span>Free to use and share</span>
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <div key={section.letter} className="mb-14 print:mb-10 print:break-before-page">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 print:border print:border-gray-300 print:bg-white print:text-gray-900">
                {section.letter}
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900">
                {section.title}
              </h2>
            </div>
            <p className="text-gray-500 leading-relaxed mb-8 pl-12">{section.description}</p>

            <div className="space-y-6 pl-12">
              {section.fields.map((field) => (
                <div key={field.label} className="border-b border-gray-100 pb-6">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{field.label}</p>
                    {field.value && (
                      <span className="text-xs text-gray-400 flex-shrink-0 italic">{field.value}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{field.note}</p>
                  {/* Answer line */}
                  <div className="h-8 border-b-2 border-dashed border-gray-200 print:border-gray-400" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center print:mt-8">
          <p className="text-gray-500 text-sm mb-1">
            Want us to build and run this for you?
          </p>
          <p className="text-gray-900 font-semibold">
            Book a free strategy call at{" "}
            <span className="text-brand-600">acceleratedgrowth.com/book</span>
          </p>
          <p className="text-gray-400 text-xs mt-4">
            © Accelerated Growth · acceleratedgrowth.com · Free to use and share
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body { font-size: 11pt; color: #111; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
