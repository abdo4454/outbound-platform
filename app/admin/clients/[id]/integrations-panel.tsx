"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Trash2, RefreshCw, Link2 } from "lucide-react";

type Integration = {
  id: string;
  type: string;
  status: string;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastSyncError: string | null;
};

const TOOLS: { type: string; label: string; placeholder: string; docs: string }[] = [
  {
    type: "instantly",
    label: "Instantly.ai",
    placeholder: "sk_…",
    docs: "Settings → API → Copy API Key",
  },
  {
    type: "apollo",
    label: "Apollo.io",
    placeholder: "Paste Apollo API key…",
    docs: "Settings → Integrations → API Keys",
  },
];

interface Props {
  clientId: string;
  initialIntegrations: Integration[];
}

export function IntegrationsPanel({ clientId, initialIntegrations }: Props) {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function refresh() {
    const res = await fetch(`/api/admin/clients/${clientId}/integrations`);
    const data = await res.json();
    setIntegrations(data.integrations ?? []);
  }

  async function save(type: string) {
    const key = apiKeys[type]?.trim();
    if (!key) return;
    setSaving(type);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/integrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, apiKey: key }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "ok", text: `${TOOLS.find((t) => t.type === type)?.label} connected. Next sync in ≤15 min.` });
        setApiKeys((prev) => ({ ...prev, [type]: "" }));
        await refresh();
      } else {
        setMessage({ type: "err", text: data.error ?? "Failed to save" });
      }
    } finally {
      setSaving(null);
    }
  }

  async function remove(type: string) {
    if (!confirm(`Remove ${type} integration?`)) return;
    setDeleting(type);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/integrations`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        await refresh();
        setMessage({ type: "ok", text: `${type} disconnected.` });
      } else {
        const d = await res.json();
        setMessage({ type: "err", text: d.error ?? "Failed" });
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
            message.type === "ok"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "ok" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {TOOLS.map((tool) => {
        const existing = integrations.find((i) => i.type === tool.type);
        const isConnected = existing?.status === "connected";
        const hasError = existing?.lastSyncStatus === "error";

        return (
          <div key={tool.type} className="border border-gray-100 rounded-xl p-4 space-y-3">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="font-semibold text-sm text-gray-900">{tool.label}</div>
                {isConnected && !hasError && (
                  <span className="badge-success flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                )}
                {isConnected && hasError && (
                  <span className="badge-warning flex items-center gap-1 text-xs">
                    <AlertCircle className="w-3 h-3" /> Sync error
                  </span>
                )}
                {!isConnected && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Link2 className="w-3 h-3" /> Not connected
                  </span>
                )}
              </div>

              {isConnected && (
                <button
                  onClick={() => remove(tool.type)}
                  disabled={deleting === tool.type}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Disconnect"
                >
                  {deleting === tool.type ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Last sync info */}
            {existing?.lastSyncAt && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <RefreshCw className="w-3 h-3" />
                Last synced {new Date(existing.lastSyncAt).toLocaleString()}
                {existing.lastSyncError && (
                  <span className="text-red-500 ml-1">{existing.lastSyncError}</span>
                )}
              </div>
            )}

            {/* API key input */}
            <div className="flex gap-2">
              <input
                type="password"
                className="input flex-1 text-sm"
                placeholder={isConnected ? "Paste new key to rotate…" : tool.placeholder}
                value={apiKeys[tool.type] ?? ""}
                onChange={(e) => setApiKeys((prev) => ({ ...prev, [tool.type]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && save(tool.type)}
              />
              <button
                onClick={() => save(tool.type)}
                disabled={saving === tool.type || !apiKeys[tool.type]?.trim()}
                className="btn-primary btn-sm flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
              >
                {saving === tool.type && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isConnected ? "Rotate" : "Connect"}
              </button>
            </div>

            <p className="text-xs text-gray-400">{tool.docs}</p>
          </div>
        );
      })}
    </div>
  );
}
