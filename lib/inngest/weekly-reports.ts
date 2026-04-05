import { inngest } from "@/lib/inngest";
import { db } from "@/lib/db";
import { sendWeeklyReport } from "@/lib/email";

// ---------------------------------------------------------------------------
// Auto-generate weekly reports every Monday at 9am UTC
// Creates a Report record for each active org and emails it to client admins
// ---------------------------------------------------------------------------

export const generateWeeklyReports = inngest.createFunction(
  {
    id: "generate-weekly-reports",
    name: "Generate weekly reports for all clients",
    concurrency: { limit: 5 },
  },
  { cron: "0 9 * * 1" }, // Every Monday at 9am UTC
  async ({ step }) => {
    const activeOrgs = await step.run("fetch-active-orgs", () =>
      db.organization.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, name: true },
      })
    );

    await Promise.allSettled(
      activeOrgs.map((org) =>
        step.run(`report-org-${org.id}`, () => generateOrgReport(org))
      )
    );

    return { total: activeOrgs.length };
  }
);

// ---------------------------------------------------------------------------
// Manual trigger — generate a report for a specific org on demand
// ---------------------------------------------------------------------------

export const generateOrgReportManual = inngest.createFunction(
  { id: "generate-org-report-manual", name: "Manual report generation" },
  { event: "report/generate.requested" },
  async ({ event, step }) => {
    const { orgId, type = "WEEKLY" } = event.data as {
      orgId: string;
      type?: "WEEKLY" | "MONTHLY" | "QUARTERLY";
    };

    const org = await step.run("fetch-org", () =>
      db.organization.findUnique({
        where: { id: orgId },
        select: { id: true, name: true },
      })
    );

    if (!org) return { error: "Org not found" };
    await step.run("generate", () => generateOrgReport(org, type));
    return { done: true };
  }
);

// ---------------------------------------------------------------------------
// Core report generation per org
// ---------------------------------------------------------------------------

async function generateOrgReport(
  org: { id: string; name: string },
  type: "WEEKLY" | "MONTHLY" | "QUARTERLY" = "WEEKLY"
) {
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

  // Skip if already generated for this period
  const existing = await db.report.findFirst({
    where: { orgId: org.id, period: periodKey, type },
  });
  if (existing) return { skipped: "already_exists", reportId: existing.id };

  // Aggregate metrics
  const metrics = await db.campaignMetric.aggregate({
    where: {
      campaign: { orgId: org.id },
      date: { gte: periodStart, lte: now },
    },
    _sum: {
      emailsSent: true,
      opens: true,
      replies: true,
      positiveReplies: true,
      meetingsBooked: true,
      meetingsHeld: true,
      bounces: true,
      unsubscribes: true,
    },
  });

  const emailsSent = metrics._sum.emailsSent ?? 0;
  const opens = metrics._sum.opens ?? 0;
  const replies = metrics._sum.replies ?? 0;
  const positiveReplies = metrics._sum.positiveReplies ?? 0;
  const meetings = metrics._sum.meetingsBooked ?? 0;
  const bounces = metrics._sum.bounces ?? 0;
  const unsubscribes = metrics._sum.unsubscribes ?? 0;

  const data = {
    emailsSent,
    opens,
    openRate: emailsSent > 0 ? ((opens / emailsSent) * 100).toFixed(1) : "0.0",
    replies,
    replyRate: emailsSent > 0 ? ((replies / emailsSent) * 100).toFixed(1) : "0.0",
    positiveReplies,
    meetingsBooked: meetings,
    bounces,
    bounceRate: emailsSent > 0 ? ((bounces / emailsSent) * 100).toFixed(2) : "0.00",
    unsubscribes,
    generatedAt: now.toISOString(),
    periodStart: periodStart.toISOString(),
    periodEnd: now.toISOString(),
  };

  const report = await db.report.create({
    data: {
      orgId: org.id,
      type,
      period: periodKey,
      title,
      data: JSON.stringify(data),
      sentAt: now,
    },
  });

  // Find client admin emails to notify
  const clientAdmins = await db.member.findMany({
    where: { orgId: org.id, role: { in: ["CLIENT_ADMIN", "MANAGER"] } },
    select: { email: true, name: true },
  });

  // Send report emails (fire-and-forget — don't fail the step on email errors)
  await Promise.allSettled(
    clientAdmins.map(async (admin) => {
      if (!admin.email) return;
      try {
        await sendWeeklyReport(
          admin.email,
          org.name,
          {
            emailsSent,
            openRate: parseFloat(data.openRate),
            replyRate: parseFloat(data.replyRate),
            meetingsBooked: meetings,
          }
        );
      } catch {
        // Email delivery failure should not fail the report generation
      }
    })
  );

  return { reportId: report.id, emailsSent: clientAdmins.length };
}
