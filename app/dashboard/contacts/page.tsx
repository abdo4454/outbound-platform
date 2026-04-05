import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { ContactsClient } from "./contacts-client";

const PAGE_SIZE = 50;

const INSURANCE_KEYWORDS = [
  "life insurance",
  "health insurance",
  "insurance agent",
  "insurance broker",
  "licensed agent",
  "p&c",
  "property casualty",
  "casualty",
  "annuity",
  "financial advisor",
  "series 6",
  "series 7",
  "series 63",
  "series 65",
  "series 66",
  "producer",
];

type SearchParams = {
  q?: string;
  status?: string;
  source?: string;
  location?: string;
  state?: string;
  hasPhone?: string;
  hasLinkedin?: string;
  hasCompany?: string;
  title?: string;
  company?: string;
  industry?: string;
  unlocked?: string;
  page?: string;
  sort?: string;
};

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const member = await getCurrentMember();
  if (!member) redirect("/sign-in");

  const isAdmin = member.role === "ADMIN";
  const orgId = member.orgId;

  const q = searchParams.q?.trim() ?? "";
  const status = searchParams.status ?? "ALL";
  const source = searchParams.source ?? "all";
  const location = searchParams.location?.trim() ?? "";
  const stateFilter = searchParams.state?.trim() ?? "";
  const hasPhone = searchParams.hasPhone ?? "any";
  const hasLinkedin = searchParams.hasLinkedin ?? "any";
  const hasCompany = searchParams.hasCompany ?? "any";
  const titleFilter = searchParams.title?.trim() ?? "";
  const companyFilter = searchParams.company?.trim() ?? "";
  const industryFilter = searchParams.industry?.trim() ?? "";
  const unlockedFilter = searchParams.unlocked ?? "all";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const sort = searchParams.sort ?? "createdAt_desc";

  // Show global contacts catalog for all users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isGlobal: true };

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (q) {
    where.OR = [
      { email: { contains: q } },
      { firstName: { contains: q } },
      { lastName: { contains: q } },
      { company: { contains: q } },
      { location: { contains: q } },
      { jobTitle: { contains: q } },
    ];
  }

  if (location) {
    where.location = { contains: location };
  }

  if (stateFilter) {
    where.location = { contains: stateFilter };
  }

  if (hasPhone === "yes") {
    where.AND = [...(where.AND ?? []), { phone: { not: null } }, { phone: { not: "" } }];
  } else if (hasPhone === "no") {
    where.AND = [...(where.AND ?? []), { OR: [{ phone: null }, { phone: "" }] }];
  }

  if (hasLinkedin === "yes") {
    where.AND = [...(where.AND ?? []), { linkedinUrl: { not: null } }, { linkedinUrl: { not: "" } }];
  } else if (hasLinkedin === "no") {
    where.AND = [...(where.AND ?? []), { OR: [{ linkedinUrl: null }, { linkedinUrl: "" }] }];
  }

  if (hasCompany === "yes") {
    where.AND = [...(where.AND ?? []), { company: { not: null } }, { company: { not: "" } }];
  } else if (hasCompany === "no") {
    where.AND = [...(where.AND ?? []), { OR: [{ company: null }, { company: "" }] }];
  }

  if (titleFilter) {
    where.AND = [...(where.AND ?? []), { jobTitle: { contains: titleFilter } }];
  }

  if (companyFilter) {
    where.AND = [...(where.AND ?? []), { company: { contains: companyFilter } }];
  }

  if (industryFilter) {
    where.AND = [...(where.AND ?? []), { OR: [
      { industry: { contains: industryFilter } },
      { jobTitle: { contains: industryFilter } },
    ]}];
  }

  // Source filter
  if (source === "instagram") {
    where.AND = [
      ...(where.AND ?? []),
      { OR: [{ jobTitle: null }, { jobTitle: "" }] },
    ];
  } else if (source === "insurance") {
    const insuranceOr = INSURANCE_KEYWORDS.map((kw) => ({
      jobTitle: { contains: kw },
    }));
    where.AND = [...(where.AND ?? []), { OR: insuranceOr }];
  } else if (source === "youtube") {
    where.AND = [...(where.AND ?? []), { companyDomain: { contains: "youtube" } }];
  }

  // Sort
  let orderBy: Record<string, string> | Record<string, string>[] = { createdAt: "desc" };
  if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
  else if (sort === "name_asc") orderBy = [{ firstName: "asc" }, { lastName: "asc" }];
  else if (sort === "email_asc") orderBy = { email: "asc" };
  else if (sort === "company_asc") orderBy = { company: "asc" };

  const skip = (page - 1) * PAGE_SIZE;

  // Fetch unlocked contact IDs for this org
  const unlockedRecords = await db.contactUnlock.findMany({
    where: { orgId },
    select: { contactId: true },
  });
  const unlockedSet = new Set(unlockedRecords.map((u) => u.contactId));

  // For unlocked filter: get IDs to filter by
  let contactIds: string[] | undefined;
  if (unlockedFilter === "unlocked" && unlockedSet.size > 0) {
    contactIds = Array.from(unlockedSet);
    where.id = { in: contactIds };
  } else if (unlockedFilter === "locked") {
    if (unlockedSet.size > 0) {
      where.id = { notIn: Array.from(unlockedSet) };
    }
  }

  const [contacts, total, statusGroups, org] = await Promise.all([
    db.contact.findMany({
      where,
      orderBy,
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        jobTitle: true,
        company: true,
        companyDomain: true,
        linkedinUrl: true,
        location: true,
        state: true,
        industry: true,
        status: true,
        tags: true,
        enrichmentData: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    db.contact.count({ where }),
    db.contact.groupBy({
      by: ["status"],
      where: { isGlobal: true },
      _count: { id: true },
    }),
    db.organization.findUnique({
      where: { id: orgId },
      select: { creditBalance: true },
    }),
  ]);

  // Build stats
  const statsMap: Record<string, number> = {};
  for (const g of statusGroups) {
    statsMap[g.status] = g._count.id;
  }
  const totalAll = Object.values(statsMap).reduce((a, b) => a + b, 0);
  const stats = {
    total: totalAll,
    active: statsMap["ACTIVE"] ?? 0,
    replied: statsMap["REPLIED"] ?? 0,
    meetingBooked: statsMap["MEETING_BOOKED"] ?? 0,
    bounced: statsMap["BOUNCED"] ?? 0,
    unsubscribed: statsMap["UNSUBSCRIBED"] ?? 0,
    doNotContact: statsMap["DO_NOT_CONTACT"] ?? 0,
  };

  const creditBalance = org?.creditBalance ?? 0;

  const serialized = contacts.map((c) => {
    const isUnlocked = isAdmin || unlockedSet.has(c.id);
    return {
      id: c.id,
      // Mask email/phone for locked contacts (non-admin)
      email: isUnlocked ? c.email : maskEmail(c.email),
      emailFull: isUnlocked ? c.email : null,
      phone: isUnlocked ? (c.phone ?? null) : (c.phone ? "••••••••" : null),
      firstName: c.firstName,
      lastName: c.lastName,
      jobTitle: c.jobTitle,
      company: c.company,
      companyDomain: c.companyDomain,
      linkedinUrl: isUnlocked ? c.linkedinUrl : null,
      location: c.location,
      state: c.state,
      industry: c.industry,
      status: c.status,
      tags: c.tags,
      enrichmentData: c.enrichmentData,
      isUnlocked,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  });

  return (
    <ContactsClient
      contacts={serialized}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      stats={stats}
      creditBalance={creditBalance}
      isAdmin={isAdmin}
      currentParams={{
        q: searchParams.q,
        status: searchParams.status,
        source: searchParams.source,
        location: searchParams.location,
        state: searchParams.state,
        hasPhone: searchParams.hasPhone,
        hasLinkedin: searchParams.hasLinkedin,
        hasCompany: searchParams.hasCompany,
        title: searchParams.title,
        company: searchParams.company,
        industry: searchParams.industry,
        unlocked: searchParams.unlocked,
        page: searchParams.page,
        sort: searchParams.sort,
      }}
    />
  );
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const prefix = local.slice(0, 2);
  return `${prefix}${"*".repeat(Math.max(3, local.length - 2))}@${domain}`;
}
