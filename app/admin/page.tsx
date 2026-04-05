import { DollarSign, Users, CalendarCheck, TrendingUp, ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

// Predictable Revenue funnel stages
const PR_STAGES = [
  { label: "Prospects Sourced", key: "prospects", color: "bg-gray-400" },
  { label: "Emails Sent", key: "emails", color: "bg-blue-500" },
  { label: "Replies", key: "replies", color: "bg-indigo-500" },
  { label: "Discovery Calls", key: "discovery", color: "bg-brand-500" },
  { label: "Proposals Sent", key: "proposals", color: "bg-amber-500" },
  { label: "Closed Won", key: "closed", color: "bg-green-500" },
];

async function getStats() {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [totalLeads, newLeads, wonDeals, openDeals, monthMetrics] = await Promise.all([
      db.lead.count(),
      db.lead.count({ where: { status: "NEW" } }),
      db.deal.findMany({ where: { stage: "CLOSED_WON" } }),
      db.deal.findMany({ where: { stage: { not: "CLOSED_WON" } } }),
      db.campaignMetric.aggregate({
        where: { date: { gte: monthStart } },
        _sum: { emailsSent: true, replies: true, meetingsBooked: true },
      }),
    ]);

    const wonMRR = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);

    return {
      totalLeads,
      newLeads,
      wonMRR,
      pipelineValue,
      wonDeals: wonDeals.length,
      monthSent: monthMetrics._sum.emailsSent ?? 0,
      monthReplies: monthMetrics._sum.replies ?? 0,
      monthMeetings: monthMetrics._sum.meetingsBooked ?? 0,
    };
  } catch {
    return { totalLeads: 0, newLeads: 0, wonMRR: 0, pipelineValue: 0, wonDeals: 0, monthSent: 0, monthReplies: 0, monthMeetings: 0 };
  }
}

async function getRecentLeads() {
  try {
    return await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch {
    return [];
  }
}

// Predictable Revenue funnel math (demo if no real data)
const DEMO_FUNNEL = [
  { label: "Prospects Sourced", value: 500, sublabel: "this month", color: "bg-gray-300" },
  { label: "Emails Sent", value: 480, sublabel: "96% delivery", color: "bg-blue-400" },
  { label: "Replies", value: 72, sublabel: "15% reply rate", color: "bg-indigo-500" },
  { label: "Discovery Calls", value: 24, sublabel: "33% qualified", color: "bg-brand-500" },
  { label: "Proposals Sent", value: 12, sublabel: "50% → proposal", color: "bg-amber-500" },
  { label: "Closed Won", value: 3, sublabel: "25% close rate", color: "bg-green-500" },
];

function formatMoney(cents: number) {
  if (cents === 0) return "$0";
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 });
}

function formatTimeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  NEW: { label: "New", cls: "badge-brand" },
  CONTACTED: { label: "Contacted", cls: "badge-warning" },
  QUALIFIED: { label: "Qualified", cls: "badge-success" },
  DISCOVERY_BOOKED: { label: "Discovery Booked", cls: "badge-success" },
  PROPOSAL_SENT: { label: "Proposal Sent", cls: "badge-warning" },
  WON: { label: "Won", cls: "badge-success" },
  LOST: { label: "Lost", cls: "badge-gray" },
};

