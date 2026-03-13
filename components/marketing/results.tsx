import { ArrowUpRight } from "lucide-react";

const CASE_STUDIES = [
  {
    company: "SaaS Startup",
    industry: "Developer Tools",
    stat: "47",
    statLabel: "meetings/month",
    description: "From 0 to 47 qualified meetings per month in 90 days. 12 closed deals in the first quarter.",
    metrics: { emails: "15,000/mo", openRate: "62%", replyRate: "34%", meetings: "47/mo" },
  },
  {
    company: "IT Services Firm",
    industry: "Managed Services",
    stat: "3.2x",
    statLabel: "pipeline ROI",
    description: "Generated $1.2M in pipeline from a $375K annual investment. 8 enterprise contracts signed.",
    metrics: { emails: "8,000/mo", openRate: "58%", replyRate: "28%", meetings: "23/mo" },
  },
  {
    company: "Consulting Agency",
    industry: "Management Consulting",
    stat: "62%",
    statLabel: "reply rate",
    description: "Hyper-personalized outreach to C-suite executives. 62% reply rate, 41% positive reply rate.",
    metrics: { emails: "3,000/mo", openRate: "71%", replyRate: "62%", meetings: "18/mo" },
  },
];

export function Results() {
  return (
    <section id="results" className="py-24 bg-white">
      <div className="section">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Results
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            Real numbers from
            <br className="hidden sm:block" /> real campaigns
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We don&apos;t hide behind vanity metrics. Here&apos;s what our clients actually see.
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

                {/* Hero Stat */}
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

                {/* Metrics Grid */}
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
                  href="#"
                  className="inline-flex items-center gap-1 text-brand-600 font-semibold text-sm mt-6 hover:gap-2 transition-all"
                >
                  Read full case study <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
