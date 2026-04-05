import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { inngest } from "@/lib/inngest";
import { DEMO_MODE } from "@/lib/demo-mode";

export async function GET() {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (DEMO_MODE) return NextResponse.json({ integrations: [] });

  try {
    const integrations = await db.integration.findMany({
      where: { orgId: member.orgId },
      select: {
        id: true, type: true, status: true,
        lastSyncAt: true, lastSyncStatus: true, lastSyncError: true,
      },
    });
    return NextResponse.json({ integrations });
  } catch {
    return NextResponse.json({ integrations: [] });
  }
}

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (member.role !== "ADMIN" && member.role !== "CLIENT_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json();
  const { type, apiKey } = body as { type?: string; apiKey?: string };

  if (!type || !apiKey?.trim()) {
    return NextResponse.json({ error: "type and apiKey are required" }, { status: 400 });
  }

  const ALLOWED_TYPES = ["instantly", "apollo", "lemlist"];
  if (!ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid integration type" }, { status: 400 });
  }

  try {
    let encryptedKey: string;
    try {
      encryptedKey = encrypt(apiKey.trim());
    } catch {
      return NextResponse.json(
        { error: "Server encryption key not configured. Contact your administrator." },
        { status: 500 }
      );
    }

    await db.integration.upsert({
      where: { orgId_type: { orgId: member.orgId, type } },
      create: { orgId: member.orgId, type, status: "connected", accessToken: encryptedKey },
      update: { status: "connected", accessToken: encryptedKey, lastSyncAt: null, lastSyncStatus: null, lastSyncError: null },
    });

    if (type === "apollo") {
      await inngest.send({ name: "integration/connected", data: { orgId: member.orgId, type } }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save integration" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (member.role !== "ADMIN" && member.role !== "CLIENT_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const { type } = await req.json() as { type?: string };
  if (!type) return NextResponse.json({ error: "type is required" }, { status: 400 });

  try {
    const integration = await db.integration.findUnique({
      where: { orgId_type: { orgId: member.orgId, type } },
    });
    if (!integration) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.integration.delete({ where: { id: integration.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete integration" }, { status: 500 });
  }
}
