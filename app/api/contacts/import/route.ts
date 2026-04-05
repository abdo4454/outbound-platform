import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      fields.push(cur); cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function normalize(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function POST(req: NextRequest) {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return NextResponse.json({ error: "CSV is empty" }, { status: 400 });

  const rawHeaders = parseLine(lines[0]).map((h) => h.replace(/"/g, "").trim());
  const headers = rawHeaders.map(normalize);

  // Flexible column mapping
  const col = (names: string[]) => {
    for (const n of names) {
      const i = headers.indexOf(normalize(n));
      if (i >= 0) return i;
    }
    return -1;
  };

  const emailIdx = col(["email", "email_address", "emailaddress"]);
  if (emailIdx < 0) return NextResponse.json({ error: "CSV must have an email column" }, { status: 400 });

  const firstIdx = col(["first_name", "firstname", "first"]);
  const lastIdx = col(["last_name", "lastname", "last"]);
  const nameIdx = col(["name", "full_name", "fullname"]);
  const phoneIdx = col(["phone", "phone_number", "phonenumber", "mobile"]);
  const companyIdx = col(["company", "organization", "employer"]);
  const titleIdx = col(["job_title", "jobtitle", "title", "position"]);
  const locationIdx = col(["location", "city", "address", "state"]);

  let imported = 0;
  let skipped = 0;
  const BATCH = 500;
  const now = new Date().toISOString();
  const orgId = member.orgId;

  for (let i = 1; i < lines.length; i += BATCH) {
    const batch = lines.slice(i, i + BATCH);
    const rows: string[] = [];

    for (const line of batch) {
      const cols = parseLine(line);
      const email = cols[emailIdx]?.replace(/"/g, "").trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { skipped++; continue; }

      // Split name if needed
      let firstName = firstIdx >= 0 ? (cols[firstIdx] ?? "").replace(/"/g, "").trim() : "";
      let lastName = lastIdx >= 0 ? (cols[lastIdx] ?? "").replace(/"/g, "").trim() : "";
      if (!firstName && !lastName && nameIdx >= 0) {
        const full = (cols[nameIdx] ?? "").replace(/"/g, "").trim();
        const parts = full.split(" ");
        firstName = parts[0] ?? "";
        lastName = parts.slice(1).join(" ");
      }

      const phone = phoneIdx >= 0 ? (cols[phoneIdx] ?? "").replace(/"/g, "").trim() : "";
      const company = companyIdx >= 0 ? (cols[companyIdx] ?? "").replace(/"/g, "").trim() : "";
      const title = titleIdx >= 0 ? (cols[titleIdx] ?? "").replace(/"/g, "").trim() : "";
      const location = locationIdx >= 0 ? (cols[locationIdx] ?? "").replace(/"/g, "").trim() : "";

      const id = `import_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      rows.push(`('${id}', '${email.replace(/'/g, "''")}', '${firstName.replace(/'/g, "''")}', '${lastName.replace(/'/g, "''")}', '${phone.replace(/'/g, "''")}', '${company.replace(/'/g, "''")}', '${title.replace(/'/g, "''")}', '${location.replace(/'/g, "''")}', 'ACTIVE', '[]', '${orgId}', '${now}', '${now}')`);
    }

    if (rows.length > 0) {
      await db.$executeRawUnsafe(`
        INSERT OR IGNORE INTO Contact (id, email, firstName, lastName, phone, company, jobTitle, location, status, tags, orgId, createdAt, updatedAt)
        VALUES ${rows.join(",")}
      `);
      imported += rows.length;
    }
  }

  return NextResponse.json({ imported, skipped });
}
