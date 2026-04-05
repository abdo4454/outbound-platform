import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { z } from "zod";
import { DEMO_MODE } from "@/lib/demo-mode";

const IcpSchema = z.object({
  step: z.literal("icp"),
  data: z.object({
    industries: z.array(z.string().max(100)).max(20).default([]),
    companySizes: z.array(z.string().max(20)).max(10).default([]),
    geographies: z.string().max(500).default(""),
    titles: z.array(z.string().max(100)).max(20).default([]),
    exclusions: z.string().max(1000).default(""),
  }),
});

const MessagingSchema = z.object({
  step: z.literal("messaging"),
  data: z.object({
    valueProps: z.string().max(2000).default(""),
    tone: z.enum(["professional", "casual", "bold", "friendly"]).default("professional"),
    painPoints: z.string().max(2000).default(""),
    avoidPhrases: z.string().max(500).default(""),
  }),
});

const StepSchema = z.discriminatedUnion("step", [IcpSchema, MessagingSchema]);

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (DEMO_MODE) return NextResponse.json({ ok: true });

  try {
    const org = await db.organization.findUnique({ where: { id: member.orgId } });
    if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

    const rawBody = await req.json();
    const parsed = StepSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const { step, data } = parsed.data;
    const updates: Record<string, unknown> = {};

    if (step === "icp") {
      updates.targetIndustries = data.industries;
      updates.targetCompanySizes = data.companySizes;
      updates.targetGeographies = data.geographies
        .split(",").map((s) => s.trim()).filter(Boolean);
      updates.targetTitles = data.titles;
      updates.exclusions = data.exclusions
        .split(",").map((s) => s.trim()).filter(Boolean);
      updates.icpComplete = true;
    } else if (step === "messaging") {
      updates.valueProps = data.valueProps
        .split("\n").map((s) => s.trim()).filter(Boolean);
      updates.tonePreference = data.tone;
      updates.painPoints = data.painPoints
        .split("\n").map((s) => s.trim()).filter(Boolean);
      updates.avoidPhrases = data.avoidPhrases
        .split(",").map((s) => s.trim()).filter(Boolean);
      updates.messagingComplete = true;
    }

    const updated = await db.onboarding.upsert({
      where: { orgId: org.id },
      create: { orgId: org.id, ...updates },
      update: updates,
    });

    // Activate the org once both ICP and messaging are saved
    if (updated.icpComplete && updated.messagingComplete && org.status === "ONBOARDING") {
      await db.organization.update({
        where: { id: org.id },
        data: { status: "ACTIVE" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 });
  }
}
