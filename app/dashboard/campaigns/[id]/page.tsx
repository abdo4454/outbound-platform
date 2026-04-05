import { notFound, redirect } from "next/navigation";
import { getCurrentOrg } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import {
  Mail, TrendingUp, MessageSquare, CalendarCheck,
  ArrowLeft, RefreshCw, XCircle,
} from "lucide-react";
import Link from "next/link";
import { CampaignMetricsChart } from "./campaign-metrics-chart";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "badge-success" },
  PAUSED: { label: "Paused", cls: "badge-warning" },
  COMPLETED: { label: "Completed", cls: "badge-brand" },
  DRAFT: { label: "Draft", cls: "badge-gray" },
  ARCHIVED: { label: "Archived", cls: "badge-gray" },
};

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const org = await getCurrentOrg();
  if (!org) redirect("/sign-in");

  let campaign: Awaited<ReturnType<typeof db.campaign.findFirst>> = null;
  let metrics: Awaited<ReturnType<typeof db.campaignMetric.findMany>> = [];

  try {
    campaign = await db.campaign.findFirst({
      where: { id: params.id, orgId: org.id },
    });

    if (campaign) {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      metrics = await db.campaignMetric.findMany({
        where: { campaignId: campaign.id, date: { gte: ninetyDaysAgo } },
        orderBy: { date: "asc" },
      });
    }
  } catch {
    // DB unavailable
  }

  if (!campaign) notFound();

  // Totals
  const totalSent = metrics.reduce((s, m) => s + m.emailsSent, 0);
  const totalOpens = metrics.reduce((s, m) => s + m.opens, 0);
  const totalReplies = metrics.reduce((s, m) => s + m.replies, 0);
  const totalPositive = metrics.reduce((s, m) => s + m.positiveReplies, 0);
  const totalMeetings = metrics.reduce((s, m) => s + m.meetingsBooked, 0);
  const totalBounces = metrics.reduce((s, m) => s + m.bounces, 0);

  const openRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : "0.0";
  const replyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : "0.0";
  const bounceRate = totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(2) : "0.00";

  // Chart data
  const dailyData = metrics.map((m) => ({
    date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    sent: m.emailsSent,
    opens: m.opens,
    replies: m.replies,
    meetings: m.meetingsBooked,
  }));

  const cfg = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.DRAFT;

  const KPIs = [
    { label: "Emails Sent", value: totalSent.toLocaleString(), icon: Mail, color: "bg-brand-50 text-brand-600" },
    { label: "Open Rate", value: `${openRate}%`, icon: TrendingUp, color: "bg-indigo-50 text-indigo-600" },
    { label: "Reply Rate", value: `${replyRate}%`, icon: MessageSquare, color: "bg-emerald-50 text-emerald-600" },
    { label: "Meetings", value: totalMeetings.toString(), icon: CalendarCheck, color: "bg-amber-50 text-amber-600" },
    { label: "Positive Replies", value: totalPositive.toString(), icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Bounce Rate", value: `${bounceRate}%`, icon: XCircle, color: "bg-red-50 text-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/campaigns"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Campaigns
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={cfg.cls}>{cfg.label}</span>
            {campaign.sendingDomain && (
              <span className="text-sm text-gray-400">{campaign.sendingDomain}</span>
            )}
            {campaign.externalTool && (
              <span className="text-xs text-gray-400 capitalize">{campaign.externalTool}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <RefreshCw className="w-3.5 h-3.5" />
          Synced from {campaign.externalTool ?? "Instantly"} every 15 min
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPIs.map((k) => (
          <div key={k.label} className="card">
            <div className={`w-8 h-8 rounded-lg ${k.color} flex items-center justify-center mb-2`}>
              <k.icon className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-gray-900">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="font-display font-bold text-gray-900 mb-6">Daily Performance — Last 90 Days</h3>
        {dailyData.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-sm text-gray-400">
            No metrics yet — data will appear after the first sync.
          </div>
        ) : (
          <CampaignMetricsChart data={dailyData} />
        )}
      </div>

      {/* Daily breakdown table */}
      {dailyData.length > 0 && (
        <div className="card overflow-hidden">
          <h3 className="font-display font-bold text-gray-900 mb-4">Daily Breakdown</h3>
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-100">
                  {["Date", "Sent", "Opens", "Open %", "Replies", "Reply %", "Meetings", "Bounces"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...metrics].reverse().map((m) => {
                  const openPct = m.emailsSent > 0 ? ((m.opens / m.emailsSent) * 100).toFixed(1) : null;
                  const replyPct = m.emailsSent > 0 ? ((m.replies / m.emailsSent) * 100).toFixed(1) : null;
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{m.emailsSent.toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{m.opens.toLocaleString()}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{openPct ? `${openPct}%` : "—"}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{m.replies}</td>
                      <td className="px-6 py-3 text-sm">
                        {replyPct ? (
                          <span className={parseFloat(replyPct) >= 15 ? "text-green-600 font-semibold" : "text-gray-600"}>
                            {replyPct}%
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-brand-600">
                        {m.meetingsBooked > 0 ? m.meetingsBooked : "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-400">{m.bounces > 0 ? m.bounces : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Config details */}
      {(campaign.targetAudience || campaign.dailyLimit || campaign.startedAt) && (
        <div className="card">
          <h3 className="font-display font-bold text-gray-900 mb-4">Campaign Details</h3>
          <div className="space-y-3 text-sm">
            {campaign.targetAudience && (
              <div className="flex gap-3">
                <span className="text-gray-400 w-32 flex-shrink-0">Target Audience</span>
                <span className="text-gray-900">{campaign.targetAudience}</span>
              </div>
            )}
            {campaign.dailyLimit && (
              <div className="flex gap-3">
                <span className="text-gray-400 w-32 flex-shrink-0">Daily Limit</span>
                <span className="text-gray-900">{campaign.dailyLimit} emails/day</span>
              </div>
            )}
            {campaign.startedAt && (
              <div className="flex gap-3">
                <span className="text-gray-400 w-32 flex-shrink-0">Started</span>
                <span className="text-gray-900">
                  {new Date(campaign.startedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
