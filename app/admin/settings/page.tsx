import { db } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { AdminSettingsClient } from "./settings-client";

async function getAllMembers() {
  try {
    return await db.member.findMany({
      include: { org: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminSettingsPage() {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") redirect("/dashboard");

  const members = await getAllMembers();

  return <AdminSettingsClient currentMemberId={member.id} members={members} />;
}
