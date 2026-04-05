import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { BookCall } from "@/components/marketing/book-call";
import { Mail, MessageSquare, Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Accelrated Growth",
  description:
    "Get in touch with Accelrated Growth. Book a strategy call, ask about our B2B outbound services, or inquire about careers.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://accelratedgrowth.com"}/contact`,
  },
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@accelratedgrowth.com";

const CONTACT_OPTIONS = [
  {
    icon: MessageSquare,
    title: "Book a Strategy Call",
    description: "Free 30-minute call to discuss your outbound goals, ICP, and what a pipeline engine looks like for your SaaS.",
    action: "Book a call",
    href: "/book",
  },
  {
    icon: Mail,
    title: "General Enquiries",
    description: "Questions about our services, pricing, or process? Drop us an email and we'll respond within one business day.",
    action: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: Briefcase,
    title: "Careers",
    description: "Interested in joining the team? See our open roles or send a speculative application.",
    action: "View open roles",
    href: "/careers",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-16">
        <div className="section text-center">
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-4">
            Get in touch
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Whether you want to talk outbound strategy, ask about pricing, or just have a question — we&apos;re here.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="py-20 bg-white">
        <div className="section">
          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {CONTACT_OPTIONS.map((opt) => (
              <div key={opt.title} className="card text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                  <opt.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{opt.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{opt.description}</p>
                <a
                  href={opt.href}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  {opt.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookCall />
      <Footer />
    </main>
  );
}
