import { db } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { Activity } from "lucide-react";
import Link from "next/link";
import { ActivityFilters } from "./activity-filters";

const PAGE_SIZE = 50;

const ACTION_LABELS: Record<string, string> = {
  "booking.created": "Meeting booked",
  "booking.cancelled": "Meeting cancelled",
  "booking.rescheduled": "Meeting rescheduled",
  "lead.created": "New lead",
  "deal.created": "Deal created",
  "deal.stage_changed": "Deal stage changed",
  "deal.won": "Deal won",
  "deal.lost": "Deal lost",
  "campaign.launched": "Campaign launched",
  "campaign.paused": "Campaign paused",
  "org.created": "Org created",
  "org.status_changed": "Org status changed",
  "subscription.created": "Subscription started",
  "subscription.updated": "Subscription updated",
  "subscription.cancelled": "Subscription cancelled",
  "invoice.paid": "Invoice paid",
  "invoice.failed": "Invoice failed",
  "member.role_changed": "Member role changed",
};

const ACTION_COLORS: Record<string, string> = {
  "booking.created": "bg-green-100 text-green-700",
  "booking.cancelled": "bg-red-100 text-red-700",
  "booking.rescheduled": "bg-amber-100 text-amber-700",
  "lead.created": "bg-brand-100 text-brand-700",
  "deal.won": "bg-green-100 text-green-700",
  "deal.lost": "bg-red-100 text-red-700",
  "invoice.failed": "bg-red-100 text-red-700",
  "invoice.paid": "bg-green-100 text-green-700",
  "subscription.cancelled": "bg-red-100 text-red-700",
};

function getActionColor(action: string): string {
  return ACTION_COLORS[action] ?? "bg-gray-100 text-gray-600";
}

function buildHref(params: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  if (params.org) p.set("org", params.org);
  if (params.action) p.set("action", params.action);
  if (params.page) p.set("page", params.page);
  const s = p.toString();
  return `/admin/activity${s ? `?${s}` : ""}`;
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams?: { org?: string; action?: string; page?: string };
}) {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") redirect("/dashboard");

  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10));
  const orgFilter = searchParams?.org;
  const actionFilter = searchParams?.action;

  const [logs, orgs, total] = await Promise.all([
    db.activityLog.findMany({
      where: {
        ...(orgFilter ? { orgId: orgFilter } : {}),
        ...(actionFilter ? { action: actionFilter } : {}),
      },
      include: {
        org: { select: { id: true, name: true } },
        member: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }).catch(() => []),
    db.organization.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }).catch(() => []),
    db.activityLog.count({
      where: {
        ...(orgFilter ? { orgId: orgFilter } : {}),
        ...(actionFilter ? { action: actionFilter } : {}),
      },
    }).catch(() => 0),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Events", value: total.toLocaleString() },
          { label: "This Page", value: logs.length.toString() },
          { label: "Active Filters", value: [orgFilter, actionFilter].filter(Boolean).length.toString() },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters (client component for interactive select) */}
      <ActivityFilters
        orgs={orgs}
        orgFilter={orgFilter}
        actionFilter={actionFilter}
      />

      {/* Activity table */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 p-6 pb-0">
          <Activity className="w-4 h-4 text-gray-400" />
          <h3 className="font-display font-bold text-gray-900">
            Activity Log
            {total > 0 && (
              <span className="text-sm font-normal text-gray-400 ml-2">
                {((page - 1) * PAGE_SIZE + 1).toLocaleString()}–{Math.min(page * PAGE_SIZE, total).toLocaleString()} of {total.toLocaleString()}
              </span>
            )}
          </h3>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            <Activity className="w-8 h-8 mx-auto mb-3 opacity-30" />
            No activity found{orgFilter || actionFilter ? " for these filters" : ""}.
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => {
                  const details = log.details as Record<string, unknown> | null;
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={buildHref({ org: log.orgId, action: actionFilter })}
                          className="text-sm text-brand-600 hover:underline font-medium"
                        >
                          {log.org.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.member ? (
                          <div>
                            <div className="font-medium text-gray-900">{log.member.name}</div>
                            <div className="text-xs text-gray-400">{log.member.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">System</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        {details ? (
                          <span className="text-xs font-mono bg-gray-50 px-2 py-1 rounded text-gray-600 truncate block">
                            {Object.entries(details)
                              .slice(0, 3)
                              .map(([k, v]) => `${k}: ${String(v)}`)
                              .join(" · ")}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 text-right whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        <span className="text-gray-300">
                          {new Date(log.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildHref({ org: orgFilter, action: actionFilter, page: String(page - 1) })}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildHref({ org: orgFilter, action: actionFilter, page: String(page + 1) })}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
