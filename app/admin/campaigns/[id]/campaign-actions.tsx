"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Archive, Trash2 } from "lucide-react";

type Status = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export function CampaignActions({
  campaignId,
  currentStatus,
}: {
  campaignId: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: Status) {
    setLoading(true);
    await fetch(`/api/admin/campaigns/${campaignId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  }

  async function deleteCampaign() {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/admin/campaigns/${campaignId}`, { method: "DELETE" });
    router.push("/admin/outbound");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus === "ACTIVE" && (
        <button
          onClick={() => updateStatus("PAUSED")}
          disabled={loading}
          className="btn-secondary btn-sm flex items-center gap-1.5"
        >
          <Pause className="w-3.5 h-3.5" /> Pause
        </button>
      )}
      {(currentStatus === "DRAFT" || currentStatus === "PAUSED") && (
        <button
          onClick={() => updateStatus("ACTIVE")}
          disabled={loading}
          className="btn-primary btn-sm flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Activate
        </button>
      )}
      {currentStatus !== "ARCHIVED" && (
        <button
          onClick={() => updateStatus("ARCHIVED")}
          disabled={loading}
          className="btn-secondary btn-sm flex items-center gap-1.5"
        >
          <Archive className="w-3.5 h-3.5" /> Archive
        </button>
      )}
      <button
        onClick={deleteCampaign}
        disabled={loading}
        className="btn-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium flex items-center gap-1.5"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  );
}
