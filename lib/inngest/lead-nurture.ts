import { inngest } from "@/lib/inngest";
import { sendEmail } from "@/lib/email";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://accelratedgrowth.com";
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendly.com/accelerateyourgrowthtoday";
const CAL_URL = BOOKING_URL;

// ---------------------------------------------------------------------------
// Triggered when a new lead is captured — runs a 3-touch nurture sequence
// ---------------------------------------------------------------------------

export const nurtureNewLead = inngest.createFunction(
  { id: "nurture-new-lead", name: "Nurture new website lead" },
  { event: "lead/created" },
  async ({ event, step }) => {
    const { leadId, email, name, company } = event.data as {
      leadId: string;
      email: string;
      name?: string;
      company?: string;
    };

    const firstName = name?.split(" ")[0] || "there";

    // Step 1 — Send immediate confirmation with booking link
    await step.run("send-confirmation", async () => {
      await sendEmail({
        to: email,
        subject: "Thanks for reaching out — here's how to book your strategy call",
        html: buildConfirmationEmail(firstName, company, CAL_URL, APP_URL),
      });
    });

    // Wait 24 hours, then check if still unbooked
    await step.sleep("wait-24h", "24 hours");

    const stillNew = await step.run("check-lead-status-24h", async () => {
      try {
        const { db } = await import("@/lib/db");
        const lead = await db.lead.findUnique({ where: { id: leadId }, select: { status: true } });
        return lead?.status === "NEW";
      } catch {
        return true; // If DB unavailable, still send
      }
    });

    if (!stillNew) return { completed: "lead booked before follow-up 1" };

    // Step 2 — Follow-up with case study
    await step.run("send-followup-1", async () => {
      await sendEmail({
        to: email,
        subject: `Quick follow-up — ${company ? company + "'s" : "your"} pipeline question`,
        html: buildFollowup1Email(firstName, company, CAL_URL),
      });
    });

    // Wait another 48 hours
    await step.sleep("wait-72h-total", "48 hours");

    const stillNewAfter72h = await step.run("check-lead-status-72h", async () => {
      try {
        const { db } = await import("@/lib/db");
        const lead = await db.lead.findUnique({ where: { id: leadId }, select: { status: true } });
        return lead?.status === "NEW";
      } catch {
        return true;
      }
    });

    if (!stillNewAfter72h) return { completed: "lead booked before follow-up 2" };

    // Step 3 — Case study email
    await step.run("send-followup-2", async () => {
      await sendEmail({
        to: email,
        subject: "How a SaaS company like yours booked 43 meetings last month",
        html: buildFollowup2Email(firstName, CAL_URL),
      });
    });

    // Wait 4 more days (7 days total)
    await step.sleep("wait-7d-total", "4 days");

    const stillNewAfter7d = await step.run("check-lead-status-7d", async () => {
      try {
        const { db } = await import("@/lib/db");
        const lead = await db.lead.findUnique({ where: { id: leadId }, select: { status: true } });
        return lead?.status === "NEW";
      } catch {
        return true;
      }
    });

    if (!stillNewAfter7d) return { completed: "lead booked before final email" };

    // Step 4 — Final breakup email
    await step.run("send-final", async () => {
      await sendEmail({
        to: email,
        subject: "Closing your file — last note from Accelrated Growth",
        html: buildFinalEmail(firstName, CAL_URL),
      });
    });

    return { completed: "full sequence sent" };
  }
);

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

function buildConfirmationEmail(firstName: string, company: string | undefined, calUrl: string, appUrl: string) {
  return `
  <div style="font-family: -apple-system, sans-serif; max-width: 580px; margin: 0 auto; color: #1a1f35;">
    <div style="background: #0d1020; padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
      <div style="display: inline-block; background: #3366ff; border-radius: 10px; padding: 10px 16px; margin-bottom: 16px;">
        <span style="color: white; font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">Accelrated Growth</span>
      </div>
    </div>

    <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 12px 12px;">
      <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px; color: #1a1f35;">
        Hey ${firstName}${company ? `, welcome from ${company}` : ""} 👋
      </h1>

      <p style="color: #6b7280; line-height: 1.7; margin: 0 0 20px;">
        Thanks for reaching out. We've received your request and one of our team will review your details before the call.
      </p>

      <p style="color: #6b7280; line-height: 1.7; margin: 0 0 24px;">
        To lock in your free strategy call, book a time that works for you below:
      </p>

      <a href="${calUrl}" style="display: inline-block; background: #3366ff; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
        Book Your Strategy Call →
      </a>

      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-top: 8px;">
        <p style="font-size: 13px; color: #6b7280; margin: 0 0 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">What we cover in 30 minutes:</p>
        <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 2;">
          <li>Your exact ICP and where they live online</li>
          <li>Realistic meeting volume for your market</li>
          <li>Why previous outbound attempts may have underperformed</li>
          <li>What a 90-day ramp looks like for your SaaS</li>
        </ul>
      </div>

      <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0;">
        Questions? Just reply to this email. We typically respond within a few hours.
      </p>
    </div>
  </div>`;
}

