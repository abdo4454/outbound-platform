import { db } from "@/lib/db";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewDealButton, MoveDealButton } from "./pipeline-actions";

const STAGES = [
  { key: "DISCOVERY_BOOKED", label: "Discovery Booked", color: "border-t-blue-500", bg: "bg-blue-50" },
  { key: "DISCOVERY_COMPLETE", label: "Discovery Done", color: "border-t-indigo-500", bg: "bg-indigo-50" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", color: "border-t-amber-500", bg: "bg-amber-50" },
  { key: "NEGOTIATION", label: "Negotiating", color: "border-t-orange-500", bg: "bg-orange-50" },
  { key: "CLOSED_WON", label: "Closed Won", color: "border-t-green-500", bg: "bg-green-50" },
  { key: "CLOSED_LOST", label: "Closed Lost", color: "border-t-gray-400", bg: "bg-gray-50" },
] as const;

async function getDeals() {
  try {
    return await db.deal.findMany({
      orderBy: { createdAt: "desc" },
      include: { leads: { select: { email: true, name: true, company: true } } },
    });
  } catch {
    return [];
  }
}

async function getOrgs() {
  try {
    return await db.organization.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

function formatMoney(cents: number) {
  return "$" + (cents / 100).toLocaleString("en-US");
}

// Demo deals to show when DB is empty
const DEMO_DEALS = [
  { id: "d1", title: "Acme SaaS", stage: "DISCOVERY_BOOKED", value: 500000, services: '["cold_email"]', leads: [{ email: "alex@acme.io", name: "Alex Johnson", company: "Acme" }], createdAt: new Date(), updatedAt: new Date() },
  { id: "d2", title: "TechStack Inc", stage: "PROPOSAL_SENT", value: 500000, services: '["cold_email", "linkedin"]', leads: [], createdAt: new Date(), updatedAt: new Date() },
  { id: "d3", title: "DataFlow", stage: "DISCOVERY_COMPLETE", value: 1000000, services: '["cold_email"]', leads: [], createdAt: new Date(), updatedAt: new Date() },
  { id: "d4", title: "DevCraft SaaS", stage: "CLOSED_WON", value: 250000, services: '["cold_email"]', leads: [], createdAt: new Date(), updatedAt: new Date() },
  { id: "d5", title: "BuildRight", stage: "NEGOTIATION", value: 500000, services: '["cold_email", "linkedin"]', leads: [], createdAt: new Date(), updatedAt: new Date() },
];

export default async function PipelinePage() {
  let deals = await getDeals();
  const orgs = await getOrgs();
  const isDemo = deals.length === 0;
  if (isDemo) deals = DEMO_DEALS as typeof deals;

  const totalPipeline = deals
    .filter((d) => d.stage !== "CLOSED_WON" && d.stage !== "CLOSED_LOST")
    .reduce((sum, d) => sum + d.value, 0);
  const totalWon = deals
    .filter((d) => d.stage === "CLOSED_WON")
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-sm text-gray-500">Open pipeline</span>
            <span className="ml-2 font-bold text-gray-900">{formatMoney(totalPipeline)}/mo</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Closed won</span>
            <span className="ml-2 font-bold text-green-600">{formatMoney(totalWon)}/mo</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Total deals</span>
            <span className="ml-2 font-bold text-gray-900">{deals.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
              Demo data
            </span>
          )}
          <NewDealButton orgs={orgs} />
        </div>
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-4 min-w-max pb-4">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div key={stage.key} className="w-64 flex-shrink-0">
                {/* Column header */}
                <div className={cn("rounded-xl border-t-2 bg-white p-4 mb-3", stage.color, "border border-gray-100 border-t-2")}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{stage.label}</span>
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", stage.bg, "text-gray-600")}>
                      {stageDeals.length}
                    </span>
                  </div>
                  {stageValue > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <DollarSign className="w-3 h-3" />
                      {formatMoney(stageValue)}/mo
                    </div>
                  )}
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold text-sm text-gray-900">{deal.title}</div>
                        {!isDemo && <MoveDealButton dealId={deal.id} currentStage={deal.stage} />}
                      </div>
                      <div className="flex items-center gap-1 text-brand-600 font-bold text-sm mb-2">
                        <DollarSign className="w-3.5 h-3.5" />
                        {formatMoney(deal.value)}/mo
                      </div>
                      {deal.leads.length > 0 && (
                        <div className="text-xs text-gray-400 mb-2">
                          {deal.leads[0].name || deal.leads[0].email}
                          {deal.leads[0].company && ` · ${deal.leads[0].company}`}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {(JSON.parse(deal.services || "[]") as string[]).map((s) => (
                          <span key={s} className="text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                            {s.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400">No deals</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Predictable Revenue projection */}
      <div className="card bg-gradient-to-r from-midnight-950 to-midnight-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg mb-1">Revenue Projection</h3>
            <p className="text-gray-400 text-sm">Based on current pipeline velocity</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display font-bold text-green-400">
              {formatMoney(totalPipeline * 25 / 100)}/mo
            </div>
            <div className="text-sm text-gray-400">Expected new MRR (25% close rate)</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold">{deals.filter(d => d.stage !== "CLOSED_LOST").length}</div>
            <div className="text-xs text-gray-400">Active deals</div>
          </div>
          <div>
            <div className="text-xl font-bold">{formatMoney(totalPipeline)}</div>
            <div className="text-xs text-gray-400">Pipeline/mo</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-400">{formatMoney(totalWon)}</div>
            <div className="text-xs text-gray-400">Closed won/mo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
