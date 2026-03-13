import Link from "next/link";

const LINKS = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "Case Studies", href: "/case-studies" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Cold Email Playbook", href: "/resources/playbook" },
    { label: "ROI Calculator", href: "/calculator" },
    { label: "ICP Template", href: "/resources/icp-template" },
    { label: "Client Login", href: "/sign-in" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "DPA", href: "/dpa" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="section">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">OP</span>
              </div>
              <span className="font-display font-bold text-lg text-gray-900">
                OutboundPro
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Done-for-you outbound that books qualified meetings on your calendar.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} OutboundPro. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
