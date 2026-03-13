export function LogoCloud() {
  const logos = [
    "Acme Corp", "TechFlow", "Meridian", "Quantum", "NovaStar",
    "Pinnacle", "Zenith AI", "CloudBase",
  ];

  return (
    <section className="py-16 bg-white">
      <div className="section">
        <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">
          Trusted by 100+ B2B companies to fill their pipeline
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-xl font-display font-bold text-gray-300 hover:text-gray-400 transition-colors cursor-default"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
