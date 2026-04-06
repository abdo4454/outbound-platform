import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { z } from "zod";
import { DEMO_MODE } from "@/lib/demo-mode";

const UpdateCampaignSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]).optional(),
  sendingEmail: z.string().email().optional().or(z.literal("")),
  sendingDomain: z.string().optional().or(z.literal("")),
  dailyLimit: z.number().int().min(1).max(500).optional(),
  targetAudience: z.string().max(1000).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (member.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (DEMO_MODE) return NextResponse.json({ campaign: null });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const campaign = await db.campaign.findUnique({
    where: { id: params.id },
    include: {
      org: { select: { id: true, name: true, plan: true } },
      metrics: {
        where: { date: { gte: thirtyDaysAgo } },
        orderBy: { date: "asc" },
      },
      sequences: true,
    },
  });

  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ campaign });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (member.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = UpdateCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true });

  try {
    const existing = await db.campaign.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { name, status, sendingEmail, sendingDomain, dailyLimit, targetAudience } = parsed.data;

    const campaign = await db.campaign.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(status !== undefined && {
          status,
          startedAt: status === "ACTIVE" ? new Date() : undefined,
          pausedAt: status === "PAUSED" ? new Date() : undefined,
        }),
        ...(sendingEmail !== undefined && { sendingEmail: sendingEmail || null }),
        ...(sendingDomain !== undefined && { sendingDomain: sendingDomain || null }),
        ...(dailyLimit !== undefined && { dailyLimit }),
        ...(targetAudience !== undefined && { targetAudience: targetAudience || null }),
      },
      include: { org: { select: { id: true, name: true } } },
    });

    // Sync status change to Instantly if campaign is externally managed
    if (status && existing.externalId && existing.externalTool === "instantly") {
      const integration = await db.integration.findUnique({
        where: { orgId_type: { orgId: existing.orgId, type: "instantly" } },
      });
      if (integration?.accessToken) {
        try {
          const apiKey = decrypt(integration.accessToken);
          await syncStatusToInstantly(apiKey, existing.externalId, status);
        } catch (err) {
          console.error("Instantly status sync failed:", err);
        }
      }
    }

    return NextResponse.json({ campaign });
  } catch {
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (member.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (DEMO_MODE) return NextResponse.json({ ok: true });

  try {
    await db.campaign.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}

async function syncStatusToInstantly(apiKey: string, externalId: string, status: string) {
  // Instantly: PATCH /api/v2/campaigns/{id}
  // status 1 = active, 2 = paused
  const instantly_status = status === "ACTIVE" ? 1 : status === "PAUSED" ? 2 : null;
  if (instantly_status === null) return;

  await fetch(`https://api.instantly.ai/api/v2/campaigns/${externalId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: instantly_status }),
  });
}
