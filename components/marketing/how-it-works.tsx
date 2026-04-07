import { Target, Mail, CalendarCheck, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: Target,
    step: "01",
    title: "Map Your SaaS ICP",
    description:
      "We work with you to define your ideal SaaS buyer — company stage, tech stack, headcount, buyer titles, and the specific pain your product solves. Precision targeting is everything.",
  },
  {
    icon: Mail,
    step: "02",
    title: "We Build & Launch",
    description:
      "Our team sets up warmed sending domains, builds your prospect list from professional networks and B2B data sources, writes short personalized sequences, and launches within two weeks. You approve everything first.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Meetings Hit Your Calendar",
    description:
      "We handle every reply — objections, follow-ups, scheduling. Qualified prospects book directly onto your calendar. You show up to close, not to admin.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Optimize to a Machine",
    description:
      "Every week we A/B test messaging, review conversion data, and tighten targeting. Month over month, your meeting volume grows and your cost per meeting drops.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="section">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            From zero to 20+ SaaS meetings
            <br className="hidden sm:block" /> in four steps
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We run the entire outbound machine. You focus on closing. Here&apos;s
            exactly what the process looks like.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative group">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px border-t-2 border-dashed border-gray-200" />
              )}

              <div className="card-hover text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
                  Step {step.step}
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
