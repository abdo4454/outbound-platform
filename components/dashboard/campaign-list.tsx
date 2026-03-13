import { cn } from "@/lib/utils";

const CAMPAIGNS = [
  {
    name: "Q2 Enterprise — VP Engineering",
    status: "active",
    sent: 3240,
    openRate: 67.3,
    replyRate: 22.1,
    meetings: 14,
    domain: "outreach1.acme.io",
  },
  {
    name: "SMB SaaS — Founders",
    status: "active",
    sent: 5120,
    openRate: 58.9,
    replyRate: 15.4,
    meetings: 11,
    domain: "reach.acme.io",
  },
  {
    name: "Mid-Market — Head of Sales",
    status: "active",
    sent: 2890,
    openRate: 71.2,
    replyRate: 24.8,
    meetings: 9,
    domain: "connect.acme.io",
  },
  {
    name: "ABM — Target Account List",
    status: "paused",
    sent: 840,
    openRate: 82.1,
    replyRate: 38.2,
    meetings: 0,
    domain: "hello.acme.io",
  },
];

const STATUS_STYLES = {
  active: "badge-success",
  paused: "badge-warning",
  draft: "badge-gray",
  completed: "badge-brand",
};

export function CampaignList() {
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
          {CAMPAIGNS.map((campaign) => (
            <tr key={campaign.name} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
              <td className="px-6 py-4">
                <div className="font-medium text-sm text-gray-900">{campaign.name}</div>
                <div className="text-xs text-gray-400">{campaign.domain}</div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(STATUS_STYLES[campaign.status as keyof typeof STATUS_STYLES])}>
                  {campaign.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-600">
                {campaign.sent.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-600">
                {campaign.openRate}%
              </td>
              <td className="px-6 py-4 text-right text-sm text-gray-600">
                {campaign.replyRate}%
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-semibold text-gray-900">{campaign.meetings}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
