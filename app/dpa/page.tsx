import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing Agreement (DPA) | Accelrated Growth",
  description: "Accelrated Growth Data Processing Agreement — GDPR-compliant DPA covering processing of personal data in connection with our outbound services.",
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "March 1, 2026";
const COMPANY = "Accelrated Growth";
const EMAIL = "abdomohamedd950@gmail.com";

export default function DPAPage() {
  return (
    <main>
      <Navbar />

      <section className="bg-midnight-950 pt-32 pb-12">
        <div className="section max-w-3xl mx-auto">
          <h1 className="font-display text-display-sm text-white mb-3">Data Processing Agreement</h1>
          <p className="text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="section max-w-3xl mx-auto">
          <div className="space-y-10 text-gray-600 leading-relaxed">

            <div className="bg-brand-50 border border-brand-100 rounded-xl p-6">
              <p className="text-brand-800 font-semibold mb-2">Need a signed DPA?</p>
              <p className="text-brand-700 text-sm">
                If your organization requires a signed Data Processing Agreement (e.g., for GDPR compliance), please email us at <a href={`mailto:${EMAIL}`} className="underline">{EMAIL}</a>. We will provide a countersigned DPA within 3 business days.
              </p>
            </div>

            <p>
              This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the Terms of Service and any applicable Statement of Work between you (&ldquo;Controller&rdquo; or &ldquo;Client&rdquo;) and {COMPANY} (&ldquo;Processor&rdquo;). It governs the processing of personal data by {COMPANY} on your behalf in connection with our outbound sales services.
            </p>

            <p>
              This DPA is intended to comply with Article 28 of the General Data Protection Regulation (EU) 2016/679 (&ldquo;GDPR&rdquo;), the UK GDPR, and other applicable data protection laws.
            </p>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">1. Definitions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-gray-800">Personal Data</strong> — any information relating to an identified or identifiable natural person, as defined in Article 4(1) GDPR</li>
                <li><strong className="text-gray-800">Processing</strong> — any operation performed on personal data, including collection, storage, use, disclosure, and deletion</li>
                <li><strong className="text-gray-800">Controller</strong> — the party (Client) that determines the purposes and means of processing personal data</li>
                <li><strong className="text-gray-800">Processor</strong> — {COMPANY}, which processes personal data on behalf of the Controller</li>
                <li><strong className="text-gray-800">Sub-processor</strong> — a third party engaged by the Processor to process personal data</li>
                <li><strong className="text-gray-800">Data Subject</strong> — the natural person to whom personal data relates (i.e., the B2B prospects we contact on your behalf)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">2. Nature and purpose of processing</h2>
              <p>{COMPANY} processes personal data on behalf of the Client for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Identifying and sourcing B2B prospect contact information from lawful data sources</li>
                <li>Sending outbound email and LinkedIn messages to prospects on the Client&apos;s behalf</li>
                <li>Managing replies and booking sales appointments</li>
                <li>Maintaining suppression lists and honoring opt-out requests</li>
                <li>Reporting campaign performance to the Client</li>
              </ul>
              <p className="mt-4">
                <strong className="text-gray-800">Categories of personal data processed:</strong> Business email addresses, full names, job titles, company names, LinkedIn profile URLs, and basic company firmographic data. We do not process special category data.
              </p>
              <p className="mt-3">
                <strong className="text-gray-800">Data subjects:</strong> Business professionals (prospects) who are employees of companies in the Client&apos;s target market.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">3. Processor obligations</h2>
              <p>{COMPANY} agrees to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Process personal data only on documented instructions from the Controller, including with regard to transfers to third countries, unless required to do so by applicable law</li>
                <li>Ensure that all personnel authorized to process personal data are bound by appropriate confidentiality obligations</li>
                <li>Implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk (Article 32 GDPR)</li>
                <li>Not engage sub-processors without prior written authorization from the Controller (general authorization is granted for the sub-processors listed in Schedule A)</li>
                <li>Assist the Controller with data subject access requests, erasure requests, and other requests exercising data subjects&apos; rights</li>
                <li>Notify the Controller without undue delay (and no later than 72 hours) upon becoming aware of a personal data breach</li>
                <li>Delete or return all personal data upon termination of services, at the Controller&apos;s choice</li>
                <li>Make available all information necessary to demonstrate compliance with Article 28 obligations and allow for audits</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">4. Controller obligations</h2>
              <p>The Controller represents and warrants that:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>It has the legal authority to engage {COMPANY} to process personal data as described in this DPA</li>
                <li>Processing of prospect data under this DPA is conducted on the basis of legitimate interests (Article 6(1)(f) GDPR) or another lawful basis</li>
                <li>Any prospect data provided to {COMPANY} by the Controller was obtained lawfully</li>
                <li>It will maintain records of processing activities as required by Article 30 GDPR</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">5. Sub-processors (Schedule A)</h2>
              <p>The Controller grants general authorization for {COMPANY} to engage the following sub-processors:</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Sub-processor</th>
                      <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Purpose</th>
                      <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Supabase", "Database & storage", "EU / US"],
                      ["Apollo.io", "Prospect data sourcing", "US"],
                      ["Instantly.ai", "Email sending infrastructure", "US"],
                      ["Google (Gmail/Workspace)", "Email delivery", "US / EU"],
                      ["Stripe", "Payment processing", "US / EU"],
                      ["Inngest", "Workflow automation", "US"],
                      ["PostHog", "Analytics", "US / EU"],
                    ].map(([name, purpose, location]) => (
                      <tr key={name} className="border-b border-gray-100">
                        <td className="p-3 border border-gray-200 font-medium text-gray-800">{name}</td>
                        <td className="p-3 border border-gray-200 text-gray-600">{purpose}</td>
                        <td className="p-3 border border-gray-200 text-gray-600">{location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                We will notify you of any intended changes to this list (additions or replacements) at least 14 days in advance, giving you the opportunity to object.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">6. International transfers</h2>
              <p>
                Where personal data is transferred to sub-processors outside the EEA or UK, {COMPANY} shall ensure that appropriate safeguards are in place in accordance with Chapter V of the GDPR, including (as applicable):
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>The UK International Data Transfer Agreement (IDTA)</li>
                <li>Adequacy decisions where applicable</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">7. Security measures</h2>
              <p>Technical and organizational measures in place include:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Encryption of personal data in transit (TLS 1.2+) and at rest (AES-256)</li>
                <li>Access controls and role-based permissions limiting data access to authorized personnel</li>
                <li>Regular security reviews and vulnerability assessments</li>
                <li>Incident response procedures with defined escalation paths</li>
                <li>Employee training on data protection and confidentiality</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">8. Term and termination</h2>
              <p>
                This DPA shall remain in force for the duration of the engagement between the parties. Upon termination or expiry of the services, {COMPANY} shall, at the Controller&apos;s written request, delete or return all personal data within 30 days, unless applicable law requires retention.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
              <p>For DPA-related queries or to request a countersigned copy:</p>
              <div className="mt-3 p-5 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-800">{COMPANY} — Data Privacy</p>
                <p>Email: <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
