import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth-helpers";
import { AdminLayoutClient } from "./admin-layout-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const member = await getCurrentMember();

  if (!member || member.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const initials = member.name
    ? member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "ME";

  return (
    <AdminLayoutClient initials={initials}>
      {children}
    </AdminLayoutClient>
  );
}
