import { redirect } from "next/navigation";
import { Mail, Eye, MessageSquare, CalendarCheck, ArrowUpRight } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CampaignChart } from "@/components/dashboard/campaign-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CampaignList } from "@/components/dashboard/campaign-list";
import { getCurrentOrg } from "@/lib/auth-helpers";
import { DEMO_MODE } from "@/lib/demo-mode";

// Demo data shown when DB is not configured
const DEMO_CHART_DATA = [
  { date: "Mon", sent: 320, replies: 22, meetings: 3 },
  { date: "Tue", sent: 410, replies: 31, meetings: 4 },
  { date: "Wed", sent: 380, replies: 28, meetings: 5 },
  { date: "Thu", sent: 450, replies: 38, meetings: 6 },
  { date: "Fri", sent: 390, replies: 30, meetings: 4 },
  { date: "Sat", sent: 120, replies: 9, meetings: 1 },
  { date: "Sun", sent: 80, replies: 6, meetings: 1 },
];

const DEMO_CAMPAIGNS = [
  { name: "SaaS Founders Outreach", status: "ACTIVE", sent: 2150, openRate: 48.2, replyRate: 8.4, meetings: 24, domain: "mail.acme.com" },
  { name: "Series A Follow-up", status: "ACTIVE", sent: 1840, openRate: 52.1, replyRate: 10.1, meetings: 18, domain: "outreach.acme.com" },
  { name: "E-commerce Decision Makers", status: "PAUSED", sent: 980, openRate: 41.5, replyRate: 6.2, meetings: 8, domain: null },
];

const DEMO_ACTIVITY = [
  { id: "1", orgId: "demo-org-id", action: "campaign.synced", details: { name: "SaaS Founders Outreach" }, createdAt: new Date() },
  { id: "2", orgId: "demo-org-id", action: "meeting.booked", details: { contact: "Jane Smith", company: "Vercel" }, createdAt: new Date(Date.now() - 3600000) },
  { id: "3", orgId: "demo-org-id", action: "reply.received", details: { contact: "Mark Lee", campaign: "Series A Follow-up" }, createdAt: new Date(Date.now() - 7200000) },
];

