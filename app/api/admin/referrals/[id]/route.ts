import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { DEMO_MODE } from "@/lib/demo-mode";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json().catch(() => ({})) as {
    status?: string;
    totalPaid?: number;
    clicks?: number;
    signups?: number;
    conversions?: number;
    totalEarned?: number;
  };

  const VALID_STATUSES = ["active", "paused", "inactive"];

  try {
    const referral = await db.referral.update({
      where: { id: params.id },
      data: {
        ...(body.status && VALID_STATUSES.includes(body.status) ? { status: body.status } : {}),
        ...(typeof body.totalPaid === "number" ? { totalPaid: body.totalPaid } : {}),
        ...(typeof body.clicks === "number" ? { clicks: body.clicks } : {}),
        ...(typeof body.signups === "number" ? { signups: body.signups } : {}),
        ...(typeof body.conversions === "number" ? { conversions: body.conversions } : {}),
        ...(typeof body.totalEarned === "number" ? { totalEarned: body.totalEarned } : {}),
      },
    });
    return NextResponse.json({ referral });
  } catch {
    return NextResponse.json({ error: "Failed to update referral" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  try {
    await db.referral.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete referral" }, { status: 500 });
  }
}
