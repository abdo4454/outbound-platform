import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminRole } from "@/lib/auth-helpers";
import { slugify } from "@/lib/utils";
import { sendEmail } from "@/lib/email";

const VALID_PLANS = ["STARTER", "GROWTH", "SCALE", "ENTERPRISE"] as const;

export async function POST(req: NextRequest) {
  await requireAdminRole();

  const body = await req.json().catch(() => ({})) as {
    name?: string;
    email?: string;
    plan?: string;
  };
  const { name, email, plan } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }

  const normalizedPlan = VALID_PLANS.includes(plan as (typeof VALID_PLANS)[number])
    ? (plan as (typeof VALID_PLANS)[number])
    : "STARTER";

  // Create org
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;
  while (await db.organization.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const org = await db.organization.create({
    data: { name, slug, plan: normalizedPlan, status: "ONBOARDING" },
  });

  await db.onboarding.create({ data: { orgId: org.id } });

  // Create invite token (7-day expiry)
  const invite = await db.userInvite.create({
    data: {
      email,
      orgId: org.id,
      role: "CLIENT_ADMIN",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?token=${invite.token}`;

  await sendEmail({
    to: email,
    subject: `You're invited to ${name} on Accelerated Growth`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#1a1f35;">You've been invited</h2>
        <p>You've been invited to access the <strong>${name}</strong> dashboard on Accelerated Growth.</p>
        <p>Click the button below to create your account and get started:</p>
        <a href="${inviteUrl}"
           style="display:inline-block;background:#3366ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Accept Invite →
        </a>
        <p style="color:#666;font-size:14px;">This invite expires in 7 days. If you didn't expect this, you can ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true, orgId: org.id, inviteToken: invite.token });
}
