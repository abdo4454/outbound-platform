import { db } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import { Users, DollarSign, TrendingUp, Link as LinkIcon } from "lucide-react";
import { NewReferralButton } from "./new-referral-button";

function fmt(cents: number) {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default async function ReferralsPage() {
  const member = await getCurrentMember();
  if (!member || member.role !== "ADMIN") redirect("/dashboard");

  let referrals: Awaited<ReturnType<typeof db.referral.findMany>> = [];
  try {
    referrals = await db.referral.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    referrals = [];
  }

  const activeReferrals = referrals.filter((r) => r.status === "active");
  const totalEarned = referrals.reduce((s, r) => s + r.totalEarned, 0);
  const totalPaid = referrals.reduce((s, r) => s + r.totalPaid, 0);
  const totalConversions = referrals.reduce((s, r) => s + r.conversions, 0);
  const totalClicks = referrals.reduce((s, r) => s + r.clicks, 0);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://accelratedgrowth.com";

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Partners", value: activeReferrals.length.toString(), icon: Users, color: "bg-brand-50 text-brand-600" },
          { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: LinkIcon, color: "bg-indigo-50 text-indigo-600" },
          { label: "Conversions", value: totalConversions.toString(), icon: TrendingUp, color: "bg-green-50 text-green-600" },
          { label: "Commissions Earned", value: fmt(totalEarned), icon: DollarSign, color: "bg-amber-50 text-amber-600" },
        ].map((k) => (
          <div key={k.label} className="card">
            <div className={`w-10 h-10 rounded-xl ${k.color} flex items-center justify-center mb-3`}>
              <k.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Unpaid commissions alert */}
      {totalEarned > totalPaid && (
        <div className="card bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900">Unpaid commissions: {fmt(totalEarned - totalPaid)}</p>
                <p className="text-sm text-amber-700 mt-0.5">
                  {fmt(totalEarned)} earned · {fmt(totalPaid)} paid out
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referrals table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h3 className="font-display font-bold text-gray-900">Referral Partners</h3>
            <p className="text-sm text-gray-400 mt-0.5">{referrals.length} total partners</p>
          </div>
          <NewReferralButton />
        </div>

        {referrals.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-600 mb-1">No referral partners yet</p>
            <p>Create a referral code to start tracking partner-driven signups.</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Partner</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Signups</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversions</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Earned</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {referrals.map((r) => {
                  const unpaid = r.totalEarned - r.totalPaid;
                  const commissionLabel = r.commissionType === "percentage"
                    ? `${r.commissionValue / 100}%`
                    : r.commissionType === "recurring"
                    ? `${fmt(r.commissionValue)}/mo`
                    : fmt(r.commissionValue);

                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-gray-900">{r.referrerName || r.referrerEmail}</div>
                        <div className="text-xs text-gray-400">{r.referrerEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono">{r.code}</code>
                          <a
                            href={`${appUrl}?ref=${r.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-600 hover:underline"
                          >
                            ↗
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                        {commissionLabel} {r.commissionType === "flat" ? "flat" : r.commissionType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.clicks}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.signups}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{r.conversions}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{fmt(r.totalEarned)}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{fmt(r.totalPaid)}</div>
                        {unpaid > 0 && (
                          <div className="text-xs text-amber-600 font-medium">{fmt(unpaid)} owed</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={r.status === "active" ? "badge-success" : "badge-gray"}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card bg-gray-50 border-0">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">How referrals work:</span> Each partner gets a unique link
          ({appUrl}?ref=CODE). Track clicks, signups, and conversions here. Commissions are calculated manually —
          mark payments as paid when processed.
        </p>
      </div>
    </div>
  );
}
