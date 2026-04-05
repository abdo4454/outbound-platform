import { DEMO_MODE, DEMO_MEMBER, DEMO_ORG } from "@/lib/demo-mode";
import { getSession } from "@/lib/session";

export async function getCurrentMember() {
  if (DEMO_MODE) return DEMO_MEMBER;
  const session = await getSession();
  if (!session) return null;
  const { db } = await import("@/lib/db");
  return db.member.findFirst({
    where: { userId: session.sub },
    include: { org: true },
  });
}

export async function getCurrentOrg() {
  if (DEMO_MODE) return DEMO_ORG;
  const member = await getCurrentMember();
  return member?.org ?? null;
}

export async function requireAdminRole() {
  if (DEMO_MODE) return DEMO_MEMBER;
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") {
    throw new Error("Unauthorized: admin role required");
  }
  return member;
}
