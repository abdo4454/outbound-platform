import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-midnight-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[200px]" />
      </div>

      <div className="section relative z-10 text-center">
        <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-4">
          Ready to build your machine?
        </p>
        <h2 className="font-display text-display-sm sm:text-display-md text-white mb-6">
          Stop relying on inbound.
          <br />
          Build a predictable pipeline.
        </h2>
        <p className="text-xl text-gray-400 max-w-xl mx-auto mb-10">
          Book a free 30-minute strategy call. We&apos;ll map your ICP, calculate
          your meeting potential, and show you exactly how the machine works for
          your specific SaaS market.
        </p>
        <a href="#book" className="btn-primary btn-lg group inline-flex items-center gap-2">
          Book Your Free Strategy Call
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
        <p className="text-sm text-gray-500 mt-4">
          Free · No pitch · 30 minutes · Real strategy you can use today
        </p>
      </div>
    </section>
  );
}
