import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leadFormSchema } from "@/lib/validations";
import { formRateLimit } from "@/lib/rate-limit";
import { notifyNewLead } from "@/lib/slack";
import { sendLeadNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? req.ip ?? "unknown";
    const { success } = await formRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

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

    // Check for duplicate (same email in last 24 hours)
    const existingLead = await db.lead.findFirst({
      where: {
        email: data.email,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (existingLead) {
      // Don't error, just return success to avoid leaking info
      return NextResponse.json({ success: true, id: existingLead.id });
    }

    // Create lead
    const lead = await db.lead.create({
      data: {
        email: data.email,
        name: data.name,
        company: data.company,
        phone: data.phone,
        companySize: data.companySize,
        interest: data.interest,
        message: data.message,
        // Attribution
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

    // Fire-and-forget notifications (don't block response)
    Promise.allSettled([
      notifyNewLead({
        email: data.email,
        name: data.name,
        company: data.company,
        source: data.source,
        landingPage: data.landingPage,
      }),
      sendLeadNotification(
        process.env.TEAM_NOTIFICATION_EMAIL || "team@outboundpro.com",
        data.email,
        data.company ?? null,
        data.source ?? null
      ),
    ]);

    // TODO: Trigger enrichment via Inngest event
    // await inngest.send({ name: "lead/created", data: { leadId: lead.id } });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
