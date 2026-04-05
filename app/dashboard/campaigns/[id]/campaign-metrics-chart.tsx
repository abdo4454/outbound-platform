"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

interface DailyPoint {
  date: string;
  sent: number;
  opens: number;
  replies: number;
  meetings: number;
}

export function CampaignMetricsChart({ data }: { data: DailyPoint[] }) {
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gSent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3366ff" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3366ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gOpens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gReplies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "13px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
            iconType="circle"
            iconSize={8}
          />
          <Area type="monotone" dataKey="sent" stroke="#3366ff" strokeWidth={2} fill="url(#gSent)" name="Sent" />
          <Area type="monotone" dataKey="opens" stroke="#6366f1" strokeWidth={1.5} fill="url(#gOpens)" name="Opens" />
          <Area type="monotone" dataKey="replies" stroke="#22c55e" strokeWidth={2} fill="url(#gReplies)" name="Replies" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
