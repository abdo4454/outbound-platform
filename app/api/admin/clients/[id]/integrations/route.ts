import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/encryption";
import { DEMO_MODE } from "@/lib/demo-mode";

const ALLOWED_TYPES = ["instantly", "apollo", "lemlist"] as const;
type IntegrationType = typeof ALLOWED_TYPES[number];

/** GET /api/admin/clients/[id]/integrations — list integrations for a client org */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ integrations: [] });

  const org = await db.organization.findUnique({ where: { id: params.id } });
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const integrations = await db.integration.findMany({
    where: { orgId: org.id },
    select: {
      id: true,
      type: true,
      status: true,
      lastSyncAt: true,
      lastSyncStatus: true,
      lastSyncError: true,
      // Never return accessToken to the client
    },
  });

  return NextResponse.json({ integrations });
}

/** POST /api/admin/clients/[id]/integrations — add/update an integration for a client org */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json().catch(() => ({})) as { type?: string; apiKey?: string };
  const { type, apiKey } = body;

  if (!type || !ALLOWED_TYPES.includes(type as IntegrationType)) {
    return NextResponse.json({ error: "Invalid integration type" }, { status: 400 });
  }
  if (!apiKey?.trim()) {
    return NextResponse.json({ error: "apiKey is required" }, { status: 400 });
  }

  const org = await db.organization.findUnique({ where: { id: params.id } });
  if (!org) return NextResponse.json({ error: "Client org not found" }, { status: 404 });

  let encryptedKey: string;
  try {
    encryptedKey = encrypt(apiKey.trim());
  } catch {
    return NextResponse.json(
      { error: "Encryption key not configured on server. Set ENCRYPTION_KEY env var." },
      { status: 500 }
    );
  }

  await db.integration.upsert({
    where: { orgId_type: { orgId: org.id, type } },
    create: {
      orgId: org.id,
      type,
      status: "connected",
      accessToken: encryptedKey,
    },
    update: {
      status: "connected",
      accessToken: encryptedKey,
      lastSyncAt: null,
      lastSyncStatus: null,
      lastSyncError: null,
    },
  });

  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/clients/[id]/integrations — remove an integration */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const actor = await getCurrentMember();
  if (!actor || actor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true });

  const body = await req.json().catch(() => ({})) as { type?: string };
  if (!body.type) return NextResponse.json({ error: "type is required" }, { status: 400 });

  const org = await db.organization.findUnique({ where: { id: params.id } });
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const integration = await db.integration.findUnique({
    where: { orgId_type: { orgId: org.id, type: body.type } },
  });
  if (!integration) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.integration.delete({ where: { id: integration.id } });
  return NextResponse.json({ ok: true });
}

async function getDecryptedApiKey(orgId: string, type: string): Promise<string | null> {
  const integration = await db.integration.findUnique({
    where: { orgId_type: { orgId, type } },
  });
  if (!integration?.accessToken) return null;
  try {
    return decrypt(integration.accessToken);
  } catch {
    return null;
  }
}
