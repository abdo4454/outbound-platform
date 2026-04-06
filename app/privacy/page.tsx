import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Accelerated Growth",
  description: "Accelerated Growth privacy policy — how we collect, use, and protect your data.",
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "March 1, 2026";
const COMPANY = "Accelerated Growth";
const EMAIL = "abdomohamedd950@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com";

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />

      <section className="bg-midnight-950 pt-32 pb-12">
        <div className="section max-w-3xl mx-auto">
          <h1 className="font-display text-display-sm text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="section max-w-3xl mx-auto prose prose-gray prose-lg">
          <div className="space-y-10 text-gray-600 leading-relaxed">

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">1. Who we are</h2>
              <p>
                {COMPANY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website at {APP_URL} and provides outbound sales services to B2B SaaS companies. This Privacy Policy explains how we collect, use, disclose, and protect information when you use our website or services.
              </p>
              <p className="mt-3">
                For questions about this policy, contact us at: <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">2. Information we collect</h2>
              <p className="font-semibold text-gray-800 mb-2">Information you provide directly:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Name, email address, company name, and phone number when you submit a form or book a call</li>
                <li>Billing information (processed securely by our payment processor — we never store full card numbers)</li>
                <li>Communications you send us by email or through the platform</li>
                <li>Account information when you register as a client</li>
              </ul>
              <p className="font-semibold text-gray-800 mb-2">Information collected automatically:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>IP address, browser type, operating system, and referring URLs</li>
                <li>Pages visited, time on site, and click behavior via analytics tools</li>
                <li>Cookies and similar tracking technologies (see Section 7)</li>
              </ul>
              <p className="font-semibold text-gray-800 mb-2">Prospect data (for outbound services):</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Business contact data (name, title, work email, company) sourced from reputable B2B data providers and public professional networks</li>
                <li>This data is processed under legitimate interest as the lawful basis under GDPR Article 6(1)(f)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">3. How we use your information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, operate, and improve our services</li>
                <li>To send transactional emails including booking confirmations and onboarding communications</li>
                <li>To send marketing emails to opted-in subscribers (you can unsubscribe at any time)</li>
                <li>To process billing and manage your account</li>
                <li>To analyze website usage and optimize our marketing</li>
                <li>To comply with legal obligations</li>
                <li>To conduct outbound campaigns on behalf of clients (prospect data only)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">4. Legal basis for processing (GDPR)</h2>
              <p>If you are in the European Economic Area (EEA) or United Kingdom, we process your data under the following legal bases:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong className="text-gray-800">Contract performance</strong> — processing necessary to deliver our services to you as a client</li>
                <li><strong className="text-gray-800">Legitimate interests</strong> — sending B2B marketing communications and outbound emails to business contacts where we have a legitimate commercial interest</li>
                <li><strong className="text-gray-800">Consent</strong> — for optional marketing emails, newsletter subscriptions, and cookies where consent is required</li>
                <li><strong className="text-gray-800">Legal obligation</strong> — where we are required to process data by law</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">5. Sharing your information</h2>
              <p>We do not sell your personal data. We share it only with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong className="text-gray-800">Service providers</strong> — trusted third-party vendors who assist in delivering our services, including payment processing, email delivery, data infrastructure, and analytics. Each is bound by data processing agreements.</li>
                <li><strong className="text-gray-800">Legal authorities</strong> — when required by law, court order, or to protect our rights</li>
                <li><strong className="text-gray-800">Business transfers</strong> — in connection with a merger, acquisition, or sale of assets, with appropriate confidentiality protections</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">6. Your rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong className="text-gray-800">Access</strong> — request a copy of the personal data we hold about you</li>
                <li><strong className="text-gray-800">Rectification</strong> — request correction of inaccurate or incomplete data</li>
                <li><strong className="text-gray-800">Erasure</strong> — request deletion of your personal data (&ldquo;right to be forgotten&rdquo;)</li>
                <li><strong className="text-gray-800">Restriction</strong> — request that we limit our processing of your data</li>
                <li><strong className="text-gray-800">Portability</strong> — receive your data in a structured, machine-readable format</li>
                <li><strong className="text-gray-800">Objection</strong> — object to processing based on legitimate interests, including marketing</li>
                <li><strong className="text-gray-800">Opt-out of marketing</strong> — unsubscribe from any email using the link at the bottom of every email, or by contacting us directly</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, email us at <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>. We will respond within 30 days.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
              <p>We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong className="text-gray-800">Essential cookies</strong> — required for authentication and basic site functionality. Cannot be disabled.</li>
                <li><strong className="text-gray-800">Analytics cookies</strong> — used to understand how visitors use our site. You may opt out via your browser settings or our cookie banner.</li>
                <li><strong className="text-gray-800">Marketing cookies</strong> — used to track conversions and attribution from paid campaigns. Optional and controlled via consent banner.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">8. Data retention</h2>
              <p>We retain personal data for as long as necessary to provide our services and comply with legal obligations:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Client account data — retained for the duration of the contract plus 7 years for financial records</li>
                <li>Lead/prospect data — retained for up to 24 months from last interaction, or until an opt-out is received</li>
                <li>Analytics data — aggregated and anonymized after 24 months</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">9. Security</h2>
              <p>
                We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, access controls, and regular security reviews. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security. We will notify affected users of any data breach as required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">10. International transfers</h2>
              <p>
                Our servers are located in the United States. If you are accessing our services from the EEA, UK, or other jurisdictions with data transfer restrictions, we rely on Standard Contractual Clauses (SCCs) or other appropriate safeguards for international transfers of personal data.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">11. Children</h2>
              <p>Our services are not directed to individuals under the age of 16. We do not knowingly collect personal data from minors.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">12. Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by email (if you have an account) or by posting a notice on our website. The &ldquo;Effective date&rdquo; at the top of this page will reflect the most recent update.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">13. Contact</h2>
              <p>
                For any privacy-related questions, requests, or concerns, please contact us at:
              </p>
              <div className="mt-3 p-5 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-800">{COMPANY}</p>
                <p>Email: <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a></p>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                If you are in the EEA or UK and we fail to address your concern, you have the right to lodge a complaint with your local data protection authority.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
