import { db } from "@/lib/db";

export type ClientContext = {
  orgName: string;
  plan: string;
  status: string;
  metrics: {
    sent: number;
    opens: number;
    replies: number;
    positiveReplies: number;
    meetings: number;
    bounces: number;
    openRate: string;
    replyRate: string;
    bounceRate: string;
    meetingRate: string;
  };
  campaigns: {
    name: string;
    status: string;
    sent: number;
    replyRate: string;
    meetings: number;
  }[];
};

export async function buildClientContext(orgId: string): Promise<ClientContext | null> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const org = await db.organization.findUnique({
      where: { id: orgId },
      include: {
        campaigns: {
          include: {
            metrics: { where: { date: { gte: thirtyDaysAgo } } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!org) return null;

    // Aggregate 30-day totals
    let totalSent = 0, totalOpens = 0, totalReplies = 0;
    let totalPositive = 0, totalMeetings = 0, totalBounces = 0;

    const campaigns = org.campaigns.map((c) => {
      const sent = c.metrics.reduce((s, m) => s + m.emailsSent, 0);
      const replies = c.metrics.reduce((s, m) => s + m.replies, 0);
      const meetings = c.metrics.reduce((s, m) => s + m.meetingsBooked, 0);
      const opens = c.metrics.reduce((s, m) => s + m.opens, 0);
      const positive = c.metrics.reduce((s, m) => s + m.positiveReplies, 0);
      const bounces = c.metrics.reduce((s, m) => s + m.bounces, 0);

      totalSent += sent;
      totalOpens += opens;
      totalReplies += replies;
      totalPositive += positive;
      totalMeetings += meetings;
      totalBounces += bounces;

      return {
        name: c.name,
        status: c.status,
        sent,
        replyRate: sent > 0 ? ((replies / sent) * 100).toFixed(1) : "0",
        meetings,
      };
    });

    return {
      orgName: org.name,
      plan: org.plan,
      status: org.status,
      metrics: {
        sent: totalSent,
        opens: totalOpens,
        replies: totalReplies,
        positiveReplies: totalPositive,
        meetings: totalMeetings,
        bounces: totalBounces,
        openRate: totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : "0",
        replyRate: totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : "0",
        bounceRate: totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(1) : "0",
        meetingRate: totalSent > 0 ? ((totalMeetings / totalSent) * 100).toFixed(2) : "0",
      },
      campaigns,
    };
  } catch {
    return null;
  }
}

export function buildSystemPrompt(ctx: ClientContext | null): string {
  const agencyBlurb = `You are Aria, the AI assistant built into the Accelerated Growth client portal. Accelerated Growth is a done-for-you B2B outbound agency — your team handles cold email campaigns, prospect research, and appointment setting on behalf of clients.

Your job is to help clients understand their campaign performance, interpret their metrics, answer outbound strategy questions, and give specific, data-driven advice on improving results.`;

  const benchmarks = `
INDUSTRY BENCHMARKS (B2B cold email — use these to give context):
- Open rate: 30–45% average, 50%+ is strong
- Reply rate: 5–10% average, 15%+ is strong, below 3% needs attention
- Positive reply rate: 2–5% of sent emails
- Meeting booking rate: 0.5–2% of emails sent
- Bounce rate: below 3% is healthy, above 5% is a deliverability risk`;

  if (!ctx) {
    return `${agencyBlurb}

The client's campaign data is not available right now. Answer general outbound strategy and cold email questions as best you can. If asked about specific numbers, let them know you can't see their data at the moment and suggest they check their campaign dashboard.
${benchmarks}

RULES:
- Only answer questions about outbound sales, cold email, campaigns, lead generation, and appointment setting
- Never discuss pricing, contract terms, or billing — direct those to their account manager
- Be concise, direct, and actionable
- If you don't know something, say so honestly`;
  }

  const campaignSection = ctx.campaigns.length === 0
    ? "No campaigns running yet."
    : ctx.campaigns
        .filter((c) => c.status !== "ARCHIVED")
        .map((c) => `  • ${c.name} [${c.status}] — ${c.sent > 0 ? `${c.sent.toLocaleString()} sent, ${c.replyRate}% reply rate, ${c.meetings} meetings` : "no data yet"}`)
        .join("\n");

  const performanceFlags: string[] = [];
  const m = ctx.metrics;

  if (m.sent > 0) {
    if (parseFloat(m.replyRate) < 3) performanceFlags.push("⚠️ Reply rate is below 3% — messaging or targeting may need review");
    if (parseFloat(m.replyRate) >= 15) performanceFlags.push("✅ Reply rate is strong (15%+)");
    if (parseFloat(m.openRate) < 30) performanceFlags.push("⚠️ Open rate is below 30% — subject lines or deliverability may be an issue");
    if (parseFloat(m.openRate) >= 50) performanceFlags.push("✅ Open rate is strong (50%+)");
    if (parseFloat(m.bounceRate) > 5) performanceFlags.push("🚨 Bounce rate is above 5% — list quality or sending domain needs attention");
    if (m.meetings === 0 && m.sent > 500) performanceFlags.push("⚠️ No meetings booked yet despite significant volume — review call-to-action and positive reply follow-up");
  }

  return `${agencyBlurb}

CLIENT DATA (last 30 days):
Client: ${ctx.orgName}
Plan: ${ctx.plan}
Status: ${ctx.status}

PERFORMANCE METRICS:
- Emails sent: ${m.sent.toLocaleString()}
- Open rate: ${m.openRate}% ${parseFloat(m.openRate) >= 50 ? "✅" : parseFloat(m.openRate) >= 30 ? "→" : "⚠️"}
- Reply rate: ${m.replyRate}% ${parseFloat(m.replyRate) >= 15 ? "✅" : parseFloat(m.replyRate) >= 5 ? "→" : "⚠️"}
- Positive replies: ${m.positiveReplies}
- Meetings booked: ${m.meetings}
- Bounce rate: ${m.bounceRate}%
- Meeting booking rate: ${m.meetingRate}% of emails sent

ACTIVE CAMPAIGNS:
${campaignSection}

${performanceFlags.length > 0 ? `PERFORMANCE FLAGS:\n${performanceFlags.join("\n")}` : ""}
${benchmarks}

RULES:
1. Always reference the client's actual numbers when answering — don't speak in generalities when real data exists
2. Compare their metrics to benchmarks and explain what's good, what needs work, and why
3. Give specific, actionable advice — not "improve your subject lines" but "your open rate suggests deliverability issues; here's what to check..."
4. Only answer questions about outbound sales, cold email, campaigns, and lead generation
5. Never discuss pricing, contract terms, or billing — direct those questions to their account manager at Accelerated Growth
6. If asked something outside your scope, politely redirect: "That's something your account manager can help with — reach out to the team directly"
7. Be confident but honest — if something isn't performing, say it clearly and explain what can be done
8. Keep responses focused and readable — use bullet points for lists, bold for key numbers
9. You do NOT have access to individual email conversations, specific prospect names, or inbox data`;
}
