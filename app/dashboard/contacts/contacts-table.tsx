"use client";

import { useState } from "react";
import { Search, Download, Users, MessageSquare, CalendarCheck, XCircle } from "lucide-react";

interface Contact {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.FC<{ className?: string }> }> = {
  ACTIVE: { label: "In Sequence", cls: "badge-brand", icon: Users },
  REPLIED: { label: "Replied", cls: "badge-success", icon: MessageSquare },
  MEETING_BOOKED: { label: "Meeting Booked", cls: "badge-success", icon: CalendarCheck },
  BOUNCED: { label: "Bounced", cls: "badge-gray", icon: XCircle },
  UNSUBSCRIBED: { label: "Unsubscribed", cls: "badge-gray", icon: XCircle },
  DO_NOT_CONTACT: { label: "DNC", cls: "badge-warning", icon: XCircle },
};

export function ContactsTable({ initialContacts }: { initialContacts: Contact[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const statuses = ["ALL", ...Array.from(new Set(initialContacts.map((c) => c.status)))];

  const filtered = initialContacts.filter((c) => {
    const matchSearch =
      search === "" ||
      `${c.firstName ?? ""} ${c.lastName ?? ""} ${c.company ?? ""} ${c.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const summary = [
    { label: "Total Contacts", value: initialContacts.length, color: "text-gray-900" },
    { label: "In Sequence", value: initialContacts.filter((c) => c.status === "ACTIVE").length, color: "text-brand-600" },
    { label: "Replied", value: initialContacts.filter((c) => c.status === "REPLIED").length, color: "text-blue-600" },
    { label: "Meetings Booked", value: initialContacts.filter((c) => c.status === "MEETING_BOOKED").length, color: "text-green-600" },
  ];

  function exportCSV() {
    const headers = ["First Name", "Last Name", "Email", "Company", "Title", "Status", "Added"];
    const rows = filtered.map((c) => [
      c.firstName ?? "",
      c.lastName ?? "",
      c.email,
      c.company ?? "",
      c.jobTitle ?? "",
      STATUS_CONFIG[c.status]?.label ?? c.status,
      new Date(c.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summary.map((s) => (
          <div key={s.label} className="card text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 bg-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 bg-white text-gray-700"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : (STATUS_CONFIG[s]?.label ?? s)}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto -mx-6 -mt-6">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Added</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => {
                const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.ACTIVE;
                const first = c.firstName ?? c.email[0].toUpperCase();
                const last = c.lastName ?? "";
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                          {first[0]}{last[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {c.firstName || c.lastName ? `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() : c.email}
                          </div>
                          <div className="text-xs text-gray-400">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.company ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.jobTitle ?? "—"}</td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cfg.cls}>{cfg.label}</span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    {initialContacts.length === 0
                      ? "No contacts yet. They appear here after your first campaign sync."
                      : "No contacts match your search"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {initialContacts.length} contacts
        </div>
      </div>
    </div>
  );
}
