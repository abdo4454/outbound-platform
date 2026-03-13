"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const MOCK_DATA = [
  { date: "Mon", sent: 420, replies: 38, meetings: 4 },
  { date: "Tue", sent: 480, replies: 45, meetings: 6 },
  { date: "Wed", sent: 510, replies: 52, meetings: 5 },
  { date: "Thu", sent: 390, replies: 33, meetings: 3 },
  { date: "Fri", sent: 460, replies: 41, meetings: 7 },
  { date: "Sat", sent: 120, replies: 12, meetings: 1 },
  { date: "Sun", sent: 80, replies: 8, meetings: 0 },
];

export function CampaignChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={MOCK_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3366ff" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3366ff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "13px",
            }}
          />
          <Area type="monotone" dataKey="sent" stroke="#3366ff" strokeWidth={2} fill="url(#colorSent)" />
          <Area type="monotone" dataKey="replies" stroke="#22c55e" strokeWidth={2} fill="url(#colorReplies)" />
          <Area type="monotone" dataKey="meetings" stroke="#f59e0b" strokeWidth={2} fill="url(#colorMeetings)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
