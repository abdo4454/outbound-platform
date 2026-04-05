/**
 * Demo mode — platform runs fully without any external services configured.
 * Set DEMO_MODE=true in .env.local to enable.
 */

export const DEMO_MODE = process.env.DEMO_MODE === "true";

export const DEMO_ORG = {
  id: "demo-org-id",
  clerkOrgId: null as string | null,
  name: "Acme Corp (Demo)",
  slug: "acme-corp-demo",
  inviteCode: "demo-invite-code",
  logo: null as string | null,
  website: null as string | null,
  industry: null as string | null,
  plan: "GROWTH" as const,
  status: "ACTIVE" as const,
  stripeCustomerId: null as string | null,
  stripeSubscriptionId: null as string | null,
  stripePriceId: null as string | null,
  billingEmail: null as string | null,
  mrr: 500000,
  brandColors: null as unknown,
  timezone: "America/New_York",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-15"),
};

export const DEMO_MEMBER = {
  id: "demo-member-id",
  userId: "demo_user",
  orgId: "demo-org-id",
  role: "ADMIN" as const,
  name: "Demo Admin",
  email: "demo@accelratedgrowth.com",
  avatar: null as string | null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  org: DEMO_ORG,
};
