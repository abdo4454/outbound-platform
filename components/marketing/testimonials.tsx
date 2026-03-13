import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "OutboundPro completely replaced our internal SDR team. Better results at a fraction of the cost. We went from 8 meetings a month to 40+.",
    name: "Sarah Chen",
    title: "VP Sales",
    company: "TechFlow",
    avatar: "SC",
  },
  {
    quote: "The transparency is what sold me. I can see every metric in real time. No other agency gave us that level of visibility into what they were doing.",
    name: "Marcus Rivera",
    title: "CEO",
    company: "Meridian Systems",
    avatar: "MR",
  },
  {
    quote: "We tried doing outbound ourselves for a year. Two months with OutboundPro generated more pipeline than our entire previous year combined.",
    name: "Aisha Patel",
    title: "Head of Growth",
    company: "NovaStar",
    avatar: "AP",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-midnight-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-600/10 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-brand-400/5 blur-[128px]" />
      </div>

      <div className="section relative z-10">
        <div className="text-center mb-16">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Testimonials
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-white mb-4">
            Don&apos;t take our word for it
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm hover:bg-white/[0.06] transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-300 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-sm">
                    {t.title}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
