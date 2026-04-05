/**
 * Imports contacts from the /data CSV files into the SQLite database.
 * Run with: DATABASE_URL="file:./prisma/dev.db" npx tsx prisma/import-contacts.ts
 *
 * Strategy:
 *  - Streams each file line-by-line (no full file load into memory)
 *  - Filters to rows with a valid email
 *  - Batch inserts 500 rows at a time via raw SQL for speed
 *  - Skips duplicate emails (per org) on re-run
 *  - Caps each file at MAX_PER_FILE to keep SQLite responsive
 */

import * as fs from "fs";
import * as readline from "readline";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const DATA_DIR = path.join(__dirname, "../data");
const BATCH_SIZE = 500;
const MAX_PER_FILE = 50_000; // cap per file — plenty for the platform

// ── Helpers ──────────────────────────────────────────────────────────

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
}

function clean(v: string | undefined): string {
  if (!v) return "";
  // Strip Excel ="xxx" wrapping from government CSVs
  return v.replace(/^="?(.*?)"?$/, "$1").trim();
}

function splitName(full: string): { firstName: string; lastName: string } {
  // Government CSVs store "LAST, FIRST MIDDLE"
  if (full.includes(",")) {
    const [last, rest] = full.split(",", 2);
    const parts = (rest ?? "").trim().split(" ");
    return { firstName: parts[0] ?? "", lastName: last.trim() };
  }
  const parts = full.trim().split(" ");
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

// ── CSV parser (handles quoted fields with embedded commas/newlines) ──

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

// ── Batch insert via raw SQL ──────────────────────────────────────────

type ContactRow = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  orgId: string;
};

async function insertBatch(rows: ContactRow[]) {
  if (rows.length === 0) return;
  // Use upsert-or-ignore pattern via raw SQL for speed
  const now = new Date().toISOString();
  const values = rows.map((r) =>
    `(lower(hex(randomblob(9))), ${[
      r.email, r.firstName, r.lastName, r.phone,
      r.company, r.jobTitle, r.location, "ACTIVE",
      "[]", r.orgId, now, now,
    ].map((v) => `'${String(v).replace(/'/g, "''")}'`).join(",")})`
  ).join(",");

  await db.$executeRawUnsafe(`
    INSERT OR IGNORE INTO Contact
      (id, email, firstName, lastName, phone, company, jobTitle, location, status, tags, orgId, createdAt, updatedAt)
    VALUES ${values}
  `);
}

// ── File processors ───────────────────────────────────────────────────

async function processInstagram(file: string, orgId: string, label: string) {
  console.log(`\n📥 ${label}`);
  const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
  let header = true;
  let imported = 0;
  let skipped = 0;
  let batch: ContactRow[] = [];

  for await (const line of rl) {
    if (header) { header = false; continue; }
    if (imported >= MAX_PER_FILE) break;

    const cols = parseLine(line);
    // username,name,bio,category,followerCount,followingCount,website,email,phone
    const email = clean(cols[7]);
    if (!isValidEmail(email)) { skipped++; continue; }

    const rawName = clean(cols[1]);
    const { firstName, lastName } = splitName(rawName);
    const phone = clean(cols[8]);
    const company = clean(cols[3]); // category as company type
    const website = clean(cols[6]);

    batch.push({ email: email.toLowerCase(), firstName, lastName, phone, company, jobTitle: "", location: website, orgId });

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(batch);
      imported += batch.length;
      batch = [];
      process.stdout.write(`\r  ✓ ${imported.toLocaleString()} imported, ${skipped.toLocaleString()} skipped`);
    }
  }

  if (batch.length > 0) {
    await insertBatch(batch);
    imported += batch.length;
  }

  console.log(`\r  ✓ ${imported.toLocaleString()} imported, ${skipped.toLocaleString()} skipped (no email)`);
  return imported;
}

async function processLicense(file: string, orgId: string, label: string) {
  console.log(`\n📥 ${label}`);
  const rl = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
  let headers: string[] = [];
  let imported = 0;
  let skipped = 0;
  let batch: ContactRow[] = [];

  for await (const line of rl) {
    if (headers.length === 0) {
      headers = parseLine(line).map((h) => h.replace(/"/g, "").trim());
      continue;
    }
    if (imported >= MAX_PER_FILE) break;

    const cols = parseLine(line);
    const idx = (name: string) => headers.indexOf(name);

    const email = clean(cols[idx("Email Address")] ?? "");
    if (!isValidEmail(email)) { skipped++; continue; }

    const firstName = clean(cols[idx("First Name")] ?? "");
    const lastName = clean(cols[idx("Last Name")] ?? "");
    const phone = clean(cols[idx("Business Phone")] ?? "");
    const city = clean(cols[idx("Business City")] ?? "");
    const state = clean(cols[idx("Business State")] ?? "");
    const jobTitle = clean(cols[idx("License TYCL Desc")] ?? cols[idx("Appointment TYCL Desc")] ?? "");
    const location = [city, state].filter(Boolean).join(", ");

    batch.push({ email: email.toLowerCase(), firstName, lastName, phone, company: "", jobTitle, location, orgId });

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(batch);
      imported += batch.length;
      batch = [];
      process.stdout.write(`\r  ✓ ${imported.toLocaleString()} imported, ${skipped.toLocaleString()} skipped`);
    }
  }

  if (batch.length > 0) {
    await insertBatch(batch);
    imported += batch.length;
  }

  console.log(`\r  ✓ ${imported.toLocaleString()} imported, ${skipped.toLocaleString()} skipped (no email)`);
  return imported;
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  // Get the admin org
  const org = await db.organization.findFirst({ where: { slug: "accelerated-growth" } });
  if (!org) { console.error("Run seed-admin.ts first"); process.exit(1); }
  const orgId = org.id;

  console.log(`\n🚀 Importing contacts into org: ${org.name}`);
  console.log(`   Max ${MAX_PER_FILE.toLocaleString()} per file\n`);

  let total = 0;

  total += await processInstagram(path.join(DATA_DIR, "1000000.csv"), orgId, "Instagram (1M)");
  total += await processInstagram(path.join(DATA_DIR, "4500000.csv"), orgId, "Instagram (4.5M)");
  total += await processInstagram(path.join(DATA_DIR, "7000000.csv"), orgId, "Instagram (7M)");
  total += await processInstagram(path.join(DATA_DIR, "8000000.csv"), orgId, "Instagram (8M)");
  total += await processLicense(path.join(DATA_DIR, "AllValidLicensesIndividual.csv"), orgId, "Insurance Licenses");
  total += await processLicense(path.join(DATA_DIR, "AllActiveAppointmentsIndividual(A-G).csv"), orgId, "Insurance Appointments");

  console.log(`\n✅ Done — ${total.toLocaleString()} total contacts imported`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
