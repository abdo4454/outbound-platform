import { Shield, Zap, HeartHandshake, BarChart3 } from "lucide-react";
import Link from "next/link";

const COMMITMENTS = [
  {
    icon: Shield,
    title: "Meetings guaranteed",
    description:
      "We put a minimum meeting commitment in every contract. If we don't hit it, we keep working until we do — no extra charge.",
  },
  {
    icon: Zap,
    title: "Live in 2 weeks",
    description:
      "From signed contract to first emails sent in 14 days. Week one is setup and warm-up. Week two, your outbound is live.",
  },
  {
    icon: BarChart3,
    title: "Full transparency",
    description:
      "Every client gets a real-time dashboard showing every email sent, every reply, and every meeting booked. No black boxes.",
  },
  {
    icon: HeartHandshake,
    title: "Founder-level attention",
    description:
      "We're selective. Every client gets direct access to the people running their campaign — not an account coordinator.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-midnight-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-600/10 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-brand-400/5 blur-[128px]" />
      </div>

      <div className="section relative z-10">
        <div className="text-center mb-16">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Our Promise
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-white mb-4">
            What every client gets
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We&apos;re building our track record with our early clients. In return,
            they get our best work, founder-level attention, and early-adopter pricing that won&apos;t last.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-14">
          {COMMITMENTS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center mb-4">
                <c.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white mb-2">{c.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{c.description}</p>
            </div>
          ))}
        </div>

        {/* Early access banner */}
        <div className="max-w-2xl mx-auto text-center rounded-2xl border border-brand-500/30 bg-brand-600/10 p-8">
          <div className="inline-block bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Founding Client Spots
          </div>
          <p className="text-white font-display text-xl font-bold mb-2">
            We&apos;re taking on our first 10 clients
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Founding clients lock in early-adopter pricing and work directly with the team building this. Spots are limited and we&apos;re selective.
          </p>
          <Link href="/book" className="btn-primary">
            Apply for a spot
          </Link>
        </div>
      </div>
    </section>
  );
}
