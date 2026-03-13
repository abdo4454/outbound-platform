import { DollarSign, Users, TrendingUp, AlertTriangle } from "lucide-react";

// In production, all data comes from DB queries
const ADMIN_METRICS = {
  mrr: { value: "$47,500", change: "+$5,000 this month" },
  activeClients: { value: "12", change: "2 onboarding" },
  totalMeetings: { value: "247", change: "+34 this week" },
  alerts: { value: "3", change: "Requires attention" },
};

const CLIENTS = [
  { name: "Acme Corp", plan: "Scale", mrr: "$10,000", status: "active", health: 92, meetings: 47 },
  { name: "TechFlow", plan: "Growth", mrr: "$5,000", status: "active", health: 88, meetings: 34 },
  { name: "Meridian", plan: "Growth", mrr: "$5,000", status: "active", health: 76, meetings: 23 },
  { name: "NovaStar", plan: "Starter", mrr: "$2,500", status: "active", health: 94, meetings: 18 },
  { name: "Zenith AI", plan: "Scale", mrr: "$10,000", status: "onboarding", health: 0, meetings: 0 },
  { name: "CloudBase", plan: "Growth", mrr: "$5,000", status: "active", health: 65, meetings: 11 },
];

function HealthBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-gray-500">{score}%</span>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="section py-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Internal operations overview</p>
        </div>
      </div>

      <div className="section py-8 space-y-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: DollarSign, label: "Monthly Recurring Revenue", ...ADMIN_METRICS.mrr },
            { icon: Users, label: "Active Clients", ...ADMIN_METRICS.activeClients },
            { icon: TrendingUp, label: "Meetings Booked (All Clients)", ...ADMIN_METRICS.totalMeetings },
            { icon: AlertTriangle, label: "Active Alerts", ...ADMIN_METRICS.alerts },
          ].map((metric) => (
            <div key={metric.label} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <metric.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-gray-500">{metric.label}</div>
              <div className="text-xs text-gray-400 mt-1">{metric.change}</div>
            </div>
          ))}
        </div>

        {/* Client Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg text-gray-900">All Clients</h2>
            <button className="btn-primary btn-sm">Add Client</button>
          </div>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">MRR</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Health</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Meetings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CLIENTS.map((client) => (
                  <tr key={client.name} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium text-sm text-gray-900">{client.name}</td>
                    <td className="px-6 py-4"><span className="badge-brand">{client.plan}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{client.mrr}</td>
                    <td className="px-6 py-4">
                      <span className={client.status === "active" ? "badge-success" : "badge-warning"}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {client.health > 0 ? <HealthBar score={client.health} /> : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {client.meetings || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
