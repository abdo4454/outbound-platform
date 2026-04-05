import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/lib/inngest";

/**
 * Dev-only manual sync trigger.
 * Usage: POST /api/cron/sync
 * Authorization: Bearer <CRON_SECRET>
 *
 * In production, Inngest cron triggers syncAllCampaigns automatically every 15 min.
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  // Validate secret via Authorization header (NOT query params — they get logged)
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgId = req.nextUrl.searchParams.get("orgId");

  if (orgId) {
    await inngest.send({ name: "outbound/sync.requested", data: { orgId } });
  } else {
    await inngest.send({ name: "outbound/sync.all", data: {} });
  }

  return NextResponse.json({ ok: true, triggered: orgId ?? "all" });
}
