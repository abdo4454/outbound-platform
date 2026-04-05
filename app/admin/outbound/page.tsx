import { db } from "@/lib/db";
import { Search, Mail, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "badge-success" },
  PAUSED: { label: "Paused", cls: "badge-warning" },
  DRAFT: { label: "Draft", cls: "badge-gray" },
  COMPLETED: { label: "Completed", cls: "badge-brand" },
  ARCHIVED: { label: "Archived", cls: "badge-gray" },
};

export default async function OutboundPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [campaigns, onboardings] = await Promise.all([
    db.campaign.findMany({
      include: {
        metrics: { where: { date: { gte: thirtyDaysAgo } } },
        org: { select: { name: true, id: true } },
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
    db.onboarding.findMany({
      where: {
        OR: [
          { targetTitles: { not: "[]" } },
          { targetIndustries: { not: "[]" } },
        ],
      },
      include: { org: { select: { name: true, id: true } } },
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
  ]);

  const rows = campaigns.map((c) => {
    const sent = c.metrics.reduce((s, m) => s + m.emailsSent, 0);
    const opens = c.metrics.reduce((s, m) => s + m.opens, 0);
    const replies = c.metrics.reduce((s, m) => s + m.replies, 0);
    const meetings = c.metrics.reduce((s, m) => s + m.meetingsBooked, 0);
    return { ...c, sent, opens, replies, meetings };
  });

  const totalSent = rows.reduce((s, c) => s + c.sent, 0);
  const totalReplies = rows.reduce((s, c) => s + c.replies, 0);
  const totalMeetings = rows.reduce((s, c) => s + c.meetings, 0);
  const avgReplyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sent (30d)", value: totalSent.toLocaleString(), icon: Mail },
          { label: "Replies (30d)", value: totalReplies.toLocaleString(), icon: ArrowUpRight },
          { label: "Reply Rate", value: `${avgReplyRate}%`, icon: Search },
          { label: "Meetings Booked", value: totalMeetings.toString(), icon: Users },
        ].map((m) => (
          <div key={m.label} className="card">
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <m.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div className="text-sm text-gray-500">{m.label}</div>
          </div>
        ))}
      </div>

      {/* All campaigns across clients */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-gray-900">All Client Campaigns</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {rows.filter((c) => c.status === "ACTIVE").length} active · {rows.length} total · synced from Instantly every 15 min
            </p>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            No campaigns yet. Connect Instantly or Apollo in each{" "}
            <Link href="/admin/clients" className="text-brand-600 hover:underline">client profile</Link> to start syncing.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  {["Campaign", "Client", "Status", "Sent", "Open Rate", "Reply Rate", "Meetings"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((c) => {
                  const openRate = c.sent > 0 ? ((c.opens / c.sent) * 100).toFixed(1) : null;
                  const replyRate = c.sent > 0 ? ((c.replies / c.sent) * 100).toFixed(1) : null;
                  const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.DRAFT;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-gray-900">{c.name}</div>
                        {c.sendingDomain && <div className="text-xs text-gray-400 mt-0.5">{c.sendingDomain}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/clients/${c.org.id}`} className="text-sm text-brand-600 hover:underline">
                          {c.org.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4"><span className={cfg.cls}>{cfg.label}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.sent > 0 ? c.sent.toLocaleString() : "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{openRate ? `${openRate}%` : "—"}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {replyRate ? (
                          <span className={parseFloat(replyRate) >= 15 ? "text-green-600" : "text-gray-600"}>
                            {replyRate}%
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {c.meetings > 0 ? c.meetings : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ICP Segments from onboarding data */}
      {onboardings.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-gray-900">ICP Prospect Segments</h3>
              <p className="text-sm text-gray-500 mt-0.5">From client onboarding — targeting criteria per account</p>
            </div>
          </div>
          <div className="space-y-4">
            {onboardings.map((o) => (
              <div key={o.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/admin/clients/${o.org.id}`} className="font-semibold text-sm text-brand-600 hover:underline">
                      {o.org.name}
                    </Link>
                  </div>
                  {(() => {
                    const titles: string[] = JSON.parse(o.targetTitles || "[]");
                    const industries: string[] = JSON.parse(o.targetIndustries || "[]");
                    const sizes: string[] = JSON.parse(o.targetCompanySizes || "[]");
                    const geos: string[] = JSON.parse(o.targetGeographies || "[]");
                    return (
                      <div className="text-xs text-gray-500 space-y-0.5">
                        {titles.length > 0 && (
                          <div><span className="font-medium text-gray-700">Titles:</span> {titles.join(", ")}</div>
                        )}
                        {industries.length > 0 && (
                          <div><span className="font-medium text-gray-700">Industries:</span> {industries.join(", ")}</div>
                        )}
                        {sizes.length > 0 && (
                          <div><span className="font-medium text-gray-700">Size:</span> {sizes.join(", ")}</div>
                        )}
                        {geos.length > 0 && (
                          <div><span className="font-medium text-gray-700">Geo:</span> {geos.join(", ")}</div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
