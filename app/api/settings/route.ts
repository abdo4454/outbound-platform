import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { DEMO_MODE } from "@/lib/demo-mode";

export async function PATCH(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json().catch(() => ({})) as {
    orgName?: string;
    website?: string;
    timezone?: string;
    bookingLink?: string;
  };

  try {
    const { db } = await import("@/lib/db");

    const orgUpdates: Record<string, string> = {};
    if (body.website !== undefined) orgUpdates.website = body.website.trim();
    if (body.timezone !== undefined) orgUpdates.timezone = body.timezone.trim();

    if (Object.keys(orgUpdates).length > 0) {
      await db.organization.update({
        where: { id: member.orgId },
        data: orgUpdates,
      });
    }

    if (body.bookingLink !== undefined) {
      await db.onboarding.upsert({
        where: { orgId: member.orgId },
        create: { orgId: member.orgId, bookingLink: body.bookingLink.trim() },
        update: { bookingLink: body.bookingLink.trim() },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("settings PATCH error:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
