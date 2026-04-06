import { db } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth-helpers";
import { redirect, notFound } from "next/navigation";
import { DEMO_MODE } from "@/lib/demo-mode";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { CampaignActions } from "./campaign-actions";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "badge-success" },
  PAUSED: { label: "Paused", cls: "badge-warning" },
  DRAFT: { label: "Draft", cls: "badge-gray" },
  COMPLETED: { label: "Completed", cls: "badge-brand" },
  ARCHIVED: { label: "Archived", cls: "badge-gray" },
};

const TYPE_LABEL: Record<string, string> = {
  COLD_EMAIL: "Cold Email",
  LINKEDIN: "LinkedIn",
  MULTI_CHANNEL: "Multi-channel",
};

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") redirect("/dashboard");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const campaign = DEMO_MODE
    ? null
    : await db.campaign
        .findUnique({
          where: { id: params.id },
          include: {
            org: { select: { id: true, name: true, plan: true } },
            metrics: {
              where: { date: { gte: thirtyDaysAgo } },
              orderBy: { date: "asc" },
            },
            sequences: true,
          },
        })
        .catch(() => null);

  if (!DEMO_MODE && !campaign) notFound();

  // Aggregate 30-day metrics
  const metrics = campaign?.metrics ?? [];
  const sent = metrics.reduce((s, m) => s + m.emailsSent, 0);
  const opens = metrics.reduce((s, m) => s + m.opens, 0);
  const replies = metrics.reduce((s, m) => s + m.replies, 0);
  const positiveReplies = metrics.reduce((s, m) => s + m.positiveReplies, 0);
  const meetings = metrics.reduce((s, m) => s + m.meetingsBooked, 0);
  const bounces = metrics.reduce((s, m) => s + m.bounces, 0);

  const openRate = sent > 0 ? ((opens / sent) * 100).toFixed(1) : null;
  const replyRate = sent > 0 ? ((replies / sent) * 100).toFixed(1) : null;
  const bounceRate = sent > 0 ? ((bounces / sent) * 100).toFixed(1) : null;

  const cfg = STATUS_CONFIG[campaign?.status ?? "DRAFT"] ?? STATUS_CONFIG.DRAFT;

  // For demo mode, show placeholder
  if (DEMO_MODE) {
    return (
      <div className="space-y-6">
        <Link href="/admin/outbound" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back to Outbound
        </Link>
        <div className="card py-16 text-center text-gray-400">
          Campaign detail — connect your database to view live data.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/outbound" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to Outbound
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display font-bold text-2xl text-gray-900">{campaign!.name}</h1>
            <span className={cfg.cls}>{cfg.label}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{TYPE_LABEL[campaign!.type] ?? campaign!.type}</span>
            <span>·</span>
            <Link href={`/admin/clients/${campaign!.org.id}`} className="text-brand-600 hover:underline">
              {campaign!.org.name}
            </Link>
            <span>·</span>
            <span>{campaign!.org.plan} plan</span>
            {campaign!.externalTool && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Synced from {campaign!.externalTool}
                </span>
              </>
            )}
          </div>
        </div>
        <CampaignActions
          campaignId={campaign!.id}
          currentStatus={campaign!.status as "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED"}
        />
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Sent (30d)", value: sent.toLocaleString(), icon: Mail, sub: null },
          { label: "Open rate", value: openRate ? `${openRate}%` : "—", icon: TrendingUp, sub: `${opens.toLocaleString()} opens` },
          { label: "Reply rate", value: replyRate ? `${replyRate}%` : "—", icon: MessageSquare, sub: `${replies} total · ${positiveReplies} positive` },
          { label: "Meetings booked", value: meetings.toString(), icon: Calendar, sub: bounceRate ? `${bounceRate}% bounce` : null },
        ].map((m) => (
          <div key={m.label} className="card">
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <m.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div className="text-sm text-gray-500">{m.label}</div>
            {m.sub && <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Config details */}
      <div className="card">
        <h3 className="font-display font-bold text-gray-900 mb-4">Configuration</h3>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          {[
            { label: "Sending email", value: campaign!.sendingEmail ?? "—" },
            { label: "Sending domain", value: campaign!.sendingDomain ?? "—" },
            { label: "Daily limit", value: campaign!.dailyLimit ? `${campaign!.dailyLimit} emails/day` : "—" },
            { label: "External ID", value: campaign!.externalId ?? "Not pushed to Instantly" },
            { label: "Created", value: new Date(campaign!.createdAt).toLocaleDateString() },
            { label: "Started", value: campaign!.startedAt ? new Date(campaign!.startedAt).toLocaleDateString() : "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</dt>
              <dd className="text-gray-900 font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        {campaign!.targetAudience && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target audience</dt>
            <dd className="text-sm text-gray-700">{campaign!.targetAudience}</dd>
          </div>
        )}
      </div>

      {/* Sequences */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-gray-900">Sequences</h3>
          {campaign!.externalId && (
            <a
              href={`${process.env.NEXT_PUBLIC_INSTANTLY_URL ?? "https://app.instantly.ai"}/campaign/${campaign!.externalId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-sm flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Edit in Instantly
            </a>
          )}
        </div>

        {campaign!.sequences.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            No sequences yet.
            {campaign!.externalId
              ? " Add sequences in the Campaign Hub (Instantly)."
              : " Push this campaign to Instantly first to add sequences."}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {campaign!.sequences.map((seq) => (
              <div key={seq.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{seq.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {(() => {
                      const steps = JSON.parse(seq.steps || "[]") as unknown[];
                      return `${steps.length} step${steps.length !== 1 ? "s" : ""}`;
                    })()}
                  </div>
                </div>
                <span className={seq.status === "active" ? "badge-success" : "badge-gray"}>
                  {seq.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily metrics chart (simple table) */}
      {metrics.length > 0 && (
        <div className="card">
          <h3 className="font-display font-bold text-gray-900 mb-4">Daily metrics (30d)</h3>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  {["Date", "Sent", "Opens", "Replies", "+Replies", "Meetings"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {metrics.slice(-14).map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-2.5 text-gray-600">
                      {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-2.5 text-gray-900">{m.emailsSent || "—"}</td>
                    <td className="px-6 py-2.5 text-gray-600">{m.opens || "—"}</td>
                    <td className="px-6 py-2.5 text-gray-600">{m.replies || "—"}</td>
                    <td className="px-6 py-2.5 text-green-600">{m.positiveReplies || "—"}</td>
                    <td className="px-6 py-2.5 font-bold text-gray-900">{m.meetingsBooked || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
