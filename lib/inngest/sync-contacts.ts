import { inngest } from "@/lib/inngest";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";

// ---------------------------------------------------------------------------
// Scheduled contact sync — fires every hour
// Pulls contacts from Apollo email sequences into the platform's Contact table
// ---------------------------------------------------------------------------

export const syncAllContacts = inngest.createFunction(
  {
    id: "sync-all-contacts",
    name: "Sync contacts from Apollo sequences",
    concurrency: { limit: 3 },
  },
  { cron: "0 * * * *" },
  async ({ step }) => {
    const integrations = await step.run("fetch-apollo-integrations", () =>
      db.integration.findMany({
        where: { type: "apollo", status: "connected" },
        include: { org: { select: { id: true, name: true } } },
      })
    );

    await Promise.allSettled(
      integrations.map((integration) =>
        step.run(`sync-contacts-org-${integration.orgId}`, () =>
          syncOrgContacts(integration)
        )
      )
    );

    return { synced: integrations.length };
  }
);

// ---------------------------------------------------------------------------
// Manual trigger — fired when an Apollo integration is first connected
// ---------------------------------------------------------------------------

export const syncContactsOnConnect = inngest.createFunction(
  { id: "sync-contacts-on-connect", name: "Sync contacts on integration connect" },
  { event: "integration/connected" },
  async ({ event, step }) => {
    const { orgId, type } = event.data as { orgId: string; type: string };
    if (type !== "apollo") return { skipped: "not apollo" };

    const integration = await step.run("fetch-integration", () =>
      db.integration.findUnique({
        where: { orgId_type: { orgId, type: "apollo" } },
        include: { org: { select: { id: true, name: true } } },
      })
    );

    if (!integration) return { skipped: "not found" };

    await step.run("sync-contacts", () => syncOrgContacts(integration));
    return { synced: true };
  }
);

// ---------------------------------------------------------------------------
// Core sync logic
// ---------------------------------------------------------------------------

type IntegrationRow = {
  id: string;
  orgId: string;
  type: string;
  accessToken: string | null;
  org: { id: string; name: string };
};

async function syncOrgContacts(integration: IntegrationRow) {
  const rawKey = integration.accessToken;
  if (!rawKey) return;

  let apiKey: string;
  try {
    apiKey = decrypt(rawKey);
  } catch {
    await db.integration.update({
      where: { id: integration.id },
      data: { lastSyncError: "Failed to decrypt API key", lastSyncStatus: "error" },
    });
    return;
  }

  try {
    const contacts = await fetchApolloSequenceContacts(apiKey);

    let created = 0;
    let updated = 0;

    for (const contact of contacts) {
      if (!contact.email) continue;

      const existing = await db.contact.findFirst({
        where: { orgId: integration.orgId, email: contact.email },
        select: { id: true },
      });

      const status = mapApolloStatus(contact.emailer_campaign_statuses?.[0]?.status);

      if (existing) {
        await db.contact.update({
          where: { id: existing.id },
          data: {
            firstName: contact.first_name ?? undefined,
            lastName: contact.last_name ?? undefined,
            jobTitle: contact.title ?? undefined,
            company: contact.organization_name ?? undefined,
            linkedinUrl: contact.linkedin_url ?? undefined,
            location: contact.city ? `${contact.city}${contact.state ? `, ${contact.state}` : ""}` : undefined,
            status,
            updatedAt: new Date(),
          },
        });
        updated++;
      } else {
        await db.contact.create({
          data: {
            orgId: integration.orgId,
            email: contact.email,
            firstName: contact.first_name ?? null,
            lastName: contact.last_name ?? null,
            jobTitle: contact.title ?? null,
            company: contact.organization_name ?? null,
            linkedinUrl: contact.linkedin_url ?? null,
            location: contact.city ? `${contact.city}${contact.state ? `, ${contact.state}` : ""}` : null,
            status,
          },
        });
        created++;
      }
    }

    await db.integration.update({
      where: { id: integration.id },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: "success",
        lastSyncError: null,
      },
    });

    return { created, updated };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db.integration.update({
      where: { id: integration.id },
      data: {
        lastSyncAt: new Date(),
        lastSyncStatus: "error",
        lastSyncError: msg.slice(0, 500),
      },
    });
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Apollo API — fetch contacts in active sequences
// ---------------------------------------------------------------------------

type ApolloContact = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  organization_name?: string;
  linkedin_url?: string;
  city?: string;
  state?: string;
  emailer_campaign_statuses?: { status?: string }[];
};

async function fetchApolloSequenceContacts(apiKey: string): Promise<ApolloContact[]> {
  // Apollo /v1/contacts/search — fetch contacts that are/were in sequences
  const res = await fetch("https://api.apollo.io/v1/contacts/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify({
      page: 1,
      per_page: 200,
      sort_by_field: "contact_updated_at",
      sort_ascending: false,
      contact_email_statuses: ["verified", "guessed", "unavailable"],
    }),
  });

  if (!res.ok) {
    throw new Error(`Apollo API error: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { contacts?: ApolloContact[] };
  return data.contacts ?? [];
}

function mapApolloStatus(apolloStatus?: string): "ACTIVE" | "BOUNCED" | "UNSUBSCRIBED" | "REPLIED" | "MEETING_BOOKED" | "DO_NOT_CONTACT" {
  switch (apolloStatus) {
    case "replied": return "REPLIED";
    case "bounced": return "BOUNCED";
    case "unsubscribed": return "UNSUBSCRIBED";
    case "meeting_booked": return "MEETING_BOOKED";
    case "do_not_contact": return "DO_NOT_CONTACT";
    default: return "ACTIVE";
  }
}
