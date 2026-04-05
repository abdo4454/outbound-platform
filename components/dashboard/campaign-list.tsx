import { cn } from "@/lib/utils";

interface Campaign {
  name: string;
  status: string;
  sent: number;
  openRate: number;
  replyRate: number;
  meetings: number;
  domain: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "badge-success",
  active: "badge-success",
  PAUSED: "badge-warning",
  paused: "badge-warning",
  DRAFT: "badge-gray",
  draft: "badge-gray",
  COMPLETED: "badge-brand",
  completed: "badge-brand",
};

export function CampaignList({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        No campaigns yet. Data syncs from Instantly every 15 minutes.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-100">
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Sent</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Open Rate</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Reply Rate</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Meetings</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {campaigns.map((campaign) => (
            <tr key={campaign.name} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td className="px-6 py-4">
                <div className="font-medium text-sm text-gray-900">{campaign.name}</div>
                {campaign.domain && <div className="text-xs text-gray-400">{campaign.domain}</div>}
              </td>
              <td className="px-6 py-4">
                <span className={cn(STATUS_STYLES[campaign.status] ?? "badge-gray")}>
                  {campaign.status.charAt(0) + campaign.status.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-600">
                {campaign.sent > 0 ? campaign.sent.toLocaleString() : "—"}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-600">
                {campaign.sent > 0 ? `${campaign.openRate.toFixed(1)}%` : "—"}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-600">
                {campaign.sent > 0 ? `${campaign.replyRate.toFixed(1)}%` : "—"}
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {campaign.meetings > 0 ? campaign.meetings : "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
