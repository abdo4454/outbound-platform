"use client";

import { useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";

export function ROICalculator() {
  const [dealSize, setDealSize] = useState(5000);
  const [closeRate, setCloseRate] = useState(25);
  const [meetingsPerMonth, setMeetingsPerMonth] = useState(20);

  const newMRR = Math.round((meetingsPerMonth * (closeRate / 100) * dealSize));
  const annualRevenue = newMRR * 12;
  const roi = Math.round(((newMRR - 5000) / 5000) * 100);

  function formatMoney(n: number) {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
    return `$${n}`;
  }

  return (
    <section className="py-24 bg-midnight-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-brand-600/10 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-brand-400/5 blur-[128px]" />
      </div>

      <div className="section relative z-10">
        <div className="text-center mb-12">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-3">
            ROI Calculator
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-white mb-4">
            Calculate your pipeline potential
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Adjust the sliders to see what a fully-built outbound engine generates for your business.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Sliders */}
          <div className="space-y-8 bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-300">Average Deal Size (MRR)</label>
                <span className="text-brand-400 font-bold text-lg">{formatMoney(dealSize)}/mo</span>
              </div>
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={dealSize}
                onChange={(e) => setDealSize(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3366ff ${((dealSize - 1000) / 49000) * 100}%, #ffffff20 0%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>$1k</span><span>$50k</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-300">Close Rate</label>
                <span className="text-brand-400 font-bold text-lg">{closeRate}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={closeRate}
                onChange={(e) => setCloseRate(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3366ff ${((closeRate - 5) / 55) * 100}%, #ffffff20 0%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5%</span><span>60%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-300">Qualified Meetings / Month</label>
                <span className="text-brand-400 font-bold text-lg">{meetingsPerMonth}</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={meetingsPerMonth}
                onChange={(e) => setMeetingsPerMonth(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3366ff ${((meetingsPerMonth - 5) / 55) * 100}%, #ffffff20 0%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5</span><span>60</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">New MRR Per Month</span>
              </div>
              <div className="text-5xl font-display font-bold text-white">
                {formatMoney(newMRR)}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {meetingsPerMonth} meetings × {closeRate}% close × {formatMoney(dealSize)}/mo
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Annual Revenue</div>
                <div className="text-2xl font-display font-bold text-white">{formatMoney(annualRevenue)}</div>
                <div className="text-xs text-gray-500 mt-1">New ARR generated</div>
              </div>
              <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-5">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">ROI (Growth plan)</div>
                <div className="text-2xl font-display font-bold text-brand-400">{roi > 0 ? `${roi}%` : "—"}</div>
                <div className="text-xs text-gray-500 mt-1">Return on $5k/mo</div>
              </div>
            </div>

            <a
              href="#book"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-4 transition-colors group"
            >
              Get these results for your SaaS
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <p className="text-center text-xs text-gray-600">
              Projections based on B2B SaaS industry benchmarks — your results depend on ICP, deal size, and close rate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
