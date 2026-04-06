"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Org = { id: string; name: string; plan: string; hasInstantly: boolean };

export function CampaignForm({ orgs, defaultOrgId }: { orgs: Org[]; defaultOrgId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [orgId, setOrgId] = useState(defaultOrgId ?? "");
  const [type, setType] = useState<"COLD_EMAIL" | "LINKEDIN" | "MULTI_CHANNEL">("COLD_EMAIL");
  const [sendingEmail, setSendingEmail] = useState("");
  const [sendingDomain, setSendingDomain] = useState("");
  const [dailyLimit, setDailyLimit] = useState("50");
  const [targetAudience, setTargetAudience] = useState("");
  const [pushToInstantly, setPushToInstantly] = useState(false);

  const selectedOrg = orgs.find((o) => o.id === orgId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          orgId,
          type,
          sendingEmail: sendingEmail || undefined,
          sendingDomain: sendingDomain || undefined,
          dailyLimit: dailyLimit ? parseInt(dailyLimit) : undefined,
          targetAudience: targetAudience || undefined,
          pushToInstantly,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.formErrors?.[0] ?? data.error ?? "Failed to create campaign");
        return;
      }

      router.push(`/admin/campaigns/${data.campaign.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className="card space-y-5">
        <h2 className="font-display font-bold text-gray-900">Campaign details</h2>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Campaign name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Q2 SaaS Founders Outreach"
            required
            className="input w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Assign to client *</label>
          <select
            value={orgId}
            onChange={(e) => { setOrgId(e.target.value); setPushToInstantly(false); }}
            required
            className="input w-full"
          >
            <option value="">Select a client…</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.plan})
              </option>
            ))}
          </select>
          {selectedOrg && (
            <p className="text-xs text-gray-400 mt-1">
              {selectedOrg.hasInstantly
                ? "Instantly integration connected — you can push this campaign directly."
                : "No Instantly integration yet — campaign will be created in-app only."}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Campaign type</label>
          <div className="flex gap-3">
            {(["COLD_EMAIL", "LINKEDIN", "MULTI_CHANNEL"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  type === t
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                )}
              >
                {t === "COLD_EMAIL" ? "Cold Email" : t === "LINKEDIN" ? "LinkedIn" : "Multi-channel"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sending config */}
      <div className="card space-y-5">
        <h2 className="font-display font-bold text-gray-900">Sending configuration</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Sending email</label>
            <input
              type="email"
              value={sendingEmail}
              onChange={(e) => setSendingEmail(e.target.value)}
              placeholder="outreach@clientdomain.com"
              className="input w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Sending domain</label>
            <input
              type="text"
              value={sendingDomain}
              onChange={(e) => setSendingDomain(e.target.value)}
              placeholder="clientdomain.com"
              className="input w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Daily sending limit</label>
          <input
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            min={1}
            max={500}
            className="input w-40"
          />
          <p className="text-xs text-gray-400">Emails per day (max 500)</p>
        </div>
      </div>

      {/* Targeting */}
      <div className="card space-y-5">
        <h2 className="font-display font-bold text-gray-900">Target audience</h2>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Audience notes</label>
          <textarea
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            rows={3}
            placeholder="e.g. SaaS founders 10-100 employees, US/CA, Series A funded…"
            className="input w-full resize-none"
          />
        </div>
      </div>

      {/* Instantly push */}
      {selectedOrg?.hasInstantly && (
        <div className="card">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={pushToInstantly}
              onChange={(e) => setPushToInstantly(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">Push to Instantly.ai</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Creates this campaign in Instantly automatically. You can then add sequences and email accounts in the Campaign Hub.
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || !name || !orgId}
          className="btn-primary"
        >
          {loading ? "Creating…" : "Create campaign"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
