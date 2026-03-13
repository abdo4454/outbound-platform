import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  highlight?: boolean;
}

export function MetricCard({ icon: Icon, label, value, change, trend, highlight }: MetricCardProps) {
  return (
    <div className={cn("metric-card", highlight && "border-brand-200 bg-brand-50/30")}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          highlight ? "bg-brand-100 text-brand-600" : "bg-gray-100 text-gray-500"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          trend === "up" ? "text-green-600" : "text-red-500"
        )}>
          {trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}
