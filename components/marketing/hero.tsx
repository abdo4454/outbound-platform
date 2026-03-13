"use client";

import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "2,847", label: "Meetings Booked" },
  { value: "94%", label: "Client Retention" },
  { value: "38%", label: "Avg Reply Rate" },
  { value: "<48h", label: "To First Campaign" },
];

const TRUST_POINTS = [
  "No long-term contracts",
  "Dedicated account manager",
  "Transparent reporting",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-midnight-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-600/20 blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-brand-400/10 blur-[128px] animate-pulse-slow animate-delay-200" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Noise texture */}
        <div className="absolute inset-0 noise opacity-40" />
      </div>

      <div className="section relative z-10 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-brand-300 text-sm font-medium">
              Now booking Q2 2026 clients
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-display-lg sm:text-display-xl text-white mb-6 animate-fade-up">
            We book meetings.
            <br />
            <span className="text-gradient-dark">You close deals.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-delay-100">
            Done-for-you outbound that fills your calendar with qualified
            prospects. Cold email, LinkedIn, lead research — handled end to end.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-up animate-delay-200">
            <Link href="#pricing" className="btn-primary btn-lg group">
              Book a Discovery Call
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="btn-ghost text-gray-400 hover:text-white btn-lg group">
              <Play className="w-5 h-5 fill-current" />
              Watch How It Works
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 animate-fade-up animate-delay-300">
            {TRUST_POINTS.map((point) => (
              <div key={point} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up animate-delay-400">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
