import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { attachSession } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/email";

const Schema = z.object({
  name: z.string().min(1).max(120).trim(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  inviteToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, password, inviteToken } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({ data: { name, email, passwordHash } });

  let orgId: string | undefined;

  // Accept pending invite if token provided
  if (inviteToken) {
    const invite = await db.userInvite.findUnique({ where: { token: inviteToken } });
    if (invite && !invite.acceptedAt && invite.expiresAt > new Date()) {
      const member = await db.member.create({
        data: {
          userId: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar ?? undefined,
          orgId: invite.orgId,
          role: invite.role,
        },
      });
      await db.userInvite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      });
      orgId = member.orgId;
    }
  }

  sendWelcomeEmail(email, name).catch(() => {});

  const redirectTo = orgId ? "/onboarding" : "/pending";
  const res = NextResponse.json({ ok: true, redirectTo });
  return attachSession(res, { sub: user.id, email: user.email, orgId });
}
