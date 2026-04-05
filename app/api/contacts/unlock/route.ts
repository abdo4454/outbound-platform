import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as { ids?: string[] };
  const ids = body.ids;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids required" }, { status: 400 });
  }

  // Admin org (ADMIN role) with 999999 credits never runs out
  const org = await db.organization.findUnique({ where: { id: member.orgId } });
  if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

  // Find which of these are already unlocked (don't charge again)
  const alreadyUnlocked = await db.contactUnlock.findMany({
    where: { orgId: member.orgId, contactId: { in: ids } },
    select: { contactId: true },
  });
  const alreadyUnlockedIds = new Set(alreadyUnlocked.map((u) => u.contactId));
  const toUnlock = ids.filter((id) => !alreadyUnlockedIds.has(id));

  if (toUnlock.length === 0) {
    return NextResponse.json({ unlocked: 0, creditsUsed: 0, balance: org.creditBalance });
  }

  const creditsNeeded = toUnlock.length;
  if (org.creditBalance < creditsNeeded) {
    return NextResponse.json(
      { error: "Insufficient credits", balance: org.creditBalance, needed: creditsNeeded },
      { status: 402 }
    );
  }

  // Deduct credits and create unlock records
  const updatedOrg = await db.organization.update({
    where: { id: member.orgId },
    data: { creditBalance: { decrement: creditsNeeded } },
  });
  await Promise.all(
    toUnlock.map((contactId) =>
      db.contactUnlock.upsert({
        where: { orgId_contactId: { orgId: member.orgId, contactId } },
        create: { orgId: member.orgId, contactId },
        update: {},
      })
    )
  );

  return NextResponse.json({
    unlocked: toUnlock.length,
    creditsUsed: creditsNeeded,
    balance: updatedOrg.creditBalance,
  });
}
