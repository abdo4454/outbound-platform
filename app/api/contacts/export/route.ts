import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

function escape(v: string | null | undefined): string {
  return `"${(v ?? "").replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const orgId = member.orgId;

  // Specific IDs export
  const ids = searchParams.get("ids");
  if (ids) {
    const idList = ids.split(",").filter(Boolean);
    const contacts = await db.contact.findMany({
      where: { id: { in: idList }, orgId },
    });
    return buildCsvResponse(contacts);
  }

  // Filtered export (same logic as page)
  const q = searchParams.get("q")?.trim();
  const status = searchParams.get("status");
  const location = searchParams.get("location")?.trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { orgId };
  if (status && status !== "ALL") where.status = status;
  if (location) where.location = { contains: location };
  if (q) {
    where.OR = [
      { email: { contains: q } },
      { firstName: { contains: q } },
      { lastName: { contains: q } },
      { company: { contains: q } },
      { location: { contains: q } },
    ];
  }

  const source = searchParams.get("source");
  if (source === "insurance") {
    where.jobTitle = { not: "" };
  } else if (source === "instagram") {
    where.jobTitle = { equals: "" };
  }

  const contacts = await db.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100_000,
  });

  return buildCsvResponse(contacts);
}

function buildCsvResponse(contacts: Awaited<ReturnType<typeof db.contact.findMany>>) {
  const header = ["First Name", "Last Name", "Email", "Phone", "Company", "Title", "Location", "Status", "Added"].join(",");
  const rows = contacts.map((c) =>
    [
      escape(c.firstName),
      escape(c.lastName),
      escape(c.email),
      escape(c.phone),
      escape(c.company),
      escape(c.jobTitle),
      escape(c.location),
      escape(c.status),
      escape(c.createdAt.toLocaleDateString("en-US")),
    ].join(",")
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="contacts-${Date.now()}.csv"`,
    },
  });
}
