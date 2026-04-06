export function LogoCloud() {
  const tools = [
    { name: "Email Delivery", category: "Infrastructure" },
    { name: "Prospect Data", category: "Sourcing" },
    { name: "Professional Networks", category: "Intelligence" },
    { name: "Data Enrichment", category: "Personalization" },
    { name: "CRM Sync", category: "Pipeline" },
    { name: "Intent Signals", category: "Targeting" },
    { name: "Meeting Alerts", category: "Notifications" },
    { name: "Secure Billing", category: "Payments" },
  ];

  return (
    <section className="py-14 bg-gray-50 border-y border-gray-100">
      <div className="section">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-8">
          Enterprise-grade infrastructure, fully managed
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {tools.map((tool) => (
            <div key={tool.name} className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-default">
                {tool.name}
              </span>
              <span className="text-[10px] text-gray-300 uppercase tracking-wider">{tool.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
