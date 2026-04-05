import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { DEMO_MODE } from "@/lib/demo-mode";

function generateCode(name: string): string {
  const base = name
    .split(" ")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${suffix}`;
}

export async function GET() {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ referrals: [] });

  try {
    const referrals = await db.referral.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ referrals });
  } catch {
    return NextResponse.json({ referrals: [] });
  }
}

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json().catch(() => ({})) as {
    referrerEmail?: string;
    referrerName?: string;
    commissionType?: string;
    commissionValue?: number;
    code?: string;
  };

  if (!body.referrerEmail?.trim()) {
    return NextResponse.json({ error: "referrerEmail is required" }, { status: 400 });
  }

  const VALID_TYPES = ["flat", "percentage", "recurring"];
  const commissionType = VALID_TYPES.includes(body.commissionType ?? "") ? body.commissionType! : "flat";
  const commissionValue = typeof body.commissionValue === "number" && body.commissionValue >= 0
    ? body.commissionValue
    : 0;

  // Generate a unique code
  let code = body.code?.trim() || generateCode(body.referrerName || body.referrerEmail);
  // Ensure uniqueness
  const existing = await db.referral.findUnique({ where: { code } }).catch(() => null);
  if (existing) {
    code = code + "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
  }

  try {
    const referral = await db.referral.create({
      data: {
        code,
        referrerEmail: body.referrerEmail.trim(),
        referrerName: body.referrerName?.trim() ?? null,
        commissionType,
        commissionValue,
        status: "active",
      },
    });
    return NextResponse.json({ referral }, { status: 201 });
  } catch (err) {
    console.error("Create referral error:", err);
    return NextResponse.json({ error: "Failed to create referral" }, { status: 500 });
  }
}
