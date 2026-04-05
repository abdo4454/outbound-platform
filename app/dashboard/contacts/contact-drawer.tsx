"use client";

import { useState } from "react";
import { X, Phone, MapPin, Building2, Briefcase, Globe, Tag, Trash2, Download, Lock } from "lucide-react";
import { ContactRow } from "./contacts-client";

interface Props {
  contact: ContactRow;
  onClose: () => void;
  onUpdate: (updated: ContactRow) => void;
  isAdmin?: boolean;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active", cls: "badge-brand" },
  { value: "REPLIED", label: "Replied", cls: "badge-success" },
  { value: "MEETING_BOOKED", label: "Meeting", cls: "badge-success" },
  { value: "BOUNCED", label: "Bounced", cls: "badge-gray" },
  { value: "UNSUBSCRIBED", label: "Unsub", cls: "badge-gray" },
  { value: "DO_NOT_CONTACT", label: "DNC", cls: "badge-warning" },
];

function parseTags(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function getInitials(c: ContactRow): string {
  const f = c.firstName?.[0] ?? "";
  const l = c.lastName?.[0] ?? "";
  return (f + l).toUpperCase() || c.email[0].toUpperCase();
}

export function ContactDrawer({ contact, onClose, onUpdate, isAdmin }: Props) {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>(parseTags(contact.tags));
  const [tagInput, setTagInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate({ ...contact, ...updated });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(status: string) {
    await patch({ status });
  }

  async function addTag() {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) {
      setTagInput("");
      return;
    }
    const next = [...tags, t];
    setTags(next);
    setTagInput("");
    await patch({ tags: JSON.stringify(next) });
  }

  async function removeTag(t: string) {
    const next = tags.filter((x) => x !== t);
    setTags(next);
    await patch({ tags: JSON.stringify(next) });
  }

  async function saveNote() {
    const note = noteInput.trim();
    if (!note) return;
    setSavingNote(true);
    const noteTag = `note:${note}`;
    const next = [...tags, noteTag];
    setTags(next);
    setNoteInput("");
    await patch({ tags: JSON.stringify(next) });
    setSavingNote(false);
  }

  function exportSingle() {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Company", "Title", "Location", "Status", "Added"];
    const row = [
      contact.firstName ?? "",
      contact.lastName ?? "",
      contact.email,
      contact.phone ?? "",
      contact.company ?? "",
      contact.jobTitle ?? "",
      contact.location ?? "",
      contact.status,
      new Date(contact.createdAt).toLocaleDateString(),
    ];
    const csv = [headers, row].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-${contact.email}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteContact() {
    if (!confirm("Delete this contact permanently?")) return;
    await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
    onClose();
  }

  const displayName =
    contact.firstName || contact.lastName
      ? `${contact.firstName ?? ""} ${contact.lastName ?? ""}`.trim()
      : contact.email;

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === contact.status) ?? STATUS_OPTIONS[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-hidden transition-transform translate-x-0">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xl font-bold flex-shrink-0">
            {getInitials(contact)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-lg text-gray-900 truncate">{displayName}</h2>
            <p className="text-sm text-gray-500 truncate">{contact.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</div>
            <div className="flex items-center gap-2 mb-3">
              <span className={currentStatus.cls}>{currentStatus.label}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  disabled={loading || contact.status === s.value}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:cursor-default ${
                    contact.status === s.value
                      ? "bg-brand-600 text-white border-brand-600"
                      : "border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lock notice */}
          {!contact.isUnlocked && !isAdmin && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
              <Lock className="w-4 h-4 flex-shrink-0" />
              Unlock this contact to see full email, phone, and LinkedIn.
            </div>
          )}

          {/* Details */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Details</div>
            <div className="space-y-3">
              {[
                { icon: Phone, label: "Phone", value: contact.phone },
                { icon: MapPin, label: "Location", value: contact.location },
                { icon: Building2, label: "Company", value: contact.company },
                { icon: Briefcase, label: "Title", value: contact.jobTitle },
                { icon: Globe, label: "Domain", value: contact.companyDomain },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-400">{label}: </span>
                    <span className={`text-sm ${value === "••••••••" ? "tracking-widest text-gray-300" : "text-gray-700"}`}>
                      {value ?? "—"}
                    </span>
                  </div>
                </div>
              ))}
              {contact.linkedinUrl && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-600 hover:underline truncate"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              {contact.industry && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-400">Industry: </span>
                    <span className="text-sm text-gray-700">{contact.industry}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.filter((t) => !t.startsWith("note:")).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600"
                >
                  {t}
                  <button
                    onClick={() => removeTag(t)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Add tag..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-400"
              />
              <button
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-sm hover:bg-brand-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</div>
            {/* Show existing notes */}
            {tags.filter((t) => t.startsWith("note:")).length > 0 && (
              <div className="space-y-2 mb-3">
                {tags
                  .filter((t) => t.startsWith("note:"))
                  .map((t, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 flex-1">{t.replace("note:", "")}</p>
                      <button
                        onClick={() => removeTag(t)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-400 resize-none"
            />
            <button
              onClick={saveNote}
              disabled={!noteInput.trim() || savingNote}
              className="mt-2 px-4 py-1.5 rounded-lg bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              {savingNote ? "Saving..." : "Save Note"}
            </button>
          </div>

          {/* Added date */}
          <div className="text-xs text-gray-400">
            Added {new Date(contact.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={exportSingle}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={deleteContact}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
