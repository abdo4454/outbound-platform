import { inngest } from "@/lib/inngest";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";

// ---------------------------------------------------------------------------
// Scheduled sync — fires every 15 minutes via Inngest cron
// ---------------------------------------------------------------------------

export const syncAllCampaigns = inngest.createFunction(
  {
    id: "sync-all-campaigns",
    name: "Sync campaigns from outbound tools",
    concurrency: { limit: 5 },
  },
  { cron: "*/15 * * * *" },
  async ({ step }) => {
    const integrations = await step.run("fetch-active-integrations", () =>
      db.integration.findMany({
        where: {
          type: { in: ["instantly", "apollo"] },
          status: "connected",
        },
        include: { org: true },
      })
    );

    // Fan out — one step per org so failures are isolated
    await Promise.allSettled(
      integrations.map((integration) =>
        step.run(`sync-org-${integration.orgId}-${integration.type}`, () =>
          syncOrgIntegration(integration)
        )
      )
    );

    return { synced: integrations.length };
  }
);

// ---------------------------------------------------------------------------
// Manual trigger — POST /api/cron/sync?secret=DEV_SECRET (dev only)
// ---------------------------------------------------------------------------

export const syncOrgManual = inngest.createFunction(
  { id: "sync-org-manual", name: "Manual org sync" },
  { event: "outbound/sync.requested" },
  async ({ event, step }) => {
    const { orgId } = event.data as { orgId: string };

    const integrations = await step.run("fetch-integrations", () =>
      db.integration.findMany({
        where: { orgId, type: { in: ["instantly", "apollo"] }, status: "connected" },
        include: { org: true },
      })
    );

    await Promise.allSettled(
      integrations.map((integration) =>
        step.run(`sync-${integration.type}`, () => syncOrgIntegration(integration))
      )
    );
  }
);

// ---------------------------------------------------------------------------
// Core sync logic per integration
// ---------------------------------------------------------------------------

// Inngest serializes step results as JSON, so Dates become strings.
// This type captures that reality.
type IntegrationRow = {
  id: string;
  orgId: string;
  type: string;
  status: string;
  accessToken: string | null;
  org: { id: string; name: string };
};

async function syncOrgIntegration(integration: IntegrationRow) {
  const orgId = integration.orgId;
  const rawKey = integration.accessToken;

  if (!rawKey) {
    await markSyncResult(integration.id, "error", "No API key configured");
    return;
  }

  // Decrypt the stored API key (handles both encrypted "enc:..." and legacy plaintext)
  let apiKey: string;
  try {
    apiKey = decrypt(rawKey);
  } catch {
    await markSyncResult(integration.id, "error", "Failed to decrypt API key — check ENCRYPTION_KEY");
    return;
  }

  try {
    let campaigns: SyncedCampaign[] = [];

    if (integration.type === "instantly") {
      campaigns = await fetchInstantlyCampaigns(apiKey);
    } else if (integration.type === "apollo") {
      campaigns = await fetchApolloCampaigns(apiKey);
    }

    for (const campaign of campaigns) {
      // Upsert Campaign record
      const dbCampaign = await db.campaign.upsert({
        where: {
          // We use a compound unique on externalId+orgId if it exists, otherwise create
          id: await findCampaignId(orgId, campaign.externalId, integration.type) ?? "new-" + Date.now(),
        },
        create: {
          orgId,
          name: campaign.name,
          status: campaign.isActive ? "ACTIVE" : "PAUSED",
          externalId: campaign.externalId,
          externalTool: integration.type,
          sendingDomain: campaign.sendingDomain ?? null,
        },
        update: {
          name: campaign.name,
          status: campaign.isActive ? "ACTIVE" : "PAUSED",
        },
      });

      // Upsert today's metrics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await db.campaignMetric.upsert({
        where: { campaignId_date: { campaignId: dbCampaign.id, date: today } },
        create: {
          campaignId: dbCampaign.id,
          date: today,
          emailsSent: campaign.metrics.emailsSent,
          emailsDelivered: campaign.metrics.emailsDelivered,
          opens: campaign.metrics.opens,
          uniqueOpens: campaign.metrics.opens,
          replies: campaign.metrics.replies,
          positiveReplies: campaign.metrics.positiveReplies,
          meetingsBooked: campaign.metrics.meetingsBooked,
          bounces: campaign.metrics.bounces,
          unsubscribes: campaign.metrics.unsubscribes,
        },
        update: {
          emailsSent: campaign.metrics.emailsSent,
          emailsDelivered: campaign.metrics.emailsDelivered,
          opens: campaign.metrics.opens,
          uniqueOpens: campaign.metrics.opens,
          replies: campaign.metrics.replies,
          positiveReplies: campaign.metrics.positiveReplies,
          meetingsBooked: campaign.metrics.meetingsBooked,
          bounces: campaign.metrics.bounces,
          unsubscribes: campaign.metrics.unsubscribes,
        },
      });
    }

    await markSyncResult(integration.id, "success", null);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await markSyncResult(integration.id, "error", msg.slice(0, 500));
    throw err; // Inngest will retry
  }
}

