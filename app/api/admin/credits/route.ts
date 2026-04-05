import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

// POST /api/admin/credits — add or set credits for an org
export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({})) as {
    orgId?: string;
    amount?: number;
    mode?: "add" | "set";
  };

  const { orgId, amount, mode = "add" } = body;
  if (!orgId || typeof amount !== "number" || amount < 0) {
    return NextResponse.json({ error: "orgId and positive amount required" }, { status: 400 });
  }

  const org = await db.organization.findUnique({ where: { id: orgId } });
  if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

  const updated = await db.organization.update({
    where: { id: orgId },
    data: mode === "set"
      ? { creditBalance: amount }
      : { creditBalance: { increment: amount } },
    select: { id: true, name: true, creditBalance: true },
  });

  return NextResponse.json(updated);
}
