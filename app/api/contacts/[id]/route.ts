import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contact = await db.contact.findUnique({ where: { id: params.id } });
  if (!contact || contact.orgId !== member.orgId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const allowed = ["status", "tags", "firstName", "lastName", "phone", "company", "jobTitle", "location", "companyDomain", "linkedinUrl"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const updated = await db.contact.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contact = await db.contact.findUnique({ where: { id: params.id } });
  if (!contact || contact.orgId !== member.orgId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.contact.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
