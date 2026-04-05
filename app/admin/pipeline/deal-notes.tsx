"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Loader2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

type Note = { id: string; content: string; authorId: string; createdAt: string };

export function DealNotes({ dealId }: { dealId: string }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function fetchNotes() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/notes`);
      const data = await res.json();
      setNotes(data.notes ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open && notes.length === 0) fetchNotes();
  }, [open]);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft.trim() }),
      });
      if (res.ok) {
        setDraft("");
        await fetchNotes();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(noteId: string) {
    await fetch(`/api/admin/deals/${dealId}/notes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId }),
    });
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }

  return (
    <div className="mt-2 border-t border-gray-100 pt-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors w-full"
      >
        <MessageSquare className="w-3 h-3" />
        Notes {notes.length > 0 && `(${notes.length})`}
        {open ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="group flex items-start gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-2 py-1.5">
                <span className="flex-1">{note.content}</span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}

          <form onSubmit={addNote} className="flex gap-1.5">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a note…"
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-300"
            />
            <button
              type="submit"
              disabled={saving || !draft.trim()}
              className="text-xs bg-brand-600 text-white rounded-lg px-2 py-1 disabled:opacity-40 hover:bg-brand-700 transition-colors"
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
