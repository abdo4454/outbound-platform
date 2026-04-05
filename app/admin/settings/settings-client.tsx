"use client";

import { useState } from "react";
import { Users, Shield, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Agency Admin",
  CLIENT_ADMIN: "Client Admin",
  MANAGER: "Manager",
  VIEWER: "Viewer",
};

const ALL_ROLES = ["ADMIN", "CLIENT_ADMIN", "MANAGER", "VIEWER"] as const;

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  org: { id: string; name: string };
};

export function AdminSettingsClient({
  currentMemberId,
  members,
}: {
  currentMemberId: string;
  members: Member[];
}) {
  const [roles, setRoles] = useState<Record<string, string>>(
    Object.fromEntries(members.map((m) => [m.id, m.role]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, { ok: boolean; msg: string }>>({});

  async function updateRole(memberId: string, newRole: string) {
    setSaving(memberId);
    setFeedback((f) => ({ ...f, [memberId]: { ok: false, msg: "" } }));
    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to update role");
      }
      setRoles((r) => ({ ...r, [memberId]: newRole }));
      setFeedback((f) => ({ ...f, [memberId]: { ok: true, msg: "Role updated" } }));
      setTimeout(() => setFeedback((f) => ({ ...f, [memberId]: { ok: false, msg: "" } })), 3000);
    } catch (e) {
      setFeedback((f) => ({
        ...f,
        [memberId]: { ok: false, msg: e instanceof Error ? e.message : "Error" },
      }));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Team & Roles */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-4 h-4 text-gray-400" />
          <h2 className="font-display font-bold text-lg text-gray-900">All Members</h2>
          <span className="ml-auto text-xs text-gray-400">{members.length} total</span>
        </div>

        <div className="space-y-1">
          {members.map((m) => {
            const fb = feedback[m.id];
            return (
              <div
                key={m.id}
                className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-700 font-bold text-xs">
                    {m.name ? m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {m.name} {m.id === currentMemberId && <span className="text-xs text-gray-400">(you)</span>}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{m.email} · {m.org.name}</div>
                </div>

                <div className="flex items-center gap-2">
                  {fb?.msg && (
                    <span className={`text-xs flex items-center gap-1 ${fb.ok ? "text-green-600" : "text-red-600"}`}>
                      {fb.ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {fb.msg}
                    </span>
                  )}
                  <select
                    value={roles[m.id] ?? m.role}
                    disabled={saving === m.id || m.id === currentMemberId}
                    onChange={(e) => updateRole(m.id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                  {saving === m.id && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                </div>
              </div>
            );
          })}

          {members.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">No members yet.</p>
          )}
        </div>
      </div>

      {/* Role Reference */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-gray-400" />
          <h2 className="font-display font-bold text-lg text-gray-900">Role Reference</h2>
        </div>
        <div className="space-y-3 text-sm">
          {[
            { role: "Agency Admin", desc: "Full access to all admin pages, all client data, pipeline, revenue, and settings. Assign to your internal team only." },
            { role: "Client Admin", desc: "Access to their own org's dashboard, campaigns, contacts, reports, and billing. Can manage team members within their org." },
            { role: "Manager", desc: "Read/write access to campaigns, contacts, and reports for their org. Cannot manage billing or team members." },
            { role: "Viewer", desc: "Read-only access to dashboard and reports for their org." },
          ].map(({ role, desc }) => (
            <div key={role} className="flex gap-3">
              <span className="font-semibold text-gray-700 w-28 flex-shrink-0">{role}</span>
              <span className="text-gray-500">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
