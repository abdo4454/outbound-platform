import { inngest } from "@/lib/inngest";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// Triggered alongside lead/created — enriches the lead via Apollo people/match
// Updates: linkedinUrl, jobTitle, industry, enrichmentData, icpScore
// ---------------------------------------------------------------------------

export const enrichLead = inngest.createFunction(
  { id: "enrich-lead", name: "Enrich lead via Apollo" },
  { event: "lead/created" },
  async ({ event, step }) => {
    const { leadId, email, company } = event.data as {
      leadId: string;
      email: string;
      name?: string;
      company?: string;
    };

    // Skip temp IDs (no DB — happens when DB not configured)
    if (!leadId || leadId.startsWith("temp-")) return { skipped: "no db" };

    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) return { skipped: "no apollo key" };

    const enrichmentData = await step.run("apollo-people-match", async () => {
      return await matchApolloContact(apiKey, email, company);
    });

    if (!enrichmentData) return { skipped: "no match" };

    await step.run("update-lead", async () => {
      const icpScore = calculateIcpScore(enrichmentData);
      await db.lead.update({
        where: { id: leadId },
        data: {
          linkedinUrl: enrichmentData.linkedin_url ?? null,
          jobTitle: enrichmentData.title ?? null,
          industry: enrichmentData.organization?.industry ?? null,
          enrichmentData: enrichmentData as object,
          icpScore,
        },
      });
    });

    return { enriched: true, email };
  }
);

// ---------------------------------------------------------------------------
// Apollo people/match API
// ---------------------------------------------------------------------------

type ApolloOrg = {
  name?: string;
  industry?: string;
  estimated_num_employees?: number;
  annual_revenue?: number;
  website_url?: string;
};

type ApolloPerson = {
  id?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  title?: string;
  seniority?: string;
  linkedin_url?: string;
  city?: string;
  state?: string;
  country?: string;
  employment_history?: { title?: string; organization_name?: string; current?: boolean }[];
  organization?: ApolloOrg;
};

async function matchApolloContact(
  apiKey: string,
  email: string,
  company?: string
): Promise<ApolloPerson | null> {
  try {
    const res = await fetch("https://api.apollo.io/v1/people/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        email,
        ...(company ? { organization_name: company } : {}),
        reveal_personal_emails: false,
        reveal_phone_number: false,
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { person?: ApolloPerson };
    return data.person ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// ICP scoring — 0-100 based on seniority, company size, and industry
// Higher = better fit for a B2B outbound agency targeting SaaS companies
// ---------------------------------------------------------------------------

const SENIOR_TITLES = [
  "ceo", "cto", "coo", "cfo", "vp", "vice president",
  "founder", "co-founder", "director", "head of", "chief",
  "owner", "president", "partner",
];

const TECH_INDUSTRIES = [
  "computer software", "internet", "saas", "information technology",
  "technology", "software", "cybersecurity", "fintech", "healthtech",
  "edtech", "devtools", "cloud", "artificial intelligence",
];

function calculateIcpScore(person: ApolloPerson): number {
  let score = 0;

  // Seniority — 30 pts
  const title = (person.title ?? "").toLowerCase();
  if (SENIOR_TITLES.some((t) => title.includes(t))) {
    score += 30;
  } else if (title.includes("manager") || title.includes("lead") || title.includes("senior")) {
    score += 15;
  }

  // Company size — 30 pts (sweet spot: 10-500 employees for outbound services)
  const employees = person.organization?.estimated_num_employees ?? 0;
  if (employees >= 10 && employees <= 100) {
    score += 30;
  } else if (employees > 100 && employees <= 500) {
    score += 20;
  } else if (employees > 1 && employees < 10) {
    score += 10;
  }

  // Industry fit — 25 pts
  const industry = (person.organization?.industry ?? "").toLowerCase();
  if (TECH_INDUSTRIES.some((i) => industry.includes(i))) {
    score += 25;
  }

  // Has LinkedIn — 15 pts (data completeness signal)
  if (person.linkedin_url) {
    score += 15;
  }

  return Math.min(100, score);
}
