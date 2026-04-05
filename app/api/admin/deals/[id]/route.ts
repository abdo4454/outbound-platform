import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { DEMO_MODE } from "@/lib/demo-mode";

const VALID_STAGES = [
  "DISCOVERY_BOOKED",
  "DISCOVERY_COMPLETE",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
] as const;

type Stage = typeof VALID_STAGES[number];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (member.role !== "ADMIN" && member.role !== "CLIENT_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { stage } = body as { stage?: string };

  if (!stage || !VALID_STAGES.includes(stage as Stage)) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  }

  if (DEMO_MODE) {
    return NextResponse.json({ deal: { id: params.id, stage } });
  }

  const deal = await db.deal.findUnique({ where: { id: params.id } });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  // CLIENT_ADMIN can only update deals within their own org
  if (member.role === "CLIENT_ADMIN" && deal.orgId !== member.orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await db.deal.update({
    where: { id: params.id },
    data: { stage: stage as Stage },
  });

  return NextResponse.json({ deal: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only ADMIN (agency staff) can delete deals
  if (member.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true });

  const deal = await db.deal.findUnique({ where: { id: params.id } });
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  await db.deal.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
