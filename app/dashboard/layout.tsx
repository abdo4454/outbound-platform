import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth-helpers";
import { DashboardLayoutClient } from "./dashboard-layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getCurrentMember();
  if (!member) redirect("/sign-in");

  const orgName = (member as { org?: { name?: string } }).org?.name ?? "Dashboard";
  const initials = member.name
    ? member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <DashboardLayoutClient orgName={orgName} initials={initials}>
      {children}
    </DashboardLayoutClient>
  );
}
