import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { DEMO_MODE } from "@/lib/demo-mode";

const VALID_STATUSES = [
  "NEW", "CONTACTED", "QUALIFIED", "DISCOVERY_BOOKED", "DISCOVERY_COMPLETE",
  "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST", "DISQUALIFIED",
] as const;

/** PATCH /api/admin/leads/[id] — update lead status */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json().catch(() => ({})) as { status?: string };
  if (!body.status || !VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const lead = await db.lead.findUnique({ where: { id: params.id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.lead.update({
    where: { id: params.id },
    data: {
      status: body.status as typeof VALID_STATUSES[number],
      convertedAt: body.status === "WON" ? new Date() : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/leads/[id] — delete a lead */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const lead = await db.lead.findUnique({ where: { id: params.id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.lead.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
