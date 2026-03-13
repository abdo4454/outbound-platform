import { Mail, Linkedin, Search, Users, BarChart3, Shield } from "lucide-react";

const SERVICES = [
  {
    icon: Mail,
    title: "Cold Email Campaigns",
    description: "Multi-step, personalized email sequences sent from warmed-up domains. We handle copywriting, A/B testing, and deliverability.",
    features: ["Personalized at scale", "Domain warm-up included", "Deliverability monitoring"],
  },
  {
    icon: Linkedin,
    title: "LinkedIn Outreach",
    description: "Connection requests, profile views, and DM sequences that feel human. Coordinated with email for multi-channel impact.",
    features: ["Profile optimization", "Connection campaigns", "InMail sequences"],
  },
  {
    icon: Search,
    title: "Lead Research & Lists",
    description: "Hand-verified prospect lists built to your exact ICP. No stale data, no generic scraping — real people who match.",
    features: ["ICP-matched targeting", "Email verification", "Enriched data points"],
  },
  {
    icon: Users,
    title: "Meeting Booking & Handoff",
    description: "We manage every reply, handle objections, and book meetings directly on your calendar. Clean CRM handoff included.",
    features: ["Reply management", "Calendar integration", "CRM sync"],
  },
  {
    icon: BarChart3,
    title: "Reporting & Analytics",
    description: "Real-time dashboard showing every metric that matters. Weekly reports, campaign insights, and pipeline attribution.",
    features: ["Live dashboard", "Weekly reports", "Attribution tracking"],
  },
  {
    icon: Shield,
    title: "Deliverability Management",
    description: "We protect your sender reputation. Domain health monitoring, inbox rotation, warm-up management, and blacklist prevention.",
    features: ["Domain health checks", "Inbox rotation", "Spam testing"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="section">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            What We Do
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            Everything you need to fill
            <br className="hidden sm:block" /> your pipeline
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            A full-stack outbound engine, managed end to end. No hiring, no training, no tools to buy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.title} className="card-hover group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-500 mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((f) => (
                  <span key={f} className="badge-brand">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
