import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

const Schema = z.object({
  token: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await req.json().catch(() => null);
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const invite = await db.userInvite.findUnique({
    where: { token: parsed.data.token },
    include: { org: true },
  });

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }
  if (invite.acceptedAt) {
    return NextResponse.json({ error: "Invite already used" }, { status: 410 });
  }
  if (invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite has expired" }, { status: 410 });
  }

  const user = await db.user.findUnique({ where: { id: session.sub } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if already a member
  const existing = await db.member.findUnique({
    where: { userId_orgId: { userId: user.id, orgId: invite.orgId } },
  });

  if (!existing) {
    await db.member.create({
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        orgId: invite.orgId,
        role: invite.role,
      },
    });
  }

  await db.userInvite.update({
    where: { id: invite.id },
    data: { acceptedAt: new Date() },
  });

  // Determine redirect: onboarding if ICP not complete
  const onboarding = await db.onboarding.findUnique({
    where: { orgId: invite.orgId },
  });
  const redirectTo =
    onboarding?.icpComplete && onboarding?.messagingComplete
      ? "/dashboard"
      : "/onboarding";

  return NextResponse.json({ ok: true, redirectTo, orgName: invite.org.name });
}
