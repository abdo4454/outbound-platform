import { Target, Mail, CalendarCheck, TrendingUp } from "lucide-react";

const FORMULA_STEPS = [
  {
    icon: Target,
    step: "01",
    title: "ICP Research",
    description:
      "We map your ideal customer profile down to company size, tech stack, growth signals, and buying triggers — so every email lands with the right person.",
    stat: "100%",
    statLabel: "hand-verified prospect lists",
  },
  {
    icon: Mail,
    step: "02",
    title: "Infrastructure & Copy",
    description:
      "Dedicated sending domains, warmed-up inboxes, and sequences written around your buyer's real pain points. No templates. No spray-and-pray.",
    stat: "<2%",
    statLabel: "target bounce rate",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Launch & Iterate",
    description:
      "We go live in week two and run continuous A/B tests on subject lines, openers, and CTAs — tightening reply rates every sprint.",
    stat: "2 weeks",
    statLabel: "to first emails sent",
  },
  {
    icon: CalendarCheck,
    step: "04",
    title: "Qualified Meetings",
    description:
      "Positive replies get handed off to our team for scheduling. Every meeting lands on your calendar pre-qualified and briefed.",
    stat: "0",
    statLabel: "no-shows go unfollowed",
  },
];

export function Results() {
  return (
    <section id="results" className="py-24 bg-white">
      <div className="section">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            The Outbound Formula
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            How we build your
            <br className="hidden sm:block" /> pipeline from scratch
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Every engagement follows the same four-phase system — built for predictable, repeatable results and designed to improve every week it runs.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {FORMULA_STEPS.map((item) => (
            <div key={item.step} className="card-hover group relative overflow-hidden">
              <div className="absolute top-4 right-4 text-5xl font-display font-bold text-gray-50 group-hover:text-brand-50 transition-colors select-none">
                {item.step}
              </div>

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>

                <h3 className="font-display font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{item.description}</p>

                <div className="border-t border-gray-100 pt-4">
                  <div className="text-2xl font-bold text-brand-600">{item.stat}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.statLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The math */}
        <div className="mt-16 bg-midnight-950 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-2">The Math</p>
            <h3 className="font-display text-2xl font-bold text-white">
              What a scaled campaign looks like
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10,000", label: "Emails / month", sub: "across 3–5 domains" },
              { value: "50%", label: "Average open rate", sub: "with warmed infrastructure" },
              { value: "8–15%", label: "Reply rate target", sub: "2–3× industry average" },
              { value: "20–50", label: "Meetings / month", sub: "into your calendar" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-display font-bold text-brand-400 mb-1">{m.value}</div>
                <div className="text-sm font-semibold text-white mb-0.5">{m.label}</div>
                <div className="text-xs text-gray-500">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
