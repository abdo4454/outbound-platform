"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

const STATS = [
  { value: "20–50", label: "Target Meetings / Month" },
  { value: "8–15%", label: "Reply Rate Target" },
  { value: "2 wks", label: "To First Email Sent" },
  { value: "90 days", label: "To Full Velocity" },
];

const TRUST_POINTS = [
  "No long-term contracts",
  "B2B SaaS specialists only",
  "Meetings guaranteed or we work free",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-midnight-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-600/20 blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-brand-400/10 blur-[128px] animate-pulse-slow animate-delay-200" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 noise opacity-40" />
      </div>

      <div className="section relative z-10 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-brand-300 text-sm font-medium">
              Now booking Q2 2026 — B2B SaaS outbound clients
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-display-lg sm:text-display-xl text-white mb-6 animate-fade-up">
            Predictable pipeline
            <br />
            <span className="text-gradient-dark">for B2B SaaS companies.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-delay-100">
            Done-for-you cold email outreach, LinkedIn outbound, and appointment
            setting — fully managed go-to-market execution that delivers 20–50
            qualified sales meetings per month. You just close.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-up animate-delay-200">
            <a href="#book" className="btn-primary btn-lg group">
              Book a Free Strategy Call
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#results" className="btn-ghost text-gray-400 hover:text-white btn-lg">
              See SaaS Results
            </a>
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
