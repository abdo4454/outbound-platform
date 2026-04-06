export function LogoCloud() {
  const tools = [
    { name: "Instantly", category: "Sending" },
    { name: "Apollo.io", category: "Prospecting" },
    { name: "LinkedIn Sales Nav", category: "Intelligence" },
    { name: "Clay", category: "Enrichment" },
    { name: "HubSpot", category: "CRM" },
    { name: "Salesforce", category: "CRM" },
    { name: "Slack", category: "Alerts" },
    { name: "Stripe", category: "Billing" },
  ];

  return (
    <section className="py-14 bg-gray-50 border-y border-gray-100">
      <div className="section">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-8">
          Built on best-in-class outbound infrastructure
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
