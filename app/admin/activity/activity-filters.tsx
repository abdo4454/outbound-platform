"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Filter } from "lucide-react";

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

interface Props {
  orgs: { id: string; name: string }[];
  orgFilter?: string;
  actionFilter?: string;
}

function buildHref(params: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  if (params.org) p.set("org", params.org);
  if (params.action) p.set("action", params.action);
  if (params.page) p.set("page", params.page);
  const s = p.toString();
  return `/admin/activity${s ? `?${s}` : ""}`;
}

export function ActivityFilters({ orgs, orgFilter, actionFilter }: Props) {
  const router = useRouter();

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="font-semibold text-sm text-gray-700">Filters</span>
        {(orgFilter || actionFilter) && (
          <Link href="/admin/activity" className="ml-auto text-xs text-brand-600 hover:underline">
            Clear all
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Org select */}
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
          value={orgFilter ?? ""}
          onChange={(e) => {
            router.push(buildHref({ org: e.target.value || undefined, action: actionFilter }));
          }}
        >
          <option value="">All clients</option>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>

        {/* Active filter chips */}
        {orgFilter && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-medium border border-brand-200">
            {orgs.find((o) => o.id === orgFilter)?.name ?? orgFilter}
            <Link href={buildHref({ action: actionFilter })} className="hover:text-brand-900 ml-0.5">×</Link>
          </span>
        )}
        {actionFilter && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
            {ACTION_LABELS[actionFilter] ?? actionFilter}
            <Link href={buildHref({ org: orgFilter })} className="hover:text-purple-900 ml-0.5">×</Link>
          </span>
        )}
      </div>

      {/* Action filter chips */}
      <div className="flex flex-wrap gap-2 mt-3">
        {Object.keys(ACTION_LABELS).map((action) => (
          <Link
            key={action}
            href={buildHref({ org: orgFilter, action: actionFilter === action ? undefined : action })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              actionFilter === action
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {ACTION_LABELS[action]}
          </Link>
        ))}
      </div>
    </div>
  );
}