export default async function AdminOverviewPage() {
  const [stats, recentLeads] = await Promise.all([getStats(), getRecentLeads()]);

  const hasRealData = stats.totalLeads > 0 || stats.monthSent > 0;

  // Build funnel from real data when available
  const replyRate = stats.monthSent > 0 ? ((stats.monthReplies / stats.monthSent) * 100).toFixed(0) : "15";
  const funnelData = hasRealData
    ? [
        { label: "Emails Sent", value: stats.monthSent, sublabel: "this month", color: "bg-blue-400" },
        { label: "Replies", value: stats.monthReplies, sublabel: `${replyRate}% reply rate`, color: "bg-indigo-500" },
        { label: "Discovery Calls", value: stats.monthMeetings, sublabel: "meetings booked", color: "bg-brand-500" },
        { label: "Leads in DB", value: stats.totalLeads, sublabel: "all-time", color: "bg-amber-500" },
        { label: "Pipeline Deals", value: stats.wonDeals + (stats.pipelineValue > 0 ? 1 : 0), sublabel: `${stats.wonDeals} closed won`, color: "bg-green-500" },
      ]
    : DEMO_FUNNEL;

  return (
    <div className="space-y-8">
      {/* Predictable Revenue Formula */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900">
              Predictable Revenue Funnel
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">This month · outbound + inbound combined</p>
          </div>
          <Link href="/admin/outbound" className="btn-ghost btn-sm text-brand-600">
            Manage outbound →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {funnelData.map((stage, i) => (
            <div key={stage.label} className="text-center">
              <div className="text-3xl font-display font-bold text-gray-900 mb-1">
                {stage.value}
              </div>
              <div className="text-xs font-semibold text-gray-700 mb-1">{stage.label}</div>
              <div className="text-xs text-gray-400 mb-2">{stage.sublabel}</div>
              <div className={`h-1.5 rounded-full ${stage.color}`} />
              {i < DEMO_FUNNEL.length - 1 && (
                <div className="hidden lg:flex items-center justify-center mt-2">
                  <ArrowUpRight className="w-3 h-3 text-gray-300 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* PR formula */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            <span className="font-semibold text-gray-600">Predictable Revenue formula: </span>
            500 prospects × 15% reply rate × 33% booking rate × 25% close rate × $5,000/mo =&nbsp;
            <span className="font-bold text-green-600">$15,000 new MRR this month</span>
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            label: "Total Leads",
            value: hasRealData ? stats.totalLeads.toString() : "—",
            sub: hasRealData ? `${stats.newLeads} new this week` : "No DB connected",
            color: "bg-blue-50 text-blue-600",
          },
          {
            icon: CalendarCheck,
            label: "Meetings Booked",
            value: "24",
            sub: "This month",
            color: "bg-brand-50 text-brand-600",
          },
          {
            icon: DollarSign,
            label: "Pipeline Value",
            value: hasRealData ? formatMoney(stats.pipelineValue) : "$120k",
            sub: "Open deals",
            color: "bg-amber-50 text-amber-600",
          },
          {
            icon: TrendingUp,
            label: "Closed Won MRR",
            value: hasRealData ? formatMoney(stats.wonMRR) : "$15k",
            sub: "This month",
            color: "bg-green-50 text-green-600",
          },
        ].map((m) => (
          <div key={m.label} className="card">
            <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center mb-3`}>
              <m.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div className="text-sm text-gray-600">{m.label}</div>
            <div className="text-xs text-gray-400 mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Two columns: Recent leads + outbound activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900">Recent Inbound Leads</h3>
            <Link href="/admin/leads" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No leads yet. Share your site to start capturing.</p>
              <Link href="/" className="text-brand-600 text-sm hover:underline mt-1 inline-block">
                View your landing page →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => {
                const cfg = STATUS_LABELS[lead.status] ?? STATUS_LABELS.NEW;
                return (
                  <div key={lead.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{lead.name || lead.email}</div>
                      <div className="text-xs text-gray-400">{lead.company || lead.email} · {formatTimeAgo(lead.createdAt)}</div>
                    </div>
                    <span className={cfg.cls}>{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly cadence */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900">This Week&apos;s Outbound</h3>
            <Link href="/admin/outbound" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { label: "Emails sent", value: stats.monthSent, target: 500, color: "bg-indigo-500" },
              { label: "Replies received", value: stats.monthReplies, target: Math.max(20, Math.round(stats.monthSent * 0.15)), color: "bg-brand-500" },
              { label: "Meetings booked", value: stats.monthMeetings, target: 20, color: "bg-green-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">
                    {item.value} <span className="text-gray-400 font-normal">/ {item.target}</span>
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${Math.min(100, (item.value / item.target) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-600" />
              <p className="text-sm text-gray-600">
                {stats.monthMeetings > 0
                  ? <><span className="font-semibold text-green-600">{stats.monthMeetings} meetings</span> booked this month</>
                  : "Meetings will appear here as campaigns run"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
