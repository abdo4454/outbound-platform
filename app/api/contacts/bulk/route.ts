import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as {
    ids?: string[];
    action?: string;
    status?: string;
  };

  const { ids, action, status } = body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids required" }, { status: 400 });
  }

  if (action === "delete") {
    const result = await db.contact.deleteMany({
      where: { id: { in: ids }, orgId: member.orgId },
    });
    return NextResponse.json({ deleted: result.count });
  }

  if (action === "status" && status) {
    const result = await db.contact.updateMany({
      where: { id: { in: ids }, orgId: member.orgId },
      data: { status },
    });
    return NextResponse.json({ updated: result.count });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
