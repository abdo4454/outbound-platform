"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "NEW", label: "New", cls: "badge-brand" },
  { value: "CONTACTED", label: "Contacted", cls: "badge-warning" },
  { value: "QUALIFIED", label: "Qualified", cls: "badge-success" },
  { value: "DISCOVERY_BOOKED", label: "Discovery Booked", cls: "badge-success" },
  { value: "DISCOVERY_COMPLETE", label: "Discovery Done", cls: "badge-success" },
  { value: "PROPOSAL_SENT", label: "Proposal Sent", cls: "badge-warning" },
  { value: "NEGOTIATION", label: "Negotiating", cls: "badge-warning" },
  { value: "WON", label: "Won", cls: "badge-success" },
  { value: "LOST", label: "Lost", cls: "badge-gray" },
  { value: "DISQUALIFIED", label: "Disqualified", cls: "badge-gray" },
];

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  const cfg = STATUSES.find((s) => s.value === current) ?? STATUSES[0];

  async function handleChange(newStatus: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCurrent(newStatus);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={current}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer disabled:opacity-60 ${cfg.cls}`}
      style={{ appearance: "auto" }}
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
