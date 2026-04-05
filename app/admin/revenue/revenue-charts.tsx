"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface MonthPoint { month: string; mrr: number }

export function MRRChart({ data }: { data: MonthPoint[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gMRR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3366ff" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3366ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 100000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", fontSize: "13px" }}
            formatter={(v: number) => [`$${(v / 100).toLocaleString()}`, "MRR"]}
          />
          <Area type="monotone" dataKey="mrr" stroke="#3366ff" strokeWidth={2} fill="url(#gMRR)" name="MRR" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
