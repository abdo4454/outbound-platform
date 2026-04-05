import { ArrowRight, TrendingUp, CalendarCheck, Mail, MessageSquare } from "lucide-react";

const METRICS = [
  { label: "Emails Sent", value: "12,840", change: "+12%", color: "text-brand-400" },
  { label: "Open Rate", value: "64.2%", change: "+3pts", color: "text-blue-400" },
  { label: "Reply Rate", value: "18.7%", change: "+5pts", color: "text-emerald-400" },
  { label: "Meetings Booked", value: "34", change: "+18%", color: "text-amber-400" },
];

const RECENT = [
  { name: "Alex Johnson", company: "Acme SaaS", action: "Meeting booked", time: "2m ago", dot: "bg-green-500" },
  { name: "Sarah Kim", company: "DevFlow", action: "Positive reply", time: "14m ago", dot: "bg-brand-500" },
  { name: "Mike Torres", company: "Zenith AI", action: "Meeting booked", time: "1h ago", dot: "bg-green-500" },
  { name: "Priya Sharma", company: "CloudBase", action: "Replied — interested", time: "2h ago", dot: "bg-brand-500" },
];

export function PlatformPreview() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="section">
        <div className="text-center mb-16">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Your Command Center
          </p>
          <h2 className="font-display text-display-sm sm:text-display-md text-gray-900 mb-4">
            Every metric in one place.
            <br className="hidden sm:block" /> Real-time from your campaigns.
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Your client portal pulls live data from your campaigns every 15 minutes.
            No spreadsheets. No manual reports. Just numbers.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative max-w-5xl mx-auto">
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-brand-100/50 to-transparent rounded-3xl blur-xl" />

          <div className="relative bg-gray-50 rounded-2xl border border-gray-200 shadow-card-hover overflow-hidden">
            {/* Top bar */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">OP</span>
                </div>
                <span className="font-display font-bold text-gray-900 text-sm">Accelrated Growth</span>
                <span className="text-gray-300 text-sm">·</span>
                <span className="text-sm text-gray-500">Acme Corp Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-400">Live · synced 4m ago</span>
              </div>
            </div>

            <div className="p-6 grid lg:grid-cols-3 gap-6">
              {/* Left: Metrics + chart */}
              <div className="lg:col-span-2 space-y-4">
                {/* KPI cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {METRICS.map((m) => (
                    <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className={`text-2xl font-display font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
                      <div className="text-xs text-green-600 font-medium mt-1">{m.change} this mo</div>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-900">Meetings Booked — This Month</span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block" /> Emails</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Meetings</span>
                    </div>
                  </div>
                  {/* Fake chart bars */}
                  <div className="flex items-end gap-1 h-24">
                    {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 85, 100, 88, 72].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                        <div
                          className="w-full rounded-sm bg-brand-100"
                          style={{ height: `${h}%` }}
                        >
                          <div
                            className="w-full rounded-sm bg-brand-500"
                            style={{ height: `${Math.round(h * 0.22)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-2">
                    <span>Mar 1</span><span>Mar 7</span><span>Mar 14</span><span>Mar 21</span><span>Mar 28</span>
                  </div>
                </div>
              </div>

              {/* Right: Activity feed */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Live Activity</h3>
                <div className="space-y-3">
                  {RECENT.map((item) => (
                    <div key={item.name} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                      <div>
                        <div className="text-xs font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.company}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.action}</div>
                      </div>
                      <div className="ml-auto text-xs text-gray-300 whitespace-nowrap">{item.time}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-semibold text-gray-700">34 meetings booked</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">this month · on track for 40</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA below preview */}
        <div className="text-center mt-12">
          <a
            href="#book"
            className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors group"
          >
            See your dashboard live in 2 weeks
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="text-sm text-gray-400 mt-3">Book a call today → onboard this week → first meetings in 14 days</p>
        </div>
      </div>
    </section>
  );
}
