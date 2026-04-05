import { db } from "@/lib/db";
import { DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";
import { MRRChart } from "./revenue-charts";

const PLAN_PRICE: Record<string, number> = {
  STARTER: 250000,
  GROWTH: 500000,
  SCALE: 1000000,
  ENTERPRISE: 2000000,
};

const PLAN_COLOR: Record<string, string> = {
  STARTER: "#6b7280",
  GROWTH: "#3366ff",
  SCALE: "#22c55e",
  ENTERPRISE: "#f59e0b",
};

function fmt(cents: number) {
  return "$" + (cents / 100).toLocaleString("en-US");
}

export default async function RevenuePage() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [orgs, invoices] = await Promise.all([
    db.organization.findMany({
      select: { id: true, name: true, plan: true, status: true, mrr: true, stripeSubscriptionId: true, createdAt: true },
      orderBy: { mrr: "desc" },
    }),
    db.invoice.findMany({
      where: { status: "PAID", paidAt: { gte: sixMonthsAgo } },
      select: { amount: true, paidAt: true },
      orderBy: { paidAt: "asc" },
    }),
  ]);

  const activeOrgs = orgs.filter((o) => o.status === "ACTIVE");
  const churnedOrgs = orgs.filter((o) => o.status === "CHURNED");
  const onboardingOrgs = orgs.filter((o) => o.status === "ONBOARDING");
  const totalMRR = activeOrgs.reduce((s, o) => s + o.mrr, 0);
  const arr = totalMRR * 12;

  // Monthly revenue from paid invoices
  const monthlyMap: Record<string, number> = {};
  for (const inv of invoices) {
    if (!inv.paidAt) continue;
    const key = new Date(inv.paidAt).toLocaleDateString("en-US", { month: "short" });
    monthlyMap[key] = (monthlyMap[key] ?? 0) + inv.amount;
  }
  const mrrChartData = Object.entries(monthlyMap).map(([month, mrr]) => ({ month, mrr }));

  // If no invoice history, build from current MRR (single point)
  const chartData = mrrChartData.length > 0
    ? mrrChartData
    : [{ month: new Date().toLocaleDateString("en-US", { month: "short" }), mrr: totalMRR }];

  // Revenue by plan
  const planCounts: Record<string, { count: number; mrr: number }> = {};
  for (const o of activeOrgs) {
    if (!planCounts[o.plan]) planCounts[o.plan] = { count: 0, mrr: 0 };
    planCounts[o.plan].count++;
    planCounts[o.plan].mrr += o.mrr;
  }
  const planData = Object.entries(planCounts).map(([plan, data]) => ({
    plan,
    ...data,
    color: PLAN_COLOR[plan] ?? "#6b7280",
  }));

  // This month new MRR (orgs created this month)
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const newThisMonth = activeOrgs.filter((o) => new Date(o.createdAt) >= monthStart);
  const newMRR = newThisMonth.reduce((s, o) => s + o.mrr, 0);

  // Churn MRR
  const churnedMRR = churnedOrgs.reduce((s, o) => s + (PLAN_PRICE[o.plan] ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Current MRR",
            value: fmt(totalMRR),
            sub: `${activeOrgs.length} active clients`,
            color: "bg-brand-50 text-brand-600",
            icon: DollarSign,
          },
          {
            label: "New MRR",
            value: fmt(newMRR),
            sub: `${newThisMonth.length} new clients this month`,
            color: "bg-green-50 text-green-600",
            icon: TrendingUp,
          },
          {
            label: "Churned",
            value: churnedOrgs.length > 0 ? fmt(churnedMRR) : "$0",
            sub: `${churnedOrgs.length} churned accounts`,
            color: "bg-amber-50 text-amber-600",
            icon: TrendingDown,
          },
          {
            label: "Onboarding",
            value: onboardingOrgs.length.toString(),
            sub: "clients in setup",
            color: "bg-blue-50 text-blue-600",
            icon: Users,
          },
        ].map((k) => (
          <div key={k.label} className="card">
            <div className={`w-10 h-10 rounded-xl ${k.color} flex items-center justify-center mb-3`}>
              <k.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-sm text-gray-600">{k.label}</div>
            <div className="text-xs text-gray-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Unit economics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "ARR", value: fmt(arr), sub: "annualized" },
          { label: "Avg MRR/Client", value: activeOrgs.length > 0 ? fmt(Math.round(totalMRR / activeOrgs.length)) : "$0", sub: "per active client" },
          { label: "Total Clients", value: orgs.length.toString(), sub: `${activeOrgs.length} active · ${onboardingOrgs.length} onboarding · ${churnedOrgs.length} churned` },
        ].map((m) => (
          <div key={m.label} className="card text-center">
            <div className="text-3xl font-display font-bold text-gray-900 mb-1">{m.value}</div>
            <div className="text-sm font-semibold text-gray-700">{m.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* MRR chart */}
      {chartData.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-gray-900">Revenue History</h3>
              <p className="text-sm text-gray-400 mt-0.5">
                {mrrChartData.length > 0 ? "From paid invoices" : "Current MRR snapshot"}
              </p>
            </div>
          </div>
          <MRRChart data={chartData} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by plan */}
        <div className="card">
          <h3 className="font-display font-bold text-gray-900 mb-6">Revenue by Plan</h3>
          {planData.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No active clients yet.</p>
          ) : (
            <div className="space-y-4">
              {planData.map((p) => (
                <div key={p.plan}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-600">{p.plan}</span>
                    <span className="font-semibold text-gray-900">
                      {fmt(p.mrr)}/mo
                      <span className="text-gray-400 font-normal ml-1">({p.count} client{p.count !== 1 ? "s" : ""})</span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: totalMRR > 0 ? `${(p.mrr / totalMRR) * 100}%` : "0%",
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All clients list */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900">All Clients</h3>
          </div>
          {orgs.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No clients yet.</p>
          ) : (
            <div className="space-y-2">
              {orgs.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{o.name}</div>
                    <div className="text-xs text-gray-400">{o.plan} · {o.status.toLowerCase()}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {o.mrr > 0 ? `${fmt(o.mrr)}/mo` : "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
