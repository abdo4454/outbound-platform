import { Target, Mail, CalendarCheck, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: Target,
    step: "01",
    title: "Define Your ICP",
    description:
      "We work with you to nail down exactly who your ideal customer is — industry, company size, titles, geography, and buying signals.",
  },
  {
    icon: Mail,
    step: "02",
    title: "We Build & Launch",
    description:
      "Our team sets up domains, warms inboxes, writes personalized sequences, and builds targeted prospect lists. You approve, we launch.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Meetings Hit Your Calendar",
    description:
      "Qualified prospects book directly onto your calendar. We handle all the back-and-forth — you just show up prepared.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Optimize & Scale",
    description:
      "We continuously A/B test messaging, refine targeting, and scale what works. Your pipeline grows month over month.",
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
            From zero to booked meetings
            <br className="hidden sm:block" /> in four steps
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We handle the entire outbound engine so you can focus on closing. 
            Here&apos;s what the process looks like.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.step} className="relative group">
              {/* Connector line */}
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
