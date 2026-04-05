"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, X, ChevronRight } from "lucide-react";

const STAGES = [
  { key: "DISCOVERY_BOOKED", label: "Discovery Booked" },
  { key: "DISCOVERY_COMPLETE", label: "Discovery Done" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent" },
  { key: "NEGOTIATION", label: "Negotiating" },
  { key: "CLOSED_WON", label: "Closed Won" },
  { key: "CLOSED_LOST", label: "Closed Lost" },
];

const SERVICES = ["cold_email", "linkedin", "lead_research"];

export function NewDealButton({ orgs }: { orgs: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("DISCOVERY_BOOKED");
  const [services, setServices] = useState(["cold_email"]);
  const [orgId, setOrgId] = useState(orgs[0]?.id ?? "");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          value: Math.round(parseFloat(value) * 100), // dollars → cents
          stage,
          services,
          orgId: orgId || undefined,
        }),
      });
      if (res.ok) {
        setOpen(false);
        setTitle("");
        setValue("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleService(s: string) {
    setServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-primary btn-sm flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" /> New Deal
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg text-gray-900">New Deal</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company / Deal Name</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full"
                  placeholder="e.g. Acme SaaS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Value ($)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="input w-full"
                  placeholder="e.g. 5000"
                />
              </div>
              {orgs.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select value={orgId} onChange={(e) => setOrgId(e.target.value)} className="input w-full">
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select value={stage} onChange={(e) => setStage(e.target.value)} className="input w-full">
                  {STAGES.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        services.includes(s)
                          ? "bg-brand-600 text-white border-brand-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="btn-ghost btn-sm flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary btn-sm flex-1 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function MoveDealButton({ dealId, currentStage }: { dealId: string; currentStage: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const STAGE_ORDER = ["DISCOVERY_BOOKED", "DISCOVERY_COMPLETE", "PROPOSAL_SENT", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];
  const currentIdx = STAGE_ORDER.indexOf(currentStage);
  const nextStage = currentIdx < STAGE_ORDER.length - 1 ? STAGE_ORDER[currentIdx + 1] : null;

  if (!nextStage) return null;

  async function moveToNext() {
    setLoading(true);
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: nextStage }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={moveToNext}
      disabled={loading}
      className="p-1 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
      title="Advance to next stage"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronRight className="w-3.5 h-3.5" />}
    </button>
  );
}
