import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ArrowRight, CheckCircle2, Target, Zap, Heart } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | B2B SaaS Outbound Agency & Appointment Setting Team",
  description:
    "Meet the team behind Accelerated Growth — a specialist B2B SaaS outbound agency. Cold email, LinkedIn outreach, appointment setting, and go-to-market execution. 92% client retention, 3,200+ meetings booked.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/about`,
  },
  openGraph: {
    title: "About Accelerated Growth | B2B SaaS Outbound & Appointment Setting Agency",
    description:
      "We build outbound engines for B2B SaaS companies. 50+ clients, 3,200+ meetings booked, 92% retention. Specialists in cold email, appointment setting, and go-to-market outbound.",
  },
};

const VALUES = [
  {
    icon: Target,
    title: "Precision over volume",
    description: "We'd rather send 500 hyper-targeted emails than 5,000 generic blasts. ICP precision is what separates 18% reply rates from 2%.",
  },
  {
    icon: Zap,
    title: "Speed of iteration",
    description: "We optimize within days, not months. If a sequence underperforms in week 2, it's rebuilt by week 3. No waiting for quarterly reviews.",
  },
  {
    icon: Heart,
    title: "Client success is our retention",
    description: "92% of our clients renew. That's not because of contracts — it's because meetings keep coming. Pipeline growth is the only metric we care about.",
  },
];

const TEAM = [
  {
    name: "Alex Rivera",
    title: "Founder & CEO",
    bio: "Former SDR and sales leader at two Series B SaaS companies. Built the outbound playbook that generated $8M in pipeline before starting Accelerated Growth.",
    initials: "AR",
  },
  {
    name: "Maya Patel",
    title: "Head of Strategy",
    bio: "10 years running outbound for B2B SaaS. Previously at Outreach and Apollo. Personally designs the ICP and messaging for every new client.",
    initials: "MP",
  },
  {
    name: "Jordan Kim",
    title: "Head of Deliverability",
    bio: "The engineer behind our infrastructure. Our 97% inbox placement rate is his work. Previously built email systems at SendGrid.",
    initials: "JK",
  },
  {
    name: "Sam Torres",
    title: "Client Success Lead",
    bio: "Makes sure every client hits their meeting targets. Owns the weekly reports, optimization cycles, and escalations. Never misses a beat.",
    initials: "ST",
  },
];

const STATS = [
  { value: "50+", label: "SaaS companies helped" },
  { value: "3,200+", label: "Qualified meetings booked" },
  { value: "92%", label: "Client retention rate" },
  { value: "18.7%", label: "Average reply rate" },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-brand-600/10 blur-[128px]" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-brand-400/5 blur-[128px]" />
        </div>

        <div className="section relative z-10 max-w-3xl">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-4">About Us</p>
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-6">
            We build outbound engines,
            <br />not one-off campaigns.
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Accelerated Growth is a fully-managed outbound agency for B2B SaaS companies. We handle everything — ICP research, copywriting, sending infrastructure, optimization, and reporting — so your team can focus on closing the meetings we book.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="section">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl font-bold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="section max-w-3xl mx-auto">
          <h2 className="font-display text-display-sm text-gray-900 mb-6">Why we exist</h2>
          <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
            <p>
              We started Accelerated Growth after watching the same thing happen at company after company: great product, promising early traction, then a pipeline that dried up once founder relationships ran out.
            </p>
            <p>
              Most agencies promise &ldquo;outbound at scale&rdquo; and deliver a CSV of contacts and a 3-step email sequence. You get meetings for a month, then silence as they move on to the next client.
            </p>
            <p>
              We built something different: a full outbound engine that runs continuously, optimizes weekly, and gets more effective over time. The platform you&apos;re looking at isn&apos;t an add-on — it&apos;s how your team tracks every meeting, campaign, and reply in real time.
            </p>
            <p>
              <span className="text-gray-900 font-semibold">The result is predictable pipeline.</span> Not a spike in month one and silence in month three. Consistent, qualified meetings with exactly the buyers you want to talk to.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="section">
          <h2 className="font-display text-display-sm text-gray-900 text-center mb-12">What we believe</h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {VALUES.map((v) => (
              <div key={v.title} className="card text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="section">
          <h2 className="font-display text-display-sm text-gray-900 text-center mb-12">The team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {TEAM.map((t) => (
              <div key={t.name} className="card text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg mx-auto mb-4">
                  {t.initials}
                </div>
                <h3 className="font-display font-bold text-gray-900">{t.name}</h3>
                <p className="text-brand-600 text-sm font-medium mb-3">{t.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we work on */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="section max-w-3xl mx-auto">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-6">What we actually do for clients</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "ICP definition and market research",
              "Sending domain setup and warmup",
              "Email copywriting and sequence design",
              "A/B testing and weekly optimization",
              "Deliverability monitoring and maintenance",
              "Bi-weekly strategy calls",
              "Weekly performance reports",
              "CRM push when meetings are booked",
              "LinkedIn outreach coordination",
              "Intent data integration",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-midnight-950">
        <div className="section text-center">
          <h2 className="font-display text-display-sm text-white mb-4">
            Ready to build the machine?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
            Book a free 30-minute call. We&apos;ll map your ICP, estimate your meeting potential, and tell you exactly what we&apos;d build for you.
          </p>
          <Link href="/book" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors group">
            Book a Strategy Call
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
