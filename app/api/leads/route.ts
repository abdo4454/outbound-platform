import { NextRequest, NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/validations";
import { notifyNewLead } from "@/lib/slack";
import { sendLeadNotification } from "@/lib/email";
import { inngest } from "@/lib/inngest";
import { formRateLimit, getIdentifier, applyRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limit by IP — 5 submissions per hour
  const rateLimitResponse = await applyRateLimit(formRateLimit, getIdentifier(req));
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Parse and validate
    const body = await req.json();
    const result = leadFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Try to save to DB — gracefully skip if DB not configured
    let leadId = `temp-${Date.now()}`;
    try {
      const { db } = await import("@/lib/db");

      // Check for duplicate (same email in last 24 hours)
      const existingLead = await db.lead.findFirst({
        where: {
          email: data.email,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });

      if (existingLead) {
        return NextResponse.json({ success: true, id: existingLead.id });
      }

      const lead = await db.lead.create({
        data: {
          email: data.email,
          name: data.name,
          company: data.company,
          phone: data.phone,
          companySize: data.companySize,
          interest: data.interest,
          message: data.message,
          source: data.source,
          medium: data.medium,
          campaign: data.campaign,
          content: data.content,
          term: data.term,
          landingPage: data.landingPage,
          referrer: data.referrer,
          gclid: data.gclid,
          fbclid: data.fbclid,
          firstTouchSource: data.source,
          firstTouchMedium: data.medium,
          lastTouchSource: data.source,
          lastTouchMedium: data.medium,
        },
      });

      leadId = lead.id;

      // Trigger automated nurture sequence
      await inngest.send({
        name: "lead/created",
        data: {
          leadId: lead.id,
          email: lead.email,
          name: lead.name ?? undefined,
          company: lead.company ?? undefined,
        },
      }).catch(() => {}); // non-blocking
    } catch (dbError) {
      // DB not configured — log and continue so the form still works
      console.warn("DB not available, lead not persisted:", dbError instanceof Error ? dbError.message : dbError);
    }

    // Fire-and-forget notifications
    Promise.allSettled([
      notifyNewLead({
        email: data.email,
        name: data.name,
        company: data.company,
        source: data.source,
        landingPage: data.landingPage,
      }),
      sendLeadNotification(
        process.env.TEAM_NOTIFICATION_EMAIL || process.env.GMAIL_USER || "",
        data.email,
        data.company ?? null,
        data.source ?? null
      ),
    ]).catch(() => {});

    return NextResponse.json({ success: true, id: leadId }, { status: 201 });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
