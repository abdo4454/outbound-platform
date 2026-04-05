import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email";

const Schema = z.object({
  email: z.string().email().toLowerCase(),
});

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = Schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: true }); // Don't reveal whether email exists
  }

  const { email } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  if (user) {
    const token = randomBytes(32).toString("hex");
    const exp = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExp: exp },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Reset your Accelerated Growth password",
      html: `
        <p>Hi ${user.name},</p>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    }).catch(() => {});
  }

  // Always return ok to prevent user enumeration
  return NextResponse.json({ ok: true });
}
