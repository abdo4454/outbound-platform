import { Mail, MessageSquare, CalendarCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  action: string;
  details: Record<string, unknown> | null;
  createdAt: Date;
}

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function activityMeta(action: string, details: Record<string, unknown> | null) {
  const d = details ?? {};
  switch (action) {
    case "booking.created":
      return {
        icon: CalendarCheck,
        color: "text-green-600 bg-green-50",
        label: "Meeting booked",
        detail: `${d.prospectName ?? "Unknown"} — ${d.prospectCompany ?? ""}`,
      };
    case "campaign.launched":
      return {
        icon: Mail,
        color: "text-gray-500 bg-gray-100",
        label: "Campaign launched",
        detail: String(d.campaignName ?? ""),
      };
    case "campaign.synced":
      return {
        icon: CheckCircle2,
        color: "text-emerald-600 bg-emerald-50",
        label: "Campaigns synced",
        detail: `${d.count ?? ""} campaigns updated`,
      };
    case "booking.rescheduled":
      return {
        icon: AlertCircle,
        color: "text-amber-600 bg-amber-50",
        label: "Meeting rescheduled",
        detail: String(d.prospectName ?? ""),
      };
    default:
      return {
        icon: MessageSquare,
        color: "text-brand-600 bg-brand-50",
        label: action.replace(".", " "),
        detail: "",
      };
  }
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        Activity will appear here as your campaigns run.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, i) => {
        const meta = activityMeta(activity.action, activity.details as Record<string, unknown> | null);
        return (
          <div key={i} className="flex items-start gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", meta.color)}>
              <meta.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{meta.label}</p>
              {meta.detail && <p className="text-xs text-gray-500 truncate">{meta.detail}</p>}
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeTime(activity.createdAt)}</span>
          </div>
        );
      })}
    </div>
  );
}
