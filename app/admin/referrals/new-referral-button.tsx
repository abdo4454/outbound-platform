"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewReferralButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    commissionType: "flat",
    commissionValue: "50000", // $500 flat default
  });
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerName: form.name,
          referrerEmail: form.email,
          commissionType: form.commissionType,
          commissionValue: parseInt(form.commissionValue, 10),
        }),
      });
      if (res.ok) {
        setOpen(false);
        setForm({ name: "", email: "", commissionType: "flat", commissionValue: "50000" });
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-primary btn-sm flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        Add Partner
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-gray-900">New Referral Partner</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Partner Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input w-full"
                  placeholder="Jane Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Partner Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input w-full"
                  placeholder="jane@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Commission Type</label>
                  <select
                    value={form.commissionType}
                    onChange={(e) => setForm({ ...form, commissionType: e.target.value })}
                    className="input w-full"
                  >
                    <option value="flat">Flat per deal</option>
                    <option value="recurring">Recurring/mo</option>
                    <option value="percentage">% of MRR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Value (cents{form.commissionType === "percentage" ? " × 100" : ""})
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.commissionValue}
                    onChange={(e) => setForm({ ...form, commissionValue: e.target.value })}
                    className="input w-full"
                    placeholder="50000 = $500"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400">
                A unique referral code will be auto-generated for this partner.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-sm flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
