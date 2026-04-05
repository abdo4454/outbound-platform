import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type = "WEEKLY" } = await req.json().catch(() => ({}));
  const now = new Date();

  let periodStart: Date;
  let periodKey: string;
  let title: string;

  if (type === "MONTHLY") {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    title = `Monthly Report — ${now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
  } else {
    periodStart = new Date(now);
    periodStart.setDate(periodStart.getDate() - 7);
    const weekNum = Math.ceil(
      ((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7
    );
    periodKey = `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
    const startStr = periodStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    title = `Weekly Report — ${startStr}–${endStr}`;
  }

  const existing = await db.report.findFirst({
    where: { orgId: member.orgId, period: periodKey, type: type as "WEEKLY" | "MONTHLY" | "QUARTERLY" },
  });
  if (existing) return NextResponse.json({ report: existing });

  const metrics = await db.campaignMetric.aggregate({
    where: {
      campaign: { orgId: member.orgId },
      date: { gte: periodStart, lte: now },
    },
    _sum: {
      emailsSent: true, opens: true, replies: true,
      positiveReplies: true, meetingsBooked: true, bounces: true,
    },
  });

  const emailsSent = metrics._sum.emailsSent ?? 0;
  const opens = metrics._sum.opens ?? 0;
  const replies = metrics._sum.replies ?? 0;
  const meetings = metrics._sum.meetingsBooked ?? 0;
  const bounces = metrics._sum.bounces ?? 0;

  const data = {
    emailsSent,
    opens,
    openRate: emailsSent > 0 ? ((opens / emailsSent) * 100).toFixed(1) : "0.0",
    replies,
    replyRate: emailsSent > 0 ? ((replies / emailsSent) * 100).toFixed(1) : "0.0",
    positiveReplies: metrics._sum.positiveReplies ?? 0,
    meetingsBooked: meetings,
    bounces,
    bounceRate: emailsSent > 0 ? ((bounces / emailsSent) * 100).toFixed(2) : "0.00",
    generatedAt: now.toISOString(),
  };

  const report = await db.report.create({
    data: {
      orgId: member.orgId,
      type: type as "WEEKLY" | "MONTHLY" | "QUARTERLY",
      period: periodKey,
      title,
      data: JSON.stringify(data),
      sentAt: now,
    },
  });

  return NextResponse.json({ report });
}
