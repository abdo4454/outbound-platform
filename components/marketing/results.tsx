import { ArrowUpRight } from "lucide-react";

const CASE_STUDIES = [
  {
    company: "B2B DevTools SaaS",
    industry: "Developer Tools · Series A",
    stat: "43",
    statLabel: "qualified meetings/month",
    description:
      "From 0 outbound to 43 qualified meetings/month with engineering leaders at mid-market software companies. 11 closed deals in the first quarter.",
    metrics: { emailsSent: "14k/mo", openRate: "61%", replyRate: "32%", meetings: "43/mo" },
  },
  {
    company: "HR Tech SaaS",
    industry: "HR Technology · Series B",
    stat: "$2.4M",
    statLabel: "pipeline in 90 days",
    description:
      "Targeting VP HR and CHROs at 200–1,000 employee companies. Went from 6 monthly discovery calls to 28. Three $200K+ ARR deals closed.",
    metrics: { emailsSent: "9k/mo", openRate: "57%", replyRate: "26%", meetings: "28/mo" },
  },
  {
    company: "FinTech SaaS",
    industry: "Financial Technology · Seed→A",
    stat: "8",
    statLabel: "enterprise deals in 6 months",
    description:
      "Hyper-targeted outreach to CFOs and finance leaders. Average deal size $68K ACV. Outbound became their #1 revenue channel within 4 months.",
    metrics: { emailsSent: "4k/mo", openRate: "68%", replyRate: "41%", meetings: "19/mo" },
  },
];

export function Results() {
  return (
    <section id="results" className="py-24 bg-white">
      <div className="section">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            SaaS Results
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            Real numbers from
            <br className="hidden sm:block" /> real SaaS campaigns
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We work exclusively with B2B SaaS companies. These are the actual
            numbers our clients see — not projections.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.company}
              className="card-hover group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-[64px] -mr-4 -mt-4 group-hover:bg-brand-100 transition-colors" />

              <div className="relative">
                <div className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-1">
                  {study.industry}
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">
                  {study.company}
                </h3>

                <div className="mb-4">
                  <div className="text-5xl font-display font-bold text-brand-600">
                    {study.stat}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {study.statLabel}
                  </div>
                </div>

                <p className="text-gray-500 mb-6 leading-relaxed">
                  {study.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(study.metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-bold text-gray-900">{value}</div>
                      <div className="text-xs text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="#book"
                  className="inline-flex items-center gap-1 text-brand-600 font-semibold text-sm mt-6 hover:gap-2 transition-all"
                >
                  Get results like this <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
