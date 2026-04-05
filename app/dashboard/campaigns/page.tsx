import { redirect } from "next/navigation";
import { Mail, TrendingUp, MessageSquare, CalendarCheck, RefreshCw } from "lucide-react";
import { getCurrentOrg } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "badge-success" },
  PAUSED: { label: "Paused", cls: "badge-warning" },
  COMPLETED: { label: "Completed", cls: "badge-brand" },
  DRAFT: { label: "Draft", cls: "badge-gray" },
  ARCHIVED: { label: "Archived", cls: "badge-gray" },
};

export default async function CampaignsPage() {
  const org = await getCurrentOrg();
  if (!org) redirect("/sign-in");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const campaigns = await db.campaign.findMany({
    where: { orgId: org.id },
    include: {
      metrics: { where: { date: { gte: thirtyDaysAgo } } },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => [] as Awaited<ReturnType<typeof db.campaign.findMany<{ include: { metrics: true } }>>>);

  const rows = campaigns.map((c) => {
    const sent = c.metrics.reduce((s, m) => s + m.emailsSent, 0);
    const opens = c.metrics.reduce((s, m) => s + m.opens, 0);
    const replies = c.metrics.reduce((s, m) => s + m.replies, 0);
    const positiveReplies = c.metrics.reduce((s, m) => s + m.positiveReplies, 0);
    const meetings = c.metrics.reduce((s, m) => s + m.meetingsBooked, 0);
    return { id: c.id, name: c.name, status: c.status, sendingDomain: c.sendingDomain, dailyLimit: c.dailyLimit, sent, opens, replies, positiveReplies, meetings, updatedAt: c.updatedAt };
  });

  const totalSent = rows.reduce((s, c) => s + c.sent, 0);
  const totalReplies = rows.reduce((s, c) => s + c.replies, 0);
  const totalPositive = rows.reduce((s, c) => s + c.positiveReplies, 0);
  const totalOpens = rows.reduce((s, c) => s + c.opens, 0);
  const totalMeetings = rows.reduce((s, c) => s + c.meetings, 0);
  const activeCampaigns = rows.filter((c) => c.status === "ACTIVE").length;

  const KPIs = [
    { label: "Emails Sent", value: totalSent.toLocaleString(), icon: Mail, color: "bg-brand-50 text-brand-600" },
    { label: "Reply Rate", value: totalSent > 0 ? `${((totalReplies / totalSent) * 100).toFixed(1)}%` : "—", icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
    { label: "Positive Replies", value: totalPositive.toString(), icon: MessageSquare, color: "bg-emerald-50 text-emerald-600" },
    { label: "Meetings Booked", value: totalMeetings.toString(), icon: CalendarCheck, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIs.map((k) => (
          <div key={k.label} className="card">
            <div className={`w-10 h-10 rounded-xl ${k.color} flex items-center justify-center mb-3`}>
              <k.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h3 className="font-display font-bold text-gray-900">All Campaigns</h3>
            <p className="text-sm text-gray-400 mt-0.5">{activeCampaigns} active · {rows.length} total</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Synced from Instantly · every 15 min</span>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            No campaigns yet. Connect Instantly in{" "}
            <a href="/dashboard/integrations" className="text-brand-600 hover:underline">Integrations</a>{" "}
            to start syncing.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sent</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Open Rate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reply Rate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">+Replies</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Meetings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((c) => {
                  const openRate = c.sent > 0 ? ((c.opens / c.sent) * 100).toFixed(1) : null;
                  const replyRate = c.sent > 0 ? ((c.replies / c.sent) * 100).toFixed(1) : null;
                  const posRate = c.replies > 0 ? ((c.positiveReplies / c.replies) * 100).toFixed(0) : null;
                  const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.DRAFT;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/campaigns/${c.id}`} className="font-medium text-sm text-gray-900 hover:text-brand-600 transition-colors">
                          {c.name}
                        </Link>
                        {c.sendingDomain && (
                          <div className="text-xs text-gray-400 mt-0.5">{c.sendingDomain}{c.dailyLimit ? ` · ${c.dailyLimit}/day limit` : ""}</div>
                        )}
                      </td>
                      <td className="px-6 py-4"><span className={cfg.cls}>{cfg.label}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.sent > 0 ? c.sent.toLocaleString() : "—"}</td>
                      <td className="px-6 py-4">
                        {openRate ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{openRate}%</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-16">
                              <div className="h-full bg-brand-400 rounded-full" style={{ width: `${Math.min(parseFloat(openRate), 100)}%` }} />
                            </div>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {replyRate ? (
                          <span className={`text-sm font-semibold ${parseFloat(replyRate) >= 15 ? "text-green-600" : parseFloat(replyRate) >= 8 ? "text-amber-600" : "text-gray-600"}`}>
                            {replyRate}%
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {posRate ? `${c.positiveReplies} (${posRate}%)` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {c.meetings > 0 ? <span className="font-bold text-brand-600">{c.meetings}</span> : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-100">
                  <td className="px-6 py-3 text-xs font-semibold text-gray-500">Total</td>
                  <td className="px-6 py-3" />
                  <td className="px-6 py-3 text-xs font-semibold text-gray-700">{totalSent.toLocaleString()}</td>
                  <td className="px-6 py-3 text-xs font-semibold text-gray-700">
                    {totalSent > 0 ? `${((totalOpens / totalSent) * 100).toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-6 py-3 text-xs font-semibold text-gray-700">
                    {totalSent > 0 ? `${((totalReplies / totalSent) * 100).toFixed(1)}%` : "—"}
                  </td>
                  <td className="px-6 py-3 text-xs font-semibold text-gray-700">{totalPositive}</td>
                  <td className="px-6 py-3 text-xs font-bold text-brand-600 text-right">{totalMeetings}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="card bg-brand-50 border-brand-100">
        <div className="flex items-start gap-3">
          <RefreshCw className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-brand-800">
            Campaign data syncs from Instantly every 15 minutes.
            To see full sequence details, reply management, and inbox — open{" "}
            <a href="/dashboard/campaign-hub" className="font-semibold underline underline-offset-2">Campaign Hub</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
