import { Mail, MessageSquare, CalendarCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIVITIES = [
  { icon: CalendarCheck, color: "text-green-600 bg-green-50", label: "Meeting booked", detail: "Sarah Kim — Acme Corp", time: "12 min ago" },
  { icon: MessageSquare, color: "text-brand-600 bg-brand-50", label: "Positive reply", detail: "James Chen — TechFlow", time: "34 min ago" },
  { icon: Mail, color: "text-gray-500 bg-gray-100", label: "Sequence started", detail: "Q2 Enterprise Campaign", time: "1 hr ago" },
  { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", label: "Meeting held", detail: "Mike Torres — Zenith AI", time: "2 hr ago" },
  { icon: AlertCircle, color: "text-amber-600 bg-amber-50", label: "Bounce rate alert", detail: "Domain warmup-2.com at 4.2%", time: "3 hr ago" },
  { icon: MessageSquare, color: "text-brand-600 bg-brand-50", label: "Positive reply", detail: "Priya Sharma — CloudBase", time: "4 hr ago" },
  { icon: CalendarCheck, color: "text-green-600 bg-green-50", label: "Meeting booked", detail: "Alex Rivera — NovaStar", time: "5 hr ago" },
];

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {ACTIVITIES.map((activity, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", activity.color)}>
            <activity.icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{activity.label}</p>
            <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}
