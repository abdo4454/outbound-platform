"use client";

import { useState } from "react";
import { Coins, Plus } from "lucide-react";

interface Props {
  clientId: string;
  initialBalance: number;
}

export function CreditsPanel({ clientId, initialBalance }: Props) {
  const [balance, setBalance] = useState(initialBalance);
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleAdd() {
    const n = parseInt(amount, 10);
    if (!n || n <= 0) return;
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: clientId, amount: n, mode: "add" }),
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.creditBalance);
        setMsg(`Added ${n} credits. New balance: ${data.creditBalance}`);
      } else {
        setMsg(data.error ?? "Failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSet() {
    const n = parseInt(amount, 10);
    if (n < 0) return;
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: clientId, amount: n, mode: "set" }),
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.creditBalance);
        setMsg(`Balance set to ${data.creditBalance}`);
      } else {
        setMsg(data.error ?? "Failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Balance display */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Coins className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{balance.toLocaleString()}</div>
          <div className="text-sm text-gray-500">credits available</div>
        </div>
      </div>

      {/* Preset packages */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[50, 100, 500, 1000].map((n) => (
          <button
            key={n}
            onClick={() => setAmount(String(n))}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              amount === String(n)
                ? "bg-brand-600 text-white border-brand-600"
                : "border-gray-200 text-gray-700 hover:border-brand-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Custom amount + actions */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-400"
          placeholder="Amount"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
        <button
          onClick={handleSet}
          disabled={loading}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Set Exact
        </button>
      </div>

      {msg && (
        <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{msg}</p>
      )}

      <p className="mt-3 text-xs text-gray-400">
        1 credit = 1 contact unlock (reveals full email + phone). Credits never expire.
      </p>
    </div>
  );
}