export default async function DashboardPage() {
  const org = await getCurrentOrg();
  if (!org) redirect("/sign-in");

  // Use demo data if DB not configured or in demo mode
  if (DEMO_MODE) {
    const totalSent = DEMO_CHART_DATA.reduce((s, d) => s + d.sent, 0);
    const totalReplies = DEMO_CHART_DATA.reduce((s, d) => s + d.replies, 0);
    const totalMeetings = DEMO_CHART_DATA.reduce((s, d) => s + d.meetings, 0);
    const openRate = "46.8";
    const replyRate = ((totalReplies / totalSent) * 100).toFixed(1);

    return (
      <DashboardContent
        totalSent={totalSent}
        openRate={openRate}
        replyRate={replyRate}
        totalMeetings={totalMeetings}
        chartData={DEMO_CHART_DATA}
        recentActivity={DEMO_ACTIVITY}
        campaignList={DEMO_CAMPAIGNS}
        lastSyncedMins={3}
      />
    );
  }

  // Real DB path
  try {
    const { db } = await import("@/lib/db");

    // Redirect clients to onboarding if not complete
    const onboarding = await db.onboarding.findUnique({ where: { orgId: org.id } });
    if (onboarding && !onboarding.icpComplete && org.status === "ONBOARDING") {
      redirect("/onboarding");
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [campaigns, recentActivity] = await Promise.all([
      db.campaign.findMany({
        where: { orgId: org.id },
        include: { metrics: { where: { date: { gte: thirtyDaysAgo } } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.activityLog.findMany({
        where: { orgId: org.id },
        orderBy: { createdAt: "desc" },
        take: 7,
      }),
    ]);

    let totalSent = 0, totalOpens = 0, totalReplies = 0, totalMeetings = 0;
    for (const c of campaigns) {
      for (const m of c.metrics) {
        totalSent += m.emailsSent;
        totalOpens += m.opens;
        totalReplies += m.replies;
        totalMeetings += m.meetingsBooked;
      }
    }

    const openRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : "0.0";
    const replyRate = totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : "0.0";

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyMap: Record<string, { sent: number; replies: number; meetings: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { weekday: "short" });
      dailyMap[key] = { sent: 0, replies: 0, meetings: 0 };
    }
    for (const c of campaigns) {
      for (const m of c.metrics) {
        const mDate = new Date(m.date);
        if (mDate >= sevenDaysAgo) {
          const key = mDate.toLocaleDateString("en-US", { weekday: "short" });
          if (dailyMap[key]) {
            dailyMap[key].sent += m.emailsSent;
            dailyMap[key].replies += m.replies;
            dailyMap[key].meetings += m.meetingsBooked;
          }
        }
      }
    }
    const chartData = Object.entries(dailyMap).map(([date, vals]) => ({ date, ...vals }));

    const campaignList = campaigns.map((c) => {
      const sent = c.metrics.reduce((s, m) => s + m.emailsSent, 0);
      const opens = c.metrics.reduce((s, m) => s + m.opens, 0);
      const replies = c.metrics.reduce((s, m) => s + m.replies, 0);
      const meetings = c.metrics.reduce((s, m) => s + m.meetingsBooked, 0);
      return {
        name: c.name,
        status: c.status,
        sent,
        openRate: sent > 0 ? (opens / sent) * 100 : 0,
        replyRate: sent > 0 ? (replies / sent) * 100 : 0,
        meetings,
        domain: c.sendingDomain,
      };
    });

    const lastSyncedCampaign = campaigns.find((c) => c.updatedAt);
    const lastSyncedMins = lastSyncedCampaign
      ? Math.round((Date.now() - new Date(lastSyncedCampaign.updatedAt).getTime()) / 60000)
      : null;

    return (
      <DashboardContent
        totalSent={totalSent}
        openRate={openRate}
        replyRate={replyRate}
        totalMeetings={totalMeetings}
        chartData={chartData}
        recentActivity={recentActivity.map((a) => ({ ...a, details: a.details as Record<string, unknown> | null }))}
        campaignList={campaignList}
        lastSyncedMins={lastSyncedMins}
      />
    );
  } catch {
    // DB not configured — show demo data
    const totalSent = DEMO_CHART_DATA.reduce((s, d) => s + d.sent, 0);
    const totalReplies = DEMO_CHART_DATA.reduce((s, d) => s + d.replies, 0);
    const totalMeetings = DEMO_CHART_DATA.reduce((s, d) => s + d.meetings, 0);
    return (
      <DashboardContent
        totalSent={totalSent}
        openRate="46.8"
        replyRate={((totalReplies / totalSent) * 100).toFixed(1)}
        totalMeetings={totalMeetings}
        chartData={DEMO_CHART_DATA}
        recentActivity={DEMO_ACTIVITY}
        campaignList={DEMO_CAMPAIGNS}
        lastSyncedMins={null}
      />
    );
  }
}

interface ContentProps {
  totalSent: number;
  openRate: string;
  replyRate: string;
  totalMeetings: number;
  chartData: { date: string; sent: number; replies: number; meetings: number }[];
  recentActivity: { id: string; orgId: string; action: string; details: Record<string, unknown> | null; createdAt: Date }[];
  campaignList: { name: string; status: string; sent: number; openRate: number; replyRate: number; meetings: number; domain: string | null }[];
  lastSyncedMins: number | null;
}

function DashboardContent({
  totalSent, openRate, replyRate, totalMeetings,
  chartData, recentActivity, campaignList, lastSyncedMins,
}: ContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Here&apos;s how your campaigns are performing this month.
          {lastSyncedMins !== null && (
            <span className="ml-2 text-gray-400">· Last synced {lastSyncedMins}m ago</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Mail} label="Emails Sent" value={totalSent.toLocaleString()} change={null} trend="up" />
        <MetricCard icon={Eye} label="Open Rate" value={`${openRate}%`} change={null} trend="up" />
        <MetricCard icon={MessageSquare} label="Reply Rate" value={`${replyRate}%`} change={null} trend="up" />
        <MetricCard icon={CalendarCheck} label="Meetings Booked" value={totalMeetings.toString()} change={null} trend="up" highlight />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-gray-900">Campaign Performance</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-brand-500" /><span className="text-gray-500">Emails Sent</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-gray-500">Replies</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-gray-500">Meetings</span></div>
            </div>
          </div>
          <CampaignChart data={chartData} />
        </div>
        <div className="card">
          <h3 className="font-display font-bold text-gray-900 mb-4">Recent Activity</h3>
          <RecentActivity activities={recentActivity} />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-gray-900">Active Campaigns</h3>
          <a href="/dashboard/campaigns" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <CampaignList campaigns={campaignList} />
      </div>
    </div>
  );
}
