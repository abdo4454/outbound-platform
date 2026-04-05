import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ArrowRight, MapPin, Clock, Zap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Join Accelerated Growth — B2B Outbound Agency",
  description:
    "Join the team at Accelerated Growth. We're hiring outbound strategists, copywriters, and account managers who are obsessed with B2B SaaS pipeline generation.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/careers`,
  },
};

const OPEN_ROLES = [
  {
    title: "Senior Outbound Strategist",
    department: "Strategy",
    location: "Remote",
    type: "Full-time",
    description:
      "Own the outbound strategy for 6–8 B2B SaaS clients. Design ICP frameworks, build targeting lists, write high-performing sequences, and iterate weekly based on reply data.",
    requirements: [
      "3+ years running outbound for B2B SaaS companies",
      "Proven track record of 15%+ reply rates",
      "Deep familiarity with Apollo, Instantly, or similar tooling",
      "Ability to write sharp, research-backed cold email copy",
    ],
  },
  {
    title: "Cold Email Copywriter",
    department: "Copy",
    location: "Remote",
    type: "Full-time",
    description:
      "Write cold email sequences and LinkedIn messages that get replies. You'll research prospects, understand buyer personas across SaaS verticals, and craft personalized first lines at scale.",
    requirements: [
      "Portfolio of B2B SaaS cold email sequences with measurable results",
      "Strong understanding of B2B buyer psychology",
      "Ability to write like a human, not a marketer",
      "Fast — can turn around quality copy within 24 hours",
    ],
  },
  {
    title: "Account Manager",
    department: "Client Success",
    location: "Remote",
    type: "Full-time",
    description:
      "Manage relationships with 8–12 active clients. Lead weekly calls, present performance reports, coordinate with the strategy team on optimizations, and ensure clients hit their meeting targets.",
    requirements: [
      "2+ years in a client-facing role at a B2B agency or SaaS company",
      "Comfortable discussing outbound metrics and campaign performance",
      "Strong communicator — written and verbal",
      "Detail-oriented with the ability to juggle multiple accounts",
    ],
  },
];

const VALUES = [
  {
    icon: Zap,
    title: "Move fast",
    description: "We optimize campaigns within days. If something isn't working, we kill it and rebuild — never wait for a quarterly review.",
  },
  {
    icon: MapPin,
    title: "Fully remote",
    description: "Work from wherever you're most productive. We operate across time zones with async-first communication and clear output expectations.",
  },
  {
    icon: Clock,
    title: "Flexible hours",
    description: "Client calls aside, your schedule is yours. We measure results, not hours on a Zoom call.",
  },
];

export default function CareersPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-brand-600/15 blur-[128px]" />
        </div>
        <div className="section relative z-10 max-w-3xl">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-4">Careers</p>
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-6">
            Build the machine
            <br />
            <span className="text-gradient-dark">with us.</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            We&apos;re a small team that does the work most agencies outsource. If you&apos;re obsessed with outbound, love data-driven iteration, and want to actually see your work drive revenue for SaaS companies — we want to talk.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="section">
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {VALUES.map((v) => (
              <div key={v.title} className="text-center">
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

      {/* Open Roles */}
      <section className="py-20 bg-white">
        <div className="section max-w-4xl mx-auto">
          <h2 className="font-display text-display-sm text-gray-900 mb-12">Open roles</h2>
          <div className="space-y-6">
            {OPEN_ROLES.map((role) => (
              <div key={role.title} className="border border-gray-200 rounded-2xl p-8 hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="font-display text-xl font-bold text-gray-900">{role.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="badge-gray">{role.department}</span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5" /> {role.location}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> {role.type}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="btn-primary btn-sm flex-shrink-0"
                  >
                    Apply <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-gray-600 leading-relaxed mb-5">{role.description}</p>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">What we&apos;re looking for:</p>
                  <ul className="space-y-2">
                    {role.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
            <h3 className="font-display font-bold text-gray-900 mb-2">Don&apos;t see your role?</h3>
            <p className="text-gray-500 text-sm mb-4">
              We sometimes hire for roles not listed. If you&apos;re exceptional at outbound, copy, or client success — send us a note.
            </p>
            <Link href="/contact" className="btn-ghost btn-sm inline-flex">
              Send a note <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
