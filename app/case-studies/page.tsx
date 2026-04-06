import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Accelerated Growth",
  description:
    "Real B2B outbound results from Accelerated Growth clients. Case studies coming as we build our client base.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/case-studies`,
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
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-3">Results</p>
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-4">
            Case studies in progress
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We&apos;re early — and we&apos;re building our track record with our first cohort of clients.
            Real results will be published here as they come in.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="section max-w-3xl mx-auto">

          {/* Coming soon card */}
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center mb-12">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-5">
              <Clock className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
              Our first case studies are in the making
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We launched to take on our first clients. In a few months, this page will have real numbers —
              meetings booked, pipeline generated, deals closed.
            </p>
            <p className="text-sm text-gray-400">
              Want to be the first case study? We&apos;re selective, but we&apos;d love to build something great together.
            </p>
          </div>

          {/* What to expect section */}
          <div className="space-y-4 mb-14">
            <h3 className="font-display font-bold text-gray-900 text-center mb-8">
              What the results will look like
            </h3>
            {[
              {
                metric: "20–50",
                label: "qualified meetings / month",
                desc: "Booked directly into your calendar with pre-qualified, briefed prospects.",
              },
              {
                metric: "8–15%",
                label: "reply rate target",
                desc: "2–3× the industry average of 3–5%, through better targeting and copy.",
              },
              {
                metric: "90 days",
                label: "to full velocity",
                desc: "Campaigns reach peak performance in the first 90 days as data informs iteration.",
              },
            ].map((item) => (
              <div key={item.metric} className="flex items-start gap-5 p-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="text-right flex-shrink-0 w-20">
                  <div className="text-2xl font-bold text-brand-600">{item.metric}</div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                </div>
                <div className="border-l border-gray-100 pl-5">
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-gray-500 mb-4">Be part of the first cohort.</p>
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
