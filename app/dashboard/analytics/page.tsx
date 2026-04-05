import { redirect } from "next/navigation";
import { getCurrentOrg } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { AnalyticsChart } from "./analytics-chart";

export default async function AnalyticsPage() {
  const org = await getCurrentOrg();
  if (!org) redirect("/sign-in");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let metrics: Awaited<ReturnType<typeof db.campaignMetric.findMany>> = [];
  try {
    metrics = await db.campaignMetric.findMany({
      where: {
        campaign: { orgId: org.id },
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: "asc" },
    });
  } catch {
    metrics = [];
  }

  // Aggregate by date
  const byDate: Record<string, { sent: number; replies: number; meetings: number }> = {};
  for (const m of metrics) {
    const key = new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!byDate[key]) byDate[key] = { sent: 0, replies: 0, meetings: 0 };
    byDate[key].sent += m.emailsSent;
    byDate[key].replies += m.replies;
    byDate[key].meetings += m.meetingsBooked;
  }
  const dailyData = Object.entries(byDate).map(([date, vals]) => ({ date, ...vals }));

  const totalSent = metrics.reduce((s, m) => s + m.emailsSent, 0);
  const totalOpens = metrics.reduce((s, m) => s + m.opens, 0);
  const totalReplies = metrics.reduce((s, m) => s + m.replies, 0);

  const avgOpenRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : "0.0";
  const avgReplyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Sent (30d)", value: totalSent.toLocaleString() },
          { label: "Avg Open Rate", value: `${avgOpenRate}%` },
          { label: "Avg Reply Rate", value: `${avgReplyRate}%` },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-display font-bold text-gray-900 mb-6">Daily Performance — Last 30 Days</h3>
        {dailyData.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-sm text-gray-400">
            No data yet. Metrics will appear once your campaigns start sending.
          </div>
        ) : (
          <AnalyticsChart data={dailyData} />
        )}
      </div>

      {dailyData.length > 0 && (
        <div className="card overflow-hidden">
          <h3 className="font-display font-bold text-gray-900 mb-4">Daily Breakdown</h3>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Emails Sent</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Replies</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Meetings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dailyData.map((d) => (
                  <tr key={d.date} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-sm text-gray-900">{d.date}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{d.sent.toLocaleString()}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{d.replies}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">{d.meetings || "—"}</td>
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
