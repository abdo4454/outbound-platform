import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-midnight-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[200px]" />
      </div>

      <div className="section relative z-10 text-center">
        <h2 className="font-display text-display-sm sm:text-display-md text-white mb-6">
          Ready to fill your calendar?
        </h2>
        <p className="text-xl text-gray-400 max-w-xl mx-auto mb-10">
          Book a 30-minute discovery call. We&apos;ll map out your ICP, estimate your
          meeting potential, and show you exactly how we&apos;d approach your market.
        </p>
        <Link href="#" className="btn-primary btn-lg group">
          Book Your Discovery Call
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          Free consultation · No commitment · 30 minutes
        </p>
      </div>
    </section>
  );
}
