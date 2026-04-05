import { getCurrentMember } from "@/lib/auth-helpers";
import { DEMO_MODE } from "@/lib/demo-mode";
import { CheckCircle2, Clock, RefreshCw, Mail } from "lucide-react";

type IntegrationRow = {
  type: string;
  status: string;
  lastSyncAt: Date | null;
  lastSyncStatus: string | null;
};

const TOOL_LABELS: Record<string, string> = {
  instantly: "Instantly.ai",
  apollo: "Apollo.io",
  lemlist: "Lemlist",
};

export default async function IntegrationsPage() {
  const member = await getCurrentMember();

  let integrations: IntegrationRow[] = [];

  if (!DEMO_MODE && member) {
    try {
      const { db } = await import("@/lib/db");
      const org = await db.organization.findUnique({
        where: { id: member.orgId },
      });
      if (org) {
        integrations = await db.integration.findMany({
          where: { orgId: org.id },
          select: {
            type: true,
            status: true,
            lastSyncAt: true,
            lastSyncStatus: true,
          },
          orderBy: { type: "asc" },
        });
      }
    } catch {
      // DB not configured
    }
  }

  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@acceleratedgrowth.com";

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-sm text-gray-500">
        Your outbound infrastructure is fully managed by your account manager.
        Campaign data syncs automatically every 15 minutes.
      </p>

      {/* Sync status panel */}
      <div className="card">
        <h3 className="font-display font-bold text-gray-900 mb-4">Connected Tools</h3>

        {integrations.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Your account manager is setting up your campaigns.</p>
            <p className="mt-1">Data will appear here once syncing starts.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {integrations.map((i) => (
              <div
                key={i.type}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {TOOL_LABELS[i.type] ?? i.type}
                    </div>
                    {i.lastSyncAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <RefreshCw className="w-3 h-3" />
                        Last synced{" "}
                        {new Date(i.lastSyncAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={
                    i.status === "connected" && i.lastSyncStatus !== "error"
                      ? "badge-success"
                      : i.lastSyncStatus === "error"
                      ? "badge-warning"
                      : "badge-gray"
                  }
                >
                  {i.lastSyncStatus === "error" ? "Sync error" : "Live"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sync cadence info */}
      <div className="card bg-gray-50 border-0">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">How syncing works</h3>
        <ul className="space-y-2 text-sm text-gray-500">
          <li className="flex items-start gap-2">
            <RefreshCw className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
            Campaign stats (emails sent, open rates, reply rates) refresh every 15 minutes
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
            Meeting bookings sync in real-time via your booking link
          </li>
          <li className="flex items-start gap-2">
            <Mail className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
            If you notice missing data, contact your account manager
          </li>
        </ul>
      </div>

      {/* Contact CTA */}
      <p className="text-sm text-gray-400">
        Questions about your setup?{" "}
        <a
          href={`mailto:${supportEmail}`}
          className="text-brand-600 hover:underline font-medium"
        >
          Message your account manager
        </a>
      </p>
    </div>
  );
}
