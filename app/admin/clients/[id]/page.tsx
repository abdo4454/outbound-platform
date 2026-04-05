import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, CalendarCheck, TrendingUp } from "lucide-react";
import { IntegrationsPanel } from "./integrations-panel";
import { CreditsPanel } from "./credits-panel";

function formatMoney(cents: number) {
  return "$" + (cents / 100).toLocaleString("en-US") + "/mo";
}

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  ACTIVE: { cls: "badge-success", label: "Active" },
  ONBOARDING: { cls: "badge-warning", label: "Onboarding" },
  PAUSED: { cls: "badge-gray", label: "Paused" },
  CHURNED: { cls: "badge-gray", label: "Churned" },
};

const CAMPAIGN_STATUS: Record<string, { cls: string; label: string }> = {
  ACTIVE: { cls: "badge-success", label: "Active" },
  PAUSED: { cls: "badge-warning", label: "Paused" },
  DRAFT: { cls: "badge-gray", label: "Draft" },
  COMPLETED: { cls: "badge-brand", label: "Completed" },
  ARCHIVED: { cls: "badge-gray", label: "Archived" },
};

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const org = await db.organization.findUnique({
    where: { id: params.id },
    include: {
      campaigns: {
        include: { metrics: { where: { date: { gte: thirtyDaysAgo } } } },
        orderBy: { createdAt: "desc" },
      },
      integrations: {
        select: {
          id: true,
          type: true,
          status: true,
          lastSyncAt: true,
          lastSyncStatus: true,
          lastSyncError: true,
          // accessToken is intentionally excluded — never sent to browser
        },
        orderBy: { type: "asc" },
      },
      members: { orderBy: { createdAt: "asc" } },
      onboarding: true,
    },
  });

  if (!org) notFound();

  const totals = org.campaigns.reduce(
    (acc, c) => ({
      sent: acc.sent + c.metrics.reduce((s, m) => s + m.emailsSent, 0),
      replies: acc.replies + c.metrics.reduce((s, m) => s + m.replies, 0),
      meetings: acc.meetings + c.metrics.reduce((s, m) => s + m.meetingsBooked, 0),
    }),
    { sent: 0, replies: 0, meetings: 0 }
  );

  const statusCfg = STATUS_BADGE[org.status] ?? STATUS_BADGE.ACTIVE;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/clients" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">{org.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {org.plan} plan · <span className={statusCfg.cls}>{statusCfg.label}</span>
              {org.mrr > 0 && <span className="ml-2">{formatMoney(org.mrr)}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Campaign metrics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Mail, label: "Emails Sent (30d)", value: totals.sent.toLocaleString() },
          { icon: TrendingUp, label: "Replies (30d)", value: totals.replies.toLocaleString() },
          { icon: CalendarCheck, label: "Meetings Booked (30d)", value: totals.meetings.toString() },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-brand-600" />
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value || "0"}</div>
          </div>
        ))}
      </div>

      {/* Campaigns */}
      <div className="card">
        <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
          Campaigns <span className="text-sm font-normal text-gray-400 ml-1">({org.campaigns.length})</span>
        </h2>
        {org.campaigns.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">
            No campaigns yet — connect Instantly or Apollo below to start syncing.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-100">
                  {["Campaign", "Status", "Sent", "Replies", "Meetings"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {org.campaigns.map((c) => {
                  const sent = c.metrics.reduce((s, m) => s + m.emailsSent, 0);
                  const replies = c.metrics.reduce((s, m) => s + m.replies, 0);
                  const meetings = c.metrics.reduce((s, m) => s + m.meetingsBooked, 0);
                  const cfg = CAMPAIGN_STATUS[c.status] ?? CAMPAIGN_STATUS.DRAFT;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3">
                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        {c.externalTool && <div className="text-xs text-gray-400">via {c.externalTool}</div>}
                      </td>
                      <td className="px-6 py-3"><span className={cfg.cls}>{cfg.label}</span></td>
                      <td className="px-6 py-3 text-sm text-gray-600">{sent > 0 ? sent.toLocaleString() : "—"}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{replies > 0 ? replies : "—"}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-brand-600">{meetings > 0 ? meetings : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Outbound Tool Integrations — admin only */}
      <div className="card">
        <div className="mb-4">
          <h2 className="font-display font-bold text-lg text-gray-900">Outbound Tools</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Connect this client&apos;s Instantly or Apollo account so campaign data syncs every 15 minutes.
            Keys are encrypted at rest.
          </p>
        </div>
        <IntegrationsPanel
          clientId={org.id}
          initialIntegrations={org.integrations.map((i) => ({
            ...i,
            lastSyncAt: i.lastSyncAt?.toISOString() ?? null,
          }))}
        />
      </div>

      {/* Team */}
      <div className="card">
        <h2 className="font-display font-bold text-lg text-gray-900 mb-4">
          Client Users <span className="text-sm font-normal text-gray-400 ml-1">({org.members.length})</span>
        </h2>
        {org.members.length === 0 ? (
          <p className="text-sm text-gray-400">No users yet. Send an invite to add the client.</p>
        ) : (
          <div className="space-y-3">
            {org.members.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{m.name}</div>
                  <div className="text-xs text-gray-400">{m.email}</div>
                </div>
                <span className="badge-brand">{m.role.replace("_", " ").toLowerCase()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Credits */}
      <div className="card">
        <div className="mb-5">
          <h2 className="font-display font-bold text-lg text-gray-900">Data Credits</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Credits let this client unlock contact details from the global database (email + phone).
          </p>
        </div>
        <CreditsPanel clientId={org.id} initialBalance={org.creditBalance} />
      </div>

      {/* Onboarding */}
      {org.onboarding && (
        <div className="card">
          <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Onboarding Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "ICP", done: org.onboarding.icpComplete },
              { label: "Messaging", done: org.onboarding.messagingComplete },
              { label: "Domain", done: org.onboarding.domainComplete },
              { label: "Approval", done: org.onboarding.approvalComplete },
            ].map((s) => (
              <div
                key={s.label}
                className={`rounded-xl px-4 py-3 text-sm font-medium text-center ${
                  s.done ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"
                }`}
              >
                {s.label} {s.done ? "✓" : "—"}
              </div>
            ))}
          </div>
          {(() => {
            const titles: string[] = JSON.parse(org.onboarding.targetTitles || "[]");
            return titles.length > 0 ? (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Target Titles</p>
                <div className="flex flex-wrap gap-2">
                  {titles.map((t) => (
                    <span key={t} className="text-xs bg-brand-50 text-brand-700 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
