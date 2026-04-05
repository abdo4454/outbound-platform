import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth";
import { attachSession } from "@/lib/session";
import { DEMO_MODE, DEMO_MEMBER } from "@/lib/demo-mode";

const Schema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  // In demo mode bypass DB entirely — any credentials work
  if (DEMO_MODE) {
    const res = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
    return attachSession(res, { sub: DEMO_MEMBER.userId, email, orgId: DEMO_MEMBER.orgId });
  }

  const { db } = await import("@/lib/db");
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Find their org so we can embed orgId in the token
  const member = await db.member.findFirst({ where: { userId: user.id } });
  const redirectTo = member?.orgId ? "/dashboard" : "/pending";

  const res = NextResponse.json({ ok: true, redirectTo });
  return attachSession(res, { sub: user.id, email: user.email, orgId: member?.orgId });
}
