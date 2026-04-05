import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: "$2,500",
    period: "/month",
    description: "For SaaS companies running outbound for the first time. One ICP, one campaign, proven results.",
    features: [
      "1 sending domain + inbox warm-up",
      "Up to 5,000 targeted emails/month",
      "1 campaign with 3-step sequence",
      "ICP research & list building",
      "Weekly performance report",
      "Slack + email notifications on meetings",
      "HubSpot / Pipedrive sync",
    ],
    cta: "Book a Call",
    href: "#book",
    featured: false,
  },
  {
    name: "Growth",
    price: "$5,000",
    period: "/month",
    description: "For SaaS companies scaling outbound as a core pipeline channel. Multiple ICPs, campaigns, and A/B testing.",
    features: [
      "3 sending domains + warm-up",
      "Up to 25,000 emails/month",
      "Unlimited campaigns & sequences",
      "A/B testing on subject lines & copy",
      "LinkedIn outreach add-on available",
      "Live reporting dashboard",
      "CRM sync + full attribution",
      "Dedicated account manager",
      "Bi-weekly strategy calls",
    ],
    cta: "Book a Call",
    href: "#book",
    featured: true,
  },
  {
    name: "Scale",
    price: "$10,000",
    period: "/month",
    description: "Full-stack outbound engine for high-growth SaaS targeting enterprise. Multi-channel, custom research, zero cap.",
    features: [
      "Unlimited sending domains",
      "Unlimited email volume",
      "Multi-channel (email + LinkedIn)",
      "Custom enterprise lead research",
      "Live dashboard (syncs every 15 min)",
      "Salesforce / HubSpot deep sync",
      "Custom integrations",
      "Weekly executive reporting",
      "Quarterly business reviews",
      "Priority 2-hour response SLA",
    ],
    cta: "Book a Call",
    href: "#book",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="section">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            Simple pricing, serious results
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            No setup fees. No long-term contracts. Cancel anytime.
            Every plan includes a qualified meetings guarantee.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "rounded-2xl p-8 relative transition-all duration-300",
                plan.featured
                  ? "bg-midnight-950 text-white shadow-glow-lg border-2 border-brand-500/30 scale-[1.02] lg:scale-105"
                  : "bg-white border border-gray-200 shadow-card hover:shadow-card-hover"
              )}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={cn(
                    "font-display text-xl font-bold mb-2",
                    plan.featured ? "text-white" : "text-gray-900"
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    "text-sm mb-4",
                    plan.featured ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-4xl font-display font-bold",
                      plan.featured ? "text-white" : "text-gray-900"
                    )}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      plan.featured ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "w-5 h-5 mt-0.5 flex-shrink-0",
                        plan.featured ? "text-brand-400" : "text-brand-600"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        plan.featured ? "text-gray-300" : "text-gray-600"
                      )}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={plan.href}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all",
                  plan.featured
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                )}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Need a custom plan for a larger team?{" "}
          <a href="#book" className="text-brand-600 font-medium hover:underline">
            Let&apos;s talk
          </a>
          .
        </p>
      </div>
    </section>
  );
}
