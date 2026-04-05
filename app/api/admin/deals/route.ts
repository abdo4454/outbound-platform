import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { z } from "zod";
import { DEMO_MODE } from "@/lib/demo-mode";

const CreateDealSchema = z.object({
  title: z.string().min(1).max(200),
  value: z.number().int().min(0), // monthly value in cents
  stage: z.enum(["DISCOVERY_BOOKED", "DISCOVERY_COMPLETE", "PROPOSAL_SENT", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]).default("DISCOVERY_BOOKED"),
  services: z.array(z.string()).default(["cold_email"]),
  orgId: z.string().optional(), // which client org this deal is for (ADMIN-only field)
});

export async function GET(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (member.role !== "ADMIN" && member.role !== "CLIENT_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ deals: [] });

  try {
    const orgId = member.role === "ADMIN"
      ? (req.nextUrl.searchParams.get("orgId") ?? undefined)
      : member.orgId;

    const deals = await db.deal.findMany({
      where: orgId ? { orgId } : undefined,
      orderBy: { createdAt: "desc" },
      include: { leads: { select: { email: true, name: true, company: true } } },
    });
    return NextResponse.json({ deals });
  } catch {
    return NextResponse.json({ deals: [] });
  }
}

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (member.role !== "ADMIN" && member.role !== "CLIENT_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = CreateDealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, value, stage, services, orgId } = parsed.data;

  // Only ADMIN (agency staff) can create deals for a different org
  const targetOrgId = (member.role === "ADMIN" && orgId) ? orgId : member.orgId;

  if (DEMO_MODE) {
    return NextResponse.json({ deal: { id: "demo", title, value, stage, orgId: targetOrgId } }, { status: 201 });
  }

  try {
    const deal = await db.deal.create({
      data: {
        title,
        value,
        stage,
        services: JSON.stringify(services),
        orgId: targetOrgId,
        assignedToId: member.id,
      },
      include: { leads: { select: { email: true, name: true, company: true } } },
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
