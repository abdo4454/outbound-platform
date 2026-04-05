"use client";

import { useState, useCallback, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Upload,
  Users,
  MessageSquare,
  CalendarCheck,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckSquare,
  Unlock,
  Lock,
  Coins,
  Filter,
  ChevronDown,
} from "lucide-react";
import { ContactDrawer } from "./contact-drawer";

export interface ContactRow {
  id: string;
  email: string;
  emailFull: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
  companyDomain: string | null;
  linkedinUrl: string | null;
  location: string | null;
  state: string | null;
  industry: string | null;
  status: string;
  tags: string;
  enrichmentData: string | null;
  isUnlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  active: number;
  replied: number;
  meetingBooked: number;
  bounced: number;
  unsubscribed: number;
  doNotContact: number;
}

interface Props {
  contacts: ContactRow[];
  total: number;
  page: number;
  pageSize: number;
  stats: Stats;
  creditBalance: number;
  isAdmin: boolean;
  currentParams: {
    q?: string;
    status?: string;
    source?: string;
    location?: string;
    state?: string;
    hasPhone?: string;
    hasLinkedin?: string;
    hasCompany?: string;
    title?: string;
    company?: string;
    industry?: string;
    unlocked?: string;
    page?: string;
    sort?: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "badge-brand" },
  REPLIED: { label: "Replied", cls: "badge-success" },
  MEETING_BOOKED: { label: "Meeting Booked", cls: "badge-success" },
  BOUNCED: { label: "Bounced", cls: "badge-gray" },
  UNSUBSCRIBED: { label: "Unsubscribed", cls: "badge-gray" },
  DO_NOT_CONTACT: { label: "DNC", cls: "badge-warning" },
};

function getInitials(c: ContactRow): string {
  const f = c.firstName?.[0] ?? "";
  const l = c.lastName?.[0] ?? "";
  return (f + l).toUpperCase() || c.email[0].toUpperCase();
}