async function findCampaignId(
  orgId: string,
  externalId: string,
  tool: string
): Promise<string | undefined> {
  const existing = await db.campaign.findFirst({
    where: { orgId, externalId, externalTool: tool },
    select: { id: true },
  });
  return existing?.id;
}

async function markSyncResult(integrationId: string, status: string, error: string | null) {
  await db.integration.update({
    where: { id: integrationId },
    data: {
      lastSyncAt: new Date(),
      lastSyncStatus: status,
      lastSyncError: error,
    },
  });
}

// ---------------------------------------------------------------------------
// API adapters — replace with real API calls once keys are confirmed
// ---------------------------------------------------------------------------

type SyncedCampaign = {
  externalId: string;
  name: string;
  isActive: boolean;
  sendingDomain?: string;
  metrics: {
    emailsSent: number;
    emailsDelivered: number;
    opens: number;
    replies: number;
    positiveReplies: number;
    meetingsBooked: number;
    bounces: number;
    unsubscribes: number;
  };
};

async function fetchInstantlyCampaigns(apiKey: string): Promise<SyncedCampaign[]> {
  // Instantly API v2: GET /api/v2/campaigns
  // Docs: https://developer.instantly.ai/campaign/campaign/list-campaigns
  const res = await fetch("https://api.instantly.ai/api/v2/campaigns?limit=100", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    throw new Error(`Instantly API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as { items?: InstantlyCampaign[] };
  const campaigns = data.items ?? [];

  return campaigns.map((c) => ({
    externalId: c.id,
    name: c.name,
    isActive: c.status === 1,
    metrics: {
      emailsSent: c.campaign_analytics?.emails_sent ?? 0,
      emailsDelivered: (c.campaign_analytics?.emails_sent ?? 0) - (c.campaign_analytics?.bounced ?? 0),
      opens: c.campaign_analytics?.unique_opened ?? 0,
      replies: c.campaign_analytics?.replied ?? 0,
      positiveReplies: c.campaign_analytics?.positive_reply_count ?? 0,
      meetingsBooked: c.campaign_analytics?.demos_booked_count ?? 0,
      bounces: c.campaign_analytics?.bounced ?? 0,
      unsubscribes: c.campaign_analytics?.unsubscribed ?? 0,
    },
  }));
}

type InstantlyCampaign = {
  id: string;
  name: string;
  status: number;
  campaign_analytics?: {
    emails_sent?: number;
    unique_opened?: number;
    replied?: number;
    positive_reply_count?: number;
    demos_booked_count?: number;
    bounced?: number;
    unsubscribed?: number;
  };
};

async function fetchApolloCampaigns(apiKey: string): Promise<SyncedCampaign[]> {
  // Apollo.io: GET /v1/emailer_campaigns/search
  // NOTE: Confirm Apollo exposes sequence-level stats before relying on this path.
  // If stats are unavailable, fall back to manual entry via admin portal.
  const res = await fetch("https://api.apollo.io/v1/emailer_campaigns/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({ per_page: 100, sort_by_field: "emailer_campaign_created_at" }),
  });

  if (!res.ok) {
    throw new Error(`Apollo API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json() as { emailer_campaigns?: ApolloCampaign[] };
  const campaigns = data.emailer_campaigns ?? [];

  return campaigns.map((c) => ({
    externalId: c.id,
    name: c.name,
    isActive: c.active,
    metrics: {
      emailsSent: c.num_sent_email_steps ?? 0,
      emailsDelivered: c.num_sent_email_steps ?? 0,
      opens: c.unique_opened ?? 0,
      replies: c.num_replied ?? 0,
      positiveReplies: c.num_positive_replied ?? 0,
      meetingsBooked: 0, // Apollo does not expose this directly — requires manual entry
      bounces: c.num_bounced ?? 0,
      unsubscribes: c.num_unsubscribed ?? 0,
    },
  }));
}

type ApolloCampaign = {
  id: string;
  name: string;
  active: boolean;
  num_sent_email_steps?: number;
  unique_opened?: number;
  num_replied?: number;
  num_positive_replied?: number;
  num_bounced?: number;
  num_unsubscribed?: number;
};
