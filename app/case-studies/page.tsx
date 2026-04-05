import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { CASE_STUDIES } from "@/lib/case-studies";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B SaaS Outbound Case Studies | Cold Email & Appointment Setting Results",
  description:
    "Real B2B SaaS outbound results: 43 meetings/month with VP Engineering buyers, $2.4M pipeline in one quarter, 22.4% reply rates. See how Accelerated Growth's appointment setting and cold email engine performs.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/case-studies`,
  },
  openGraph: {
    title: "B2B SaaS Outbound Case Studies | Cold Email & Appointment Setting",
    description:
      "Real results from real SaaS companies. Cold email case studies showing 43+ meetings/month, $2.4M in net-new pipeline, 18–22% reply rates.",
  },
};

export default function CaseStudiesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-600/15 blur-[128px]" />
        </div>
        <div className="section relative z-10 text-center">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-3">Real Clients · Real Results</p>
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-4">
            What Happens When You
            <br /><span className="text-gradient-dark">Build the Machine</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Every case study below is a real B2B SaaS company. Real numbers.
            No companynames changed. No cherry-picked months.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-white">
        <div className="section">
          <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {CASE_STUDIES.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                {/* Accent bar */}
                <div className={`h-1.5 bg-gradient-to-r ${cs.accentColor}`} />

                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-gray-900">{cs.company}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="badge-gray">{cs.industry}</span>
                        <span className="badge-brand">{cs.stage}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 whitespace-nowrap">
                      {cs.timeframe}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">
                    {cs.challenge}
                  </p>

                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5">
                    <p className="text-sm font-semibold text-green-800">{cs.result}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className={`rounded-xl p-3 ${m.color.split(" ")[1]}`}>
                        <div className={`text-lg font-bold ${m.color.split(" ")[0]}`}>{m.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {cs.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-sm text-brand-600 font-semibold group-hover:gap-2 transition-all">
                      Read story <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-500 mb-4">Ready to be the next case study?</p>
            <Link href="/book" className="btn-primary btn-lg">
              Book a Strategy Call <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
