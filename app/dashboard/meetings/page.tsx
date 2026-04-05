import { redirect } from "next/navigation";
import { CalendarCheck, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { getCurrentOrg } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

const STATUS_CONFIG = {
  MEETING_BOOKED: { label: "Upcoming", cls: "badge-brand", icon: Clock },
  COMPLETED: { label: "Completed", cls: "badge-success", icon: CheckCircle2 },
  NO_SHOW: { label: "No Show", cls: "badge-gray", icon: XCircle },
  RESCHEDULED: { label: "Rescheduled", cls: "badge-warning", icon: RotateCcw },
};

export default async function MeetingsPage() {
  const org = await getCurrentOrg();
  if (!org) redirect("/sign-in");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let bookedContacts: Awaited<ReturnType<typeof db.contact.findMany>> = [];
  let bookingLogs: Awaited<ReturnType<typeof db.activityLog.findMany>> = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let metrics: any = { _sum: { meetingsBooked: null, meetingsHeld: null, noShows: null } };
  try {
    // Contacts that booked a meeting (populated by Cal.com webhook)
    bookedContacts = await db.contact.findMany({
      where: { orgId: org.id, status: "MEETING_BOOKED" },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    // Booking activity logs for this org
    bookingLogs = await db.activityLog.findMany({
      where: { orgId: org.id, action: { in: ["booking.created", "booking.rescheduled"] } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Aggregate metrics from campaign metrics
    metrics = await db.campaignMetric.aggregate({
      where: { campaign: { orgId: org.id }, date: { gte: thirtyDaysAgo } },
      _sum: { meetingsBooked: true, meetingsHeld: true, noShows: true },
    });
  } catch {
    bookedContacts = [];
    bookingLogs = [];
    metrics = { _sum: { meetingsBooked: null, meetingsHeld: null, noShows: null } };
  }

  const totalMeetings = (metrics._sum?.meetingsBooked ?? 0) as number;
  const completed = (metrics._sum?.meetingsHeld ?? 0) as number;
  const noShows = (metrics._sum?.noShows ?? 0) as number;
  const upcoming = bookedContacts.length;
  const showRate = (completed + noShows) > 0
    ? Math.round((completed / (completed + noShows)) * 100)
    : null;

  const SUMMARY = [
    { label: "This Month", value: totalMeetings.toString(), sub: "total meetings", color: "bg-brand-50 text-brand-600" },
    { label: "Completed", value: completed.toString(), sub: "held this month", color: "bg-green-50 text-green-600" },
    { label: "Show Rate", value: showRate !== null ? `${showRate}%` : "—", sub: "vs 75% avg", color: "bg-emerald-50 text-emerald-600" },
    { label: "Upcoming", value: upcoming.toString(), sub: "scheduled", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY.map((s) => (
          <div key={s.label} className="card">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-600">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-0">
          <h3 className="font-display font-bold text-gray-900">Booked Meetings</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Synced from Cal.com</span>
          </div>
        </div>

        {bookedContacts.length === 0 && bookingLogs.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            No meetings recorded yet. Meetings appear here when prospects book via Cal.com.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prospect</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booked</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookedContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-gray-900">
                        {c.firstName || c.lastName ? `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() : c.email}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {c.jobTitle ? `${c.jobTitle} · ` : ""}{c.company ?? c.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(c.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={STATUS_CONFIG.MEETING_BOOKED.cls}>
                        {STATUS_CONFIG.MEETING_BOOKED.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card bg-brand-50 border-brand-100">
        <div className="flex items-start gap-3">
          <CalendarCheck className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-brand-900">Meetings are synced from Cal.com</p>
            <p className="text-sm text-brand-700 mt-0.5">
              Every booking made through your outbound campaigns is automatically logged here.
              Status updates sync within minutes via webhook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
