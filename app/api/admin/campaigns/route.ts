import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { z } from "zod";
import { DEMO_MODE } from "@/lib/demo-mode";

const CreateCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  orgId: z.string().min(1),
  type: z.enum(["COLD_EMAIL", "LINKEDIN", "MULTI_CHANNEL"]).default("COLD_EMAIL"),
  sendingEmail: z.string().email().optional().or(z.literal("")),
  sendingDomain: z.string().optional().or(z.literal("")),
  dailyLimit: z.number().int().min(1).max(500).optional(),
  targetAudience: z.string().max(1000).optional(),
  pushToInstantly: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (member.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (DEMO_MODE) return NextResponse.json({ campaigns: [] });

  try {
    const orgId = req.nextUrl.searchParams.get("orgId") ?? undefined;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const campaigns = await db.campaign.findMany({
      where: orgId ? { orgId } : undefined,
      include: {
        org: { select: { id: true, name: true } },
        metrics: { where: { date: { gte: thirtyDaysAgo } } },
        sequences: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch {
    return NextResponse.json({ campaigns: [] });
  }
}

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (member.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = CreateCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, orgId, type, sendingEmail, sendingDomain, dailyLimit, targetAudience, pushToInstantly } = parsed.data;

  if (DEMO_MODE) {
    return NextResponse.json({
      campaign: { id: "demo", name, orgId, type, status: "DRAFT" },
    }, { status: 201 });
  }

  try {
    // Verify the target org exists
    const org = await db.organization.findUnique({ where: { id: orgId } });
    if (!org) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    let externalId: string | undefined;
    let externalTool: string | undefined;

    // Optionally push to Instantly
    if (pushToInstantly) {
      const integration = await db.integration.findUnique({
        where: { orgId_type: { orgId, type: "instantly" } },
      });

      if (integration?.accessToken) {
        try {
          const apiKey = decrypt(integration.accessToken);
          const instantlyId = await createInstantlyCampaign(apiKey, name, sendingDomain, dailyLimit);
          if (instantlyId) {
            externalId = instantlyId;
            externalTool = "instantly";
          }
        } catch (err) {
          // Don't fail the whole request — just skip Instantly push
          console.error("Instantly push failed:", err);
        }
      }
    }

    const campaign = await db.campaign.create({
      data: {
        name,
        orgId,
        type,
        status: "DRAFT",
        sendingEmail: sendingEmail || null,
        sendingDomain: sendingDomain || null,
        dailyLimit: dailyLimit ?? null,
        targetAudience: targetAudience || null,
        externalId: externalId ?? null,
        externalTool: externalTool ?? null,
      },
      include: {
        org: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

// Push a new campaign to Instantly.ai and return its campaign ID
async function createInstantlyCampaign(
  apiKey: string,
  name: string,
  sendingDomain?: string,
  dailyLimit?: number,
): Promise<string | null> {
  const body: Record<string, unknown> = {
    name,
    campaign_schedule: {
      schedules: [
        {
          name: "Default",
          timing: { from: "08:00", to: "17:00" },
          days: { 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false },
          timezone: "America/New_York",
        },
      ],
    },
    sequences: [],
    options: {
      open_tracking: true,
      link_tracking: false,
      stop_on_auto_reply: true,
      stop_on_out_of_office: true,
      daily_limit: dailyLimit ?? 50,
    },
  };

  if (sendingDomain) {
    body.sending_domain = sendingDomain;
  }

  const res = await fetch("https://api.instantly.ai/api/v2/campaigns", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Instantly API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json() as { id?: string };
  return data.id ?? null;
}