function buildFollowup1Email(firstName: string, company: string | undefined, calUrl: string) {
  return `
  <div style="font-family: -apple-system, sans-serif; max-width: 580px; margin: 0 auto; color: #1a1f35;">
    <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <p style="color: #374151; line-height: 1.7; margin: 0 0 16px;">
        Hey ${firstName},
      </p>
      <p style="color: #374151; line-height: 1.7; margin: 0 0 16px;">
        Following up on your request${company ? ` from ${company}` : ""}. I wanted to share something relevant — one of our recent clients (B2B DevTools SaaS, Series A) was in almost exactly the same situation you described.
      </p>
      <p style="color: #374151; line-height: 1.7; margin: 0 0 20px;">
        They'd tried running outbound themselves with mixed results. Within 8 weeks of working with us:
      </p>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-weight: 700; color: #166534;">Results after 8 weeks:</p>
        <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 14px; line-height: 2;">
          <li>43 qualified meetings/month with VP Engineering buyers</li>
          <li>18.7% reply rate (industry avg is 3–5%)</li>
          <li>11 closed deals in Q1</li>
          <li>Outbound became their #1 pipeline source</li>
        </ul>
      </div>

      <p style="color: #374151; line-height: 1.7; margin: 0 0 20px;">
        Happy to share the exact strategy we used on your call. Still a few slots available this week:
      </p>

      <a href="${calUrl}" style="display: inline-block; background: #3366ff; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
        Book 30 Minutes →
      </a>

      <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0;">
        — The Accelrated Growth Team
      </p>
    </div>
  </div>`;
}

function buildFollowup2Email(firstName: string, calUrl: string) {
  return `
  <div style="font-family: -apple-system, sans-serif; max-width: 580px; margin: 0 auto; color: #1a1f35;">
    <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <p style="color: #374151; line-height: 1.7; margin: 0 0 16px;">
        Hey ${firstName},
      </p>
      <p style="color: #374151; line-height: 1.7; margin: 0 0 16px;">
        One more quick note. I've been thinking about what you told us about your pipeline situation, and I wanted to share the exact framework we use to generate 30–50 qualified meetings per month for B2B SaaS companies.
      </p>

      <p style="font-weight: 700; color: #1a1f35; margin: 0 0 12px;">The Predictable Pipeline Formula:</p>
      <div style="background: #eef4ff; border-left: 4px solid #3366ff; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px; font-family: monospace; font-size: 13px; color: #1a45f5;">
        500 prospects × 96% delivery × 15% reply rate × 33% booking rate = 24 meetings/mo
      </div>

      <p style="color: #374151; line-height: 1.7; margin: 0 0 20px;">
        The variable that moves the needle most? <strong>ICP precision</strong>. Most SaaS companies target too broadly. When we tighten the ICP, reply rates jump from 3% to 15%+ almost immediately.
      </p>

      <p style="color: #374151; line-height: 1.7; margin: 0 0 20px;">
        That's exactly what we'd map out on a 30-minute call:
      </p>

      <a href="${calUrl}" style="display: inline-block; background: #3366ff; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
        Let's Map Your ICP →
      </a>

      <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0;">
        — The Accelrated Growth Team
      </p>
    </div>
  </div>`;
}

function buildFinalEmail(firstName: string, calUrl: string) {
  return `
  <div style="font-family: -apple-system, sans-serif; max-width: 580px; margin: 0 auto; color: #1a1f35;">
    <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <p style="color: #374151; line-height: 1.7; margin: 0 0 16px;">
        Hey ${firstName},
      </p>
      <p style="color: #374151; line-height: 1.7; margin: 0 0 16px;">
        I'll keep this short — I'm going to close out your file since I haven't heard back.
      </p>
      <p style="color: #374151; line-height: 1.7; margin: 0 0 16px;">
        If the timing is off or pipeline isn't the right focus right now, totally fine. I'll stop following up.
      </p>
      <p style="color: #374151; line-height: 1.7; margin: 0 0 20px;">
        But if you're still thinking about outbound as a growth channel — even down the road — book a time whenever you're ready. The call is always free:
      </p>

      <a href="${calUrl}" style="display: inline-block; background: #111827; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">
        Book When Ready →
      </a>

      <p style="color: #374151; line-height: 1.7; margin: 24px 0 0;">
        Either way, wishing you a full pipeline.
      </p>

      <p style="color: #9ca3af; font-size: 13px; margin: 12px 0 0;">
        — The Accelrated Growth Team
      </p>
    </div>
  </div>`;
}
