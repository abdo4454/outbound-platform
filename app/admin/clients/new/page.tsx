"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", plan: "STARTER" });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/invite-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: `Invite sent to ${form.email}. They'll get a Clerk invite email.` });
        setTimeout(() => router.push("/admin"), 2000);
      } else {
        setResult({ ok: false, message: data.error ?? "Something went wrong" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <Link href="/admin/clients" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <h2 className="font-display text-xl font-bold text-gray-900">Add New Client</h2>
        <p className="text-sm text-gray-500">Create an org and send a Clerk invite to your client.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {result && (
            <div
              className={`flex items-center gap-2 p-4 rounded-xl text-sm border ${
                result.ok
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {result.ok ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {result.message}
            </div>
          )}

          <div>
            <label className="label">Company Name</label>
            <input
              type="text"
              className="input"
              required
              placeholder="Acme Corp"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Client Email</label>
            <input
              type="email"
              className="input"
              required
              placeholder="client@acmecorp.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">They&apos;ll receive a Clerk org invite at this address.</p>
          </div>

          <div>
            <label className="label">Service Plan</label>
            <select
              className="input"
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
            >
              <option value="STARTER">Starter — $2,500/mo</option>
              <option value="GROWTH">Growth — $5,000/mo</option>
              <option value="SCALE">Scale — $10,000/mo</option>
            </select>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
}
