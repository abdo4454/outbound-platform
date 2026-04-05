"use client";

import { useState } from "react";
import { ExternalLink, Loader2, User, Building2, Users, Link as LinkIcon, Check, Pencil } from "lucide-react";

const PLAN_LABELS: Record<string, string> = {
  STARTER: "Starter ($2,500/mo)",
  GROWTH: "Growth ($5,000/mo)",
  SCALE: "Scale ($10,000/mo)",
  ENTERPRISE: "Enterprise",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Agency Admin",
  CLIENT_ADMIN: "Client Admin",
  MANAGER: "Manager",
  VIEWER: "Viewer",
};

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
];

interface Props {
  member: { id: string; name: string; email: string; role: string };
  org: { id: string; name: string; plan: string; status: string; mrr: number; timezone: string; website: string | null };
  members: { id: string; name: string; email: string; role: string }[];
  bookingLink: string | null;
}

function InlineField({
  label,
  value,
  onSave,
  type = "text",
  options,
}: {
  label: string;
  value: string;
  onSave: (v: string) => Promise<void>;
  type?: string;
  options?: string[];
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50">
      <span className="text-sm text-gray-500 w-28 flex-shrink-0">{label}</span>
      {editing ? (
        <div className="flex items-center gap-2 flex-1 ml-2">
          {options ? (
            <select
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="input flex-1 text-sm py-1"
              autoFocus
            >
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
              className="input flex-1 text-sm py-1"
              autoFocus
            />
          )}
          <button
            onClick={save}
            disabled={saving}
            className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => { setEditing(false); setDraft(value); }}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm font-medium text-gray-900">{draft || "—"}</span>
          {saved && <Check className="w-3.5 h-3.5 text-green-500" />}
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded text-gray-300 hover:text-gray-500 transition-colors"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export function SettingsClient({ member, org, members, bookingLink }: Props) {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@acceleratedgrowth.com";

  async function patchSettings(data: Record<string, string>) {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function openBillingPortal() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gray-400" />
          <h2 className="font-display font-bold text-lg text-gray-900">Profile</h2>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-medium text-gray-900">{member.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Role</span>
            <span className="badge-brand">{ROLE_LABELS[member.role] ?? member.role}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Name</span>
            <span className="text-sm font-medium text-gray-900">{member.name}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          To update your name or password, use your account settings in Clerk.
        </p>
      </div>

      {/* Organization */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-gray-400" />
          <h2 className="font-display font-bold text-lg text-gray-900">Organization</h2>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Name</span>
            <span className="text-sm font-medium text-gray-900">{org.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Plan</span>
            <span className="text-sm font-medium text-gray-900">{PLAN_LABELS[org.plan] ?? org.plan}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">Status</span>
            <span className={org.status === "ACTIVE" ? "badge-success" : "badge-gray"}>{org.status.toLowerCase()}</span>
          </div>
          <InlineField
            label="Website"
            value={org.website ?? ""}
            type="url"
            onSave={(v) => patchSettings({ website: v })}
          />
          <InlineField
            label="Timezone"
            value={org.timezone}
            options={TIMEZONES}
            onSave={(v) => patchSettings({ timezone: v })}
          />
        </div>
      </div>

      {/* Booking link */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-4 h-4 text-gray-400" />
          <h2 className="font-display font-bold text-lg text-gray-900">Booking Link</h2>
        </div>
        <InlineField
          label="Booking URL"
          value={bookingLink ?? ""}
          type="url"
          onSave={(v) => patchSettings({ bookingLink: v })}
        />
        {bookingLink && (
          <a
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-600 hover:underline flex items-center gap-1 mt-3"
          >
            Open link <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Team */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-400" />
          <h2 className="font-display font-bold text-lg text-gray-900">Team Members</h2>
        </div>
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-900">{m.name}</div>
                <div className="text-xs text-gray-400">{m.email}</div>
              </div>
              <span className="badge-brand text-xs">{ROLE_LABELS[m.role] ?? m.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing */}
      <div className="card">
        <h2 className="font-display font-bold text-lg text-gray-900 mb-1">Billing</h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage your subscription, payment method, and invoices.
        </p>
        <button
          onClick={openBillingPortal}
          disabled={loadingPortal}
          className="btn-primary btn-sm flex items-center gap-2"
        >
          {loadingPortal ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
          Open Billing Portal
        </button>
      </div>

      {/* Support */}
      <div className="card">
        <h2 className="font-display font-bold text-lg text-gray-900 mb-1">Support</h2>
        <p className="text-sm text-gray-500 mb-4">
          Need help? Reach out to your dedicated account manager.
        </p>
        <a
          href={`mailto:${supportEmail}`}
          className="btn-ghost btn-sm inline-flex items-center gap-2"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
