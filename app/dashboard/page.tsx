import { Suspense } from "react";
import {
  Mail, Eye, MessageSquare, CalendarCheck,
  TrendingUp, TrendingDown, ArrowUpRight,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CampaignChart } from "@/components/dashboard/campaign-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CampaignList } from "@/components/dashboard/campaign-list";

// In production, this data comes from your DB via server components
const MOCK_METRICS = {
  emailsSent: { value: 12847, change: 12.4, trend: "up" as const },
  openRate: { value: 64.2, change: 3.1, trend: "up" as const },
  replyRate: { value: 18.7, change: -1.2, trend: "down" as const },
  meetingsBooked: { value: 34, change: 22.0, trend: "up" as const },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Welcome back. Here&apos;s how your campaigns are performing.</p>
        </div>
        <select className="input w-auto text-sm py-2">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This month</option>
          <option>Last month</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Mail}
          label="Emails Sent"
          value={MOCK_METRICS.emailsSent.value.toLocaleString()}
          change={MOCK_METRICS.emailsSent.change}
          trend={MOCK_METRICS.emailsSent.trend}
        />
        <MetricCard
          icon={Eye}
          label="Open Rate"
          value={`${MOCK_METRICS.openRate.value}%`}
          change={MOCK_METRICS.openRate.change}
          trend={MOCK_METRICS.openRate.trend}
        />
        <MetricCard
          icon={MessageSquare}
          label="Reply Rate"
          value={`${MOCK_METRICS.replyRate.value}%`}
          change={MOCK_METRICS.replyRate.change}
          trend={MOCK_METRICS.replyRate.trend}
        />
        <MetricCard
          icon={CalendarCheck}
          label="Meetings Booked"
          value={MOCK_METRICS.meetingsBooked.value.toString()}
          change={MOCK_METRICS.meetingsBooked.change}
          trend={MOCK_METRICS.meetingsBooked.trend}
          highlight
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-gray-900">Campaign Performance</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-500" />
                <span className="text-gray-500">Emails Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-500">Replies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-gray-500">Meetings</span>
              </div>
            </div>
          </div>
          <CampaignChart />
        </div>

        <div className="card">
          <h3 className="font-display font-bold text-gray-900 mb-4">Recent Activity</h3>
          <RecentActivity />
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-gray-900">Active Campaigns</h3>
          <a href="/dashboard/campaigns" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <CampaignList />
      </div>
    </div>
  );
}
