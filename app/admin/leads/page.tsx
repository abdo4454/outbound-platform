import { db } from "@/lib/db";
import { Mail, Building2, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { LeadStatusSelect } from "./lead-status-select";

async function getLeads() {
  try {
    return await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    return [];
  }
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  NEW: { label: "New", cls: "badge-brand" },
  CONTACTED: { label: "Contacted", cls: "badge-warning" },
  QUALIFIED: { label: "Qualified", cls: "badge-success" },
  DISCOVERY_BOOKED: { label: "Discovery Booked", cls: "badge-success" },
  DISCOVERY_COMPLETE: { label: "Discovery Done", cls: "badge-success" },
  PROPOSAL_SENT: { label: "Proposal Sent", cls: "badge-warning" },
  NEGOTIATION: { label: "Negotiating", cls: "badge-warning" },
  WON: { label: "Won", cls: "badge-success" },
  LOST: { label: "Lost", cls: "badge-gray" },
  DISQUALIFIED: { label: "Disqualified", cls: "badge-gray" },
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ARR_LABELS: Record<string, string> = {
  "pre-revenue": "Pre-revenue",
  "under-1m": "< $1M ARR",
  "1m-5m": "$1M–$5M ARR",
  "5m-20m": "$5M–$20M ARR",
  "20m+": "$20M+ ARR",
};

const CHALLENGE_LABELS: Record<string, string> = {
  "not-enough-leads": "Not enough leads",
  "low-reply-rates": "Low reply rates",
  "need-enterprise": "Need enterprise clients",
  "just-starting": "Starting from scratch",
  "inconsistent": "Inconsistent results",
  "scaling": "Need to scale",
};

export default async function LeadsPage() {
  const leads = await getLeads();

  if (leads.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">All inbound leads from your website</p>
        </div>
        <div className="card text-center py-16">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-display font-bold text-gray-900 mb-2">No leads yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Leads will appear here when someone fills out the &quot;Book a Call&quot; form on your website.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/#book" className="btn-primary btn-sm">
              View your form
            </Link>
            <Link href="/admin" className="btn-ghost btn-sm">
              Back to overview
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Make sure your database is connected and <code className="bg-gray-100 px-1 py-0.5 rounded">DATABASE_URL</code> is set in .env
          </p>
        </div>
      </div>
    );
  }

  const byStatus = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{leads.length} total leads</p>
        <div className="flex items-center gap-2">
          {Object.entries(byStatus).map(([status, count]) => {
            const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.NEW;
            return (
              <span key={status} className={cfg.cls}>
                {count} {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto -mx-6 -mt-6">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ARR</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Challenge</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Meeting Goal</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => {
                const cfg = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.NEW;
                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-gray-900">{lead.name || "—"}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 flex items-center gap-1">
                        {lead.company ? (
                          <>
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            {lead.company}
                          </>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.companySize ? (ARR_LABELS[lead.companySize] ?? lead.companySize) : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.message ? (CHALLENGE_LABELS[lead.message] ?? lead.message) : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.interest ? `${lead.interest}/mo` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {lead.source || "Direct"}
                    </td>
                    <td className="px-6 py-4">
                      <LeadStatusSelect leadId={lead.id} status={lead.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(lead.createdAt)}
                      </div>
                      <div className="text-gray-300 mt-0.5">{formatDate(lead.createdAt)}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
