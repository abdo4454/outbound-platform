import { db } from "@/lib/db";
import { Building2, ArrowUpRight, Plus, Coins } from "lucide-react";
import Link from "next/link";

async function getClients() {
  try {
    return await db.organization.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        campaigns: {
          where: { status: "ACTIVE" },
          select: { id: true },
        },
        members: { select: { id: true, role: true } },
      },
    });
  } catch {
    return [];
  }
}

const DEMO_CLIENTS = [
  { id: "1", name: "Acme SaaS", slug: "acme-saas", plan: "GROWTH", status: "ACTIVE", mrr: 500000, campaigns: 3, lastLogin: "2h ago", health: "green", industry: "DevTools" },
  { id: "2", name: "TechFlow Inc", slug: "techflow", plan: "SCALE", status: "ACTIVE", mrr: 1000000, campaigns: 5, lastLogin: "1d ago", health: "green", industry: "HR Tech" },
  { id: "3", name: "DataStream", slug: "datastream", plan: "STARTER", status: "ACTIVE", mrr: 250000, campaigns: 1, lastLogin: "3d ago", health: "yellow", industry: "Analytics" },
  { id: "4", name: "BuildFast", slug: "buildfast", plan: "GROWTH", status: "ONBOARDING", mrr: 500000, campaigns: 0, lastLogin: "Just now", health: "yellow", industry: "DevTools" },
  { id: "5", name: "FinPlex", slug: "finplex", plan: "GROWTH", status: "ACTIVE", mrr: 500000, campaigns: 2, lastLogin: "5d ago", health: "red", industry: "FinTech" },
  { id: "6", name: "CloudBase", slug: "cloudbase", plan: "STARTER", status: "PAUSED", mrr: 0, campaigns: 0, lastLogin: "2w ago", health: "gray", industry: "Infrastructure" },
];

const PLAN_BADGE: Record<string, string> = {
  STARTER: "badge-gray",
  GROWTH: "badge-brand",
  SCALE: "badge-success",
  ENTERPRISE: "badge-warning",
};

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  ACTIVE: { cls: "badge-success", label: "Active" },
  ONBOARDING: { cls: "badge-warning", label: "Onboarding" },
  PAUSED: { cls: "badge-gray", label: "Paused" },
  CHURNED: { cls: "badge-gray", label: "Churned" },
};

const HEALTH_DOT: Record<string, string> = {
  green: "bg-green-500",
  yellow: "bg-amber-400",
  red: "bg-red-500",
  gray: "bg-gray-300",
};

function formatMoney(cents: number) {
  if (cents === 0) return "—";
  return "$" + (cents / 100).toLocaleString("en-US") + "/mo";
}

export default async function ClientsPage() {
  const dbClients = await getClients();
  const isDemo = dbClients.length === 0;

  type DemoClient = typeof DEMO_CLIENTS[0];
  type DBClient = Awaited<ReturnType<typeof getClients>>[0];
  const clients: (DemoClient | DBClient)[] = isDemo ? DEMO_CLIENTS : dbClients;

  const totalMRR = isDemo
    ? DEMO_CLIENTS.filter(c => c.status === "ACTIVE").reduce((sum, c) => sum + c.mrr, 0)
    : dbClients.reduce((sum, c) => sum + c.mrr, 0);

  const activeCount = isDemo
    ? DEMO_CLIENTS.filter(c => c.status === "ACTIVE").length
    : dbClients.filter(c => c.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-sm text-gray-500">Total clients</span>
            <span className="ml-2 font-bold text-gray-900">{clients.length}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Active</span>
            <span className="ml-2 font-bold text-green-600">{activeCount}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Total MRR</span>
            <span className="ml-2 font-bold text-gray-900">{formatMoney(totalMRR)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
              Demo data
            </span>
          )}
          <Link href="/admin/clients/new" className="btn-primary btn-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Client
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto -mx-6 -mt-6">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">MRR</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaigns</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Health</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isDemo
                ? DEMO_CLIENTS.map((c) => {
                    const statusCfg = STATUS_BADGE[c.status] ?? STATUS_BADGE.ACTIVE;
                    return (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900">{c.name}</div>
                              <div className="text-xs text-gray-400">{c.industry}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={PLAN_BADGE[c.plan] ?? "badge-gray"}>{c.plan}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatMoney(c.mrr)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{c.campaigns}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-400">—</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={statusCfg.cls}>{statusCfg.label}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2.5 h-2.5 rounded-full ${HEALTH_DOT[c.health] ?? "bg-gray-300"}`} />
                            <span className="text-xs text-gray-500 capitalize">{c.health === "green" ? "Healthy" : c.health === "yellow" ? "Attention" : c.health === "red" ? "At Risk" : "Inactive"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/clients/${c.id}`}
                            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                          >
                            View <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                : dbClients.map((c) => {
                    const statusCfg = STATUS_BADGE[c.status] ?? STATUS_BADGE.ACTIVE;
                    const activeCampaigns = c.campaigns.length;
                    return (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900">{c.name}</div>
                              <div className="text-xs text-gray-400">{c.industry ?? c.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={PLAN_BADGE[c.plan] ?? "badge-gray"}>{c.plan}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatMoney(c.mrr)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{activeCampaigns}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-amber-700">
                            <Coins className="w-3.5 h-3.5" />
                            {c.creditBalance.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={statusCfg.cls}>{statusCfg.label}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/clients/${c.id}`}
                            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
                          >
                            View <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health legend */}
      <div className="card bg-gray-50 border-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Health Score Legend</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span>Healthy — campaigns running, meetings tracking to target</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span>Attention — low send volume or onboarding not complete</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span>At Risk — no meetings booked in 14 days or payment issue</span></div>
        </div>
      </div>
    </div>
  );
}
