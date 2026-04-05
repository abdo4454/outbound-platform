import { redirect } from "next/navigation";
import { FileText, Download, CalendarCheck, Mail, TrendingUp, Clock } from "lucide-react";
import { getCurrentOrg } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { GenerateReportButton } from "./generate-button";

export default async function ReportsPage() {
  const org = await getCurrentOrg();
  if (!org) redirect("/sign-in");

  let reports: Awaited<ReturnType<typeof db.report.findMany>> = [];
  try {
    reports = await db.report.findMany({
      where: { orgId: org.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    reports = [];
  }

  // Next Monday calculation
  const now = new Date();
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  const nextMondayStr = nextMonday.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const daysAway = daysUntilMonday;

  const latest = reports[0];

  return (
    <div className="space-y-6">
      {/* Next report countdown */}
      <div className="card bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Next weekly report: {nextMondayStr}</p>
              <p className="text-brand-100 text-sm mt-0.5">Generated automatically every Monday · view all below</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{daysAway}d</div>
              <div className="text-brand-200 text-xs">until delivery</div>
            </div>
            <GenerateReportButton type="WEEKLY" />
          </div>
        </div>
      </div>

      {/* Latest report highlights */}
      {latest && (() => {
        const d = JSON.parse(latest.data as string) as Record<string, unknown>;
        return (
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-gray-900">Latest Report Highlights</h3>
                <p className="text-sm text-gray-400">{latest.title}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Mail, label: "Emails Sent", value: Number(d.emailsSent ?? 0).toLocaleString(), color: "bg-brand-50 text-brand-600" },
                { icon: TrendingUp, label: "Open Rate", value: `${d.openRate ?? "0"}%`, color: "bg-blue-50 text-blue-600" },
                { icon: TrendingUp, label: "Replies", value: Number(d.replies ?? 0).toLocaleString(), color: "bg-emerald-50 text-emerald-600" },
                { icon: CalendarCheck, label: "Meetings Booked", value: String(d.meetingsBooked ?? 0), color: "bg-amber-50 text-amber-600" },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 rounded-xl p-4">
                  <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center mb-2`}>
                    <m.icon className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{m.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* All reports table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="font-display font-bold text-gray-900">All Reports</h3>
          <div className="flex items-center gap-2">
            <GenerateReportButton type="MONTHLY" />
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-600 mb-1">No reports yet</p>
            <p>Generate your first weekly or monthly report using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Report</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Emails</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Replies</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Meetings</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Generated</th>
                  {/* PDF column reserved for future */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r, i) => {
                  const d = JSON.parse(r.data as string) as Record<string, unknown>;
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">{r.title}</span>
                          {i === 0 && <span className="badge-brand text-xs">Latest</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={r.type === "MONTHLY" ? "badge-success" : "badge-gray"}>
                          {r.type.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {Number(d.emailsSent ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {Number(d.replies ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-brand-600">
                        {String(d.meetingsBooked ?? 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card bg-gray-50 border-0">
        <p className="text-sm text-gray-600">
          Reports are generated from your real campaign metrics. Click "Generate" above to create a report for the current week or month.{" "}
          PDF export and automatic email delivery coming soon.
        </p>
      </div>
    </div>
  );
}
