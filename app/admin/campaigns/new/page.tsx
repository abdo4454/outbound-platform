import { db } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/demo-mode";
import { CampaignForm } from "./campaign-form";

export default async function NewCampaignPage({
  searchParams,
}: {
  searchParams: { orgId?: string };
}) {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") redirect("/dashboard");

  const orgs = DEMO_MODE
    ? [
        { id: "demo-1", name: "Acme Corp", plan: "GROWTH", hasInstantly: true },
        { id: "demo-2", name: "TechFlow Inc", plan: "STARTER", hasInstantly: false },
      ]
    : await db.organization
        .findMany({
          where: { status: { not: "CHURNED" } },
          select: {
            id: true,
            name: true,
            plan: true,
            integrations: {
              where: { type: "instantly", status: "connected" },
              select: { id: true },
            },
          },
          orderBy: { name: "asc" },
        })
        .then((rows) =>
          rows.map((o) => ({
            id: o.id,
            name: o.name,
            plan: o.plan,
            hasInstantly: o.integrations.length > 0,
          }))
        )
        .catch(() => []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">New campaign</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a campaign and assign it to a client. Optionally push it directly to Instantly.
        </p>
      </div>
      <CampaignForm orgs={orgs} defaultOrgId={searchParams.orgId} />
    </div>
  );
}
