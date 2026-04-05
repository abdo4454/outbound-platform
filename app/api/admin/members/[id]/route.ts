import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { z } from "zod";

const VALID_ROLES = ["ADMIN", "CLIENT_ADMIN", "MANAGER", "VIEWER"] as const;

const patchSchema = z.object({
  role: z.enum(VALID_ROLES),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Prevent changing your own role
  if (actor.id === params.id) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const updated = await db.member.update({
    where: { id: params.id },
    data: { role: parsed.data.role },
  });

  return NextResponse.json({ id: updated.id, role: updated.role });
}