function getDisplayName(c: ContactRow): string {
  if (c.firstName || c.lastName) {
    return `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
  }
  return c.email;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export function ContactsClient({
  contacts,
  total,
  page,
  pageSize,
  stats,
  creditBalance,
  isAdmin,
  currentParams,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("ACTIVE");
  const [bulkLoading, setBulkLoading] = useState(false);

  // Drawer state
  const [drawerContact, setDrawerContact] = useState<ContactRow | null>(null);

  // Kebab menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  // Unlock state
  const [unlocking, setUnlocking] = useState<Set<string>>(new Set());
  const [localCredits, setLocalCredits] = useState(creditBalance);
  const [localUnlocked, setLocalUnlocked] = useState<Set<string>>(
    new Set(contacts.filter((c) => c.isUnlocked).map((c) => c.id))
  );

  // Advanced filters toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter local state
  const [searchInput, setSearchInput] = useState(currentParams.q ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pushParams(overrides: Record<string, string | undefined>) {
    const next: Record<string, string> = {};
    const merged = { ...currentParams, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== undefined && v !== "") next[k] = v;
    }
    if (overrides.page === undefined) delete next.page;
    const qs = new URLSearchParams(next).toString();
    startTransition(() => {
      router.push("/dashboard/contacts" + (qs ? "?" + qs : ""));
    });
    setSelectedIds(new Set());
  }

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchInput(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        pushParams({ q: val || undefined });
      }, 300);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentParams]
  );

  const hasFilters =
    !!currentParams.q ||
    (currentParams.status && currentParams.status !== "ALL") ||
    (currentParams.source && currentParams.source !== "all") ||
    !!currentParams.location ||
    !!currentParams.state ||
    (currentParams.hasPhone && currentParams.hasPhone !== "any") ||
    (currentParams.hasLinkedin && currentParams.hasLinkedin !== "any") ||
    (currentParams.hasCompany && currentParams.hasCompany !== "any") ||
    !!currentParams.title ||
    !!currentParams.company ||
    !!currentParams.industry ||
    (currentParams.unlocked && currentParams.unlocked !== "all");

  const totalPages = Math.ceil(total / pageSize);
  const startNum = (page - 1) * pageSize + 1;
  const endNum = Math.min(page * pageSize, total);

  const allPageIds = contacts.map((c) => c.id);
  const allPageSelected =
    allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id));

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        allPageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        allPageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Unlock single or multiple contacts
  async function handleUnlock(ids: string[]) {
    const toUnlock = ids.filter((id) => !localUnlocked.has(id));
    if (toUnlock.length === 0) return;

    setUnlocking((prev) => {
      const next = new Set(prev);
      toUnlock.forEach((id) => next.add(id));
      return next;
    });

    try {
      const res = await fetch("/api/contacts/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: toUnlock }),
      });
      const data = await res.json();
      if (res.ok) {
        setLocalCredits(data.balance);
        setLocalUnlocked((prev) => {
          const next = new Set(prev);
          toUnlock.forEach((id) => next.add(id));
          return next;
        });
        startTransition(() => router.refresh());
      } else if (res.status === 402) {
        alert(`Not enough credits. You have ${data.balance} credits but need ${data.needed}.`);
      } else {
        alert(data.error ?? "Unlock failed");
      }
    } finally {
      setUnlocking((prev) => {
        const next = new Set(prev);
        toUnlock.forEach((id) => next.delete(id));
        return next;
      });
    }
  }

  async function handleBulkAction(action: "status" | "delete" | "unlock") {
    if (selectedIds.size === 0) return;
    if (action === "unlock") {
      await handleUnlock(Array.from(selectedIds));
      return;
    }
    setBulkLoading(true);
    try {
      const res = await fetch("/api/contacts/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          action,
          status: action === "status" ? bulkStatus : undefined,
        }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        startTransition(() => router.refresh());
      }
    } finally {
      setBulkLoading(false);
    }
  }

  async function handleRowAction(
    contactId: string,
    action: "mark_active" | "mark_replied" | "mark_bounced" | "mark_dnc" | "delete"
  ) {
    setOpenMenuId(null);
    if (action === "delete") {
      if (!confirm("Delete this contact?")) return;
      await fetch(`/api/contacts/${contactId}`, { method: "DELETE" });
      startTransition(() => router.refresh());
      return;
    }
    const statusMap: Record<string, string> = {
      mark_active: "ACTIVE",
      mark_replied: "REPLIED",
      mark_bounced: "BOUNCED",
      mark_dnc: "DO_NOT_CONTACT",
    };
    await fetch(`/api/contacts/${contactId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusMap[action] }),
    });
    startTransition(() => router.refresh());
  }

  function handleExport() {
    const params = new URLSearchParams();
    if (currentParams.q) params.set("q", currentParams.q);
    if (currentParams.status) params.set("status", currentParams.status);
    if (currentParams.source) params.set("source", currentParams.source);
    if (currentParams.location) params.set("location", currentParams.location);
    window.location.href = "/api/contacts/export?" + params.toString();
  }

  function handleExportSelected() {
    const ids = Array.from(selectedIds).join(",");
    window.location.href = "/api/contacts/export?ids=" + ids;
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      alert(`Import complete: ${data.imported} imported, ${data.skipped} skipped.`);
      startTransition(() => router.refresh());
    } catch {
      alert("Import failed. Please check your CSV and try again.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const selectedLocked = Array.from(selectedIds).filter((id) => !localUnlocked.has(id));

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-0.5 flex items-center justify-center gap-1">
            <Users className="w-3.5 h-3.5" /> Total
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand-600">{stats.active.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-0.5">Active</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.replied.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-0.5 flex items-center justify-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> Replied
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.meetingBooked.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-0.5 flex items-center justify-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5" /> Meetings
          </div>
        </div>
      </div>

      {/* Credit balance banner for non-admin */}
      {!isAdmin && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-200">
          <Coins className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-amber-800">
              {localCredits.toLocaleString()} credits available
            </span>
            <span className="text-sm text-amber-700 ml-2">
              — each unlock reveals full contact details (email + phone)
            </span>
          </div>
          <a
            href="/dashboard/settings"
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline"
          >
            Get more
          </a>
        </div>
      )}

      {/* Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, company..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 bg-white"
            />
          </div>

          {/* Status */}
          <select
            value={currentParams.status ?? "ALL"}
            onChange={(e) => pushParams({ status: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 bg-white text-gray-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="REPLIED">Replied</option>
            <option value="MEETING_BOOKED">Meeting Booked</option>
            <option value="BOUNCED">Bounced</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
            <option value="DO_NOT_CONTACT">DNC</option>
          </select>

          {/* Source */}
          <select
            value={currentParams.source ?? "all"}
            onChange={(e) => pushParams({ source: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 bg-white text-gray-700"
          >
            <option value="all">All Sources</option>
            <option value="instagram">Instagram / Social</option>
            <option value="insurance">Insurance Agents</option>
            <option value="youtube">YouTube Creators</option>
          </select>

          {/* Sort */}
          <select
            value={currentParams.sort ?? "createdAt_desc"}
            onChange={(e) => pushParams({ sort: e.target.value })}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400 bg-white text-gray-700"
          >
            <option value="createdAt_desc">Newest First</option>
            <option value="createdAt_asc">Oldest First</option>
            <option value="name_asc">Name A–Z</option>
            <option value="email_asc">Email A–Z</option>
            <option value="company_asc">Company A–Z</option>
          </select>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm transition-colors ${
              showAdvanced
                ? "bg-brand-50 border-brand-200 text-brand-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={() => {
                setSearchInput("");
                pushParams({
                  q: undefined, status: undefined, source: undefined, location: undefined,
                  state: undefined, hasPhone: undefined, hasLinkedin: undefined, hasCompany: undefined,
                  title: undefined, company: undefined, industry: undefined, unlocked: undefined,
                });
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 bg-white"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}

          <div className="ml-auto flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {importing ? "Importing..." : "Import CSV"}
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportFile} />
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvanced && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">State / Region</label>
              <select
                value={currentParams.state ?? ""}
                onChange={(e) => pushParams({ state: e.target.value || undefined })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:border-brand-400"
              >
                <option value="">Any State</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Has Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone</label>
              <select
                value={currentParams.hasPhone ?? "any"}
                onChange={(e) => pushParams({ hasPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:border-brand-400"
              >
                <option value="any">Any</option>
                <option value="yes">Has Phone</option>
                <option value="no">No Phone</option>
              </select>
            </div>

            {/* Has LinkedIn */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">LinkedIn</label>
              <select
                value={currentParams.hasLinkedin ?? "any"}
                onChange={(e) => pushParams({ hasLinkedin: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:border-brand-400"
              >
                <option value="any">Any</option>
                <option value="yes">Has LinkedIn</option>
                <option value="no">No LinkedIn</option>
              </select>
            </div>

            {/* Has Company */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Company</label>
              <select
                value={currentParams.hasCompany ?? "any"}
                onChange={(e) => pushParams({ hasCompany: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:border-brand-400"
              >
                <option value="any">Any</option>
                <option value="yes">Has Company</option>
                <option value="no">No Company</option>
              </select>
            </div>

            {/* Unlock Status (non-admin only) */}
            {!isAdmin && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Unlock Status</label>
                <select
                  value={currentParams.unlocked ?? "all"}
                  onChange={(e) => pushParams({ unlocked: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white text-gray-700 focus:outline-none focus:border-brand-400"
                >
                  <option value="all">All</option>
                  <option value="unlocked">Unlocked</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
            )}

            {/* Title keyword */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Job Title</label>
              <input
                type="text"
                placeholder="e.g. agent, advisor..."
                defaultValue={currentParams.title ?? ""}
                onBlur={(e) => {
                  if (e.target.value !== (currentParams.title ?? "")) {
                    pushParams({ title: e.target.value || undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    pushParams({ title: (e.target as HTMLInputElement).value || undefined });
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-brand-400"
              />
            </div>

            {/* Company keyword */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Company Name</label>
              <input
                type="text"
                placeholder="e.g. State Farm..."
                defaultValue={currentParams.company ?? ""}
                onBlur={(e) => {
                  if (e.target.value !== (currentParams.company ?? "")) {
                    pushParams({ company: e.target.value || undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    pushParams({ company: (e.target as HTMLInputElement).value || undefined });
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-brand-400"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Industry</label>
              <input
                type="text"
                placeholder="e.g. insurance, finance..."
                defaultValue={currentParams.industry ?? ""}
                onBlur={(e) => {
                  if (e.target.value !== (currentParams.industry ?? "")) {
                    pushParams({ industry: e.target.value || undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    pushParams({ industry: (e.target as HTMLInputElement).value || undefined });
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-brand-400"
              />
            </div>

            {/* Location text */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">City / Location</label>
              <input
                type="text"
                placeholder="e.g. Miami..."
                defaultValue={currentParams.location ?? ""}
                onBlur={(e) => {
                  if (e.target.value !== (currentParams.location ?? "")) {
                    pushParams({ location: e.target.value || undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    pushParams({ location: (e.target as HTMLInputElement).value || undefined });
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto -mx-6 -mt-6">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Company</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Title</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Location</th>
                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 w-24 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Access</th>
                <th className="px-4 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contacts.map((c) => {
                const cfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.ACTIVE;
                const initials = getInitials(c);
                const displayName = getDisplayName(c);
                const isSelected = selectedIds.has(c.id);
                const isContactUnlocked = localUnlocked.has(c.id) || c.isUnlocked;
                const isUnlockingThis = unlocking.has(c.id);

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${isSelected ? "bg-brand-50/30" : ""}`}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (
                        target.closest("input[type='checkbox']") ||
                        target.closest("button") ||
                        target.closest("[data-menu]")
                      ) return;
                      if (isContactUnlocked || isAdmin) setDrawerContact(c);
                    }}
                  >
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(c.id)}
                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{displayName}</div>
                          <div className={`text-xs ${isContactUnlocked || isAdmin ? "text-gray-400" : "text-gray-300 font-mono"}`}>
                            {c.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm hidden md:table-cell">
                      {isContactUnlocked || isAdmin ? (
                        <span className="text-gray-600">{c.phone ?? "—"}</span>
                      ) : (
                        <span className="text-gray-300 font-mono tracking-widest">••••••••</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {c.company ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell max-w-[140px] truncate">
                      {c.jobTitle ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 hidden xl:table-cell">
                      {c.location ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span className={cfg.cls}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      {isAdmin ? (
                        <span className="text-xs text-gray-400">Full access</span>
                      ) : isContactUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <Unlock className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <button
                          onClick={() => handleUnlock([c.id])}
                          disabled={isUnlockingThis || localCredits < 1}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Lock className="w-3 h-3" />
                          {isUnlockingThis ? "..." : "1 credit"}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4" data-menu onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenuId === c.id && (
                          <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                            {!isContactUnlocked && !isAdmin && (
                              <button
                                onClick={() => { setOpenMenuId(null); handleUnlock([c.id]); }}
                                className="w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                              >
                                <Unlock className="w-3.5 h-3.5" /> Unlock (1 credit)
                              </button>
                            )}
                            {(isContactUnlocked || isAdmin) && (
                              <button
                                onClick={() => { setOpenMenuId(null); setDrawerContact(c); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                View Details
                              </button>
                            )}
                            {[
                              { action: "mark_active" as const, label: "Mark Active" },
                              { action: "mark_replied" as const, label: "Mark Replied" },
                              { action: "mark_bounced" as const, label: "Mark Bounced" },
                              { action: "mark_dnc" as const, label: "Mark DNC" },
                            ].map(({ action, label }) => (
                              <button
                                key={action}
                                onClick={() => handleRowAction(c.id, action)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {label}
                              </button>
                            ))}
                            {isAdmin && (
                              <>
                                <hr className="my-1 border-gray-100" />
                                <button
                                  onClick={() => handleRowAction(c.id, "delete")}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-400">
                    {total === 0
                      ? "No contacts in the database yet."
                      : "No contacts match your current filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {total === 0
              ? "No contacts"
              : `Showing ${startNum.toLocaleString()}–${endNum.toLocaleString()} of ${total.toLocaleString()} contacts`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pushParams({ page: String(page - 1) })}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              {page} / {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => pushParams({ page: String(page + 1) })}
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CheckSquare className="w-4 h-4 text-brand-600" />
            {selectedIds.size} selected
          </div>
          <div className="h-4 w-px bg-gray-200" />

          {/* Unlock selected (non-admin) */}
          {!isAdmin && selectedLocked.length > 0 && (
            <button
              onClick={() => handleBulkAction("unlock")}
              className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 font-medium"
            >
              <Unlock className="w-3.5 h-3.5" />
              Unlock {selectedLocked.length} ({selectedLocked.length} credits)
            </button>
          )}

          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white text-gray-700"
          >
            <option value="ACTIVE">Active</option>
            <option value="REPLIED">Replied</option>
            <option value="BOUNCED">Bounced</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
            <option value="DO_NOT_CONTACT">DNC</option>
            <option value="MEETING_BOOKED">Meeting Booked</option>
          </select>
          <button
            onClick={() => handleBulkAction("status")}
            disabled={bulkLoading}
            className="btn-primary text-sm py-1.5 px-4 disabled:opacity-50"
          >
            Apply Status
          </button>
          <button
            onClick={handleExportSelected}
            className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Export
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                if (confirm(`Delete ${selectedIds.size} contacts?`)) handleBulkAction("delete");
              }}
              disabled={bulkLoading}
              className="text-sm px-4 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contact Drawer */}
      {drawerContact && (
        <ContactDrawer
          contact={drawerContact}
          onClose={() => setDrawerContact(null)}
          onUpdate={(updated) => {
            setDrawerContact(updated);
            startTransition(() => router.refresh());
          }}
        />
      )}

      {/* Close menu on outside click */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
}
