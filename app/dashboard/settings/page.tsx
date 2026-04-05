import { redirect } from "next/navigation";
import { getCurrentMember, getCurrentOrg } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const [member, org] = await Promise.all([getCurrentMember(), getCurrentOrg()]);
  if (!member || !org) redirect("/sign-in");

  let members: Awaited<ReturnType<typeof db.member.findMany>> = [];
  let onboarding: Awaited<ReturnType<typeof db.onboarding.findUnique>> = null;
  try {
    [members, onboarding] = await Promise.all([
      db.member.findMany({ where: { orgId: org.id }, orderBy: { createdAt: "asc" } }),
      db.onboarding.findUnique({ where: { orgId: org.id } }),
    ]);
  } catch {
    members = [];
    onboarding = null;
  }

  return (
    <SettingsClient
      member={{ id: member.id, name: member.name, email: member.email, role: member.role }}
      org={{ id: org.id, name: org.name, plan: org.plan, status: org.status, mrr: org.mrr, timezone: org.timezone, website: org.website }}
      members={members.map((m) => ({ id: m.id, name: m.name, email: m.email, role: m.role }))}
      bookingLink={onboarding?.bookingLink ?? null}
    />
  );
}
