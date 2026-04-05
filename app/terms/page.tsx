import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Accelrated Growth",
  description: "Accelrated Growth terms of service — the terms governing use of our outbound sales platform and services.",
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "March 1, 2026";
const COMPANY = "Accelrated Growth";
const EMAIL = "abdomohamedd950@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://accelratedgrowth.com";

export default function TermsPage() {
  return (
    <main>
      <Navbar />

      <section className="bg-midnight-950 pt-32 pb-12">
        <div className="section max-w-3xl mx-auto">
          <h1 className="font-display text-display-sm text-white mb-3">Terms of Service</h1>
          <p className="text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="section max-w-3xl mx-auto">
          <div className="space-y-10 text-gray-600 leading-relaxed">

            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of {APP_URL} and the services provided by {COMPANY} (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing our website or using our services, you agree to be bound by these Terms. If you do not agree, do not use our services.
            </p>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">1. Services</h2>
              <p>
                {COMPANY} provides managed outbound sales services including cold email campaign management, LinkedIn outreach, ICP research, lead sourcing, sequence copywriting, deliverability management, and appointment setting for B2B SaaS companies (&ldquo;Services&rdquo;).
              </p>
              <p className="mt-3">
                The specific scope, deliverables, and pricing for your engagement are defined in the Order Form or Statement of Work (&ldquo;SOW&rdquo;) executed between you and {COMPANY}. In the event of any conflict between these Terms and an SOW, the SOW shall control.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">2. Account registration and access</h2>
              <p>
                To access the client dashboard, you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You agree to notify us immediately at <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a> if you suspect any unauthorized use of your account.
              </p>
              <p className="mt-3">
                You must provide accurate and complete information when creating your account. We reserve the right to suspend or terminate accounts that contain false information or that violate these Terms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">3. Fees and payment</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All fees are specified in your SOW and are billed monthly in advance unless otherwise agreed</li>
                <li>Payment is due within 7 days of invoice. Overdue balances accrue interest at 1.5% per month</li>
                <li>All fees are non-refundable except as expressly stated in your SOW or required by law</li>
                <li>We reserve the right to update pricing with 30 days&apos; written notice for month-to-month agreements</li>
                <li>Taxes: Fees are exclusive of applicable taxes. You are responsible for all taxes, levies, or duties imposed by taxing authorities</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">4. Client obligations</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Provide accurate information about your ICP, product, and target market in a timely manner</li>
                <li>Respond to our communications within 2 business days to avoid campaign delays</li>
                <li>Maintain a functioning sales process capable of handling the meetings we book</li>
                <li>Not use our services for any unlawful, deceptive, or harassing outreach</li>
                <li>Ensure that any prospect lists you provide us comply with applicable data privacy laws</li>
                <li>Keep your account credentials confidential and notify us of any suspected breach</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">5. Intellectual property</h2>
              <p>
                <strong className="text-gray-800">{COMPANY} retains ownership of:</strong> all methodology, tools, templates, playbooks, and processes developed in connection with the Services. These are our proprietary materials and are licensed to you for use solely within the scope of our engagement.
              </p>
              <p className="mt-3">
                <strong className="text-gray-800">You retain ownership of:</strong> your company data, prospect lists you provide, and content you supply to us for use in campaigns. You grant us a limited license to use such materials solely to provide the Services.
              </p>
              <p className="mt-3">
                <strong className="text-gray-800">Campaign output:</strong> Email copy, sequences, and targeting lists created specifically for your campaigns are owned by you upon full payment of all fees.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">6. Confidentiality</h2>
              <p>
                Each party agrees to keep the other&apos;s confidential information (including business strategies, pricing, prospect data, and campaign performance) strictly confidential and to use it only for the purposes of the engagement. This obligation survives termination of the agreement for 3 years.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">7. Compliance with laws</h2>
              <p>
                You represent and warrant that your use of our Services will comply with all applicable laws and regulations, including but not limited to CAN-SPAM, GDPR, CASL, and any other applicable email marketing, privacy, and data protection laws. You are solely responsible for ensuring the legality of any outreach campaigns conducted on your behalf.
              </p>
              <p className="mt-3">
                We implement industry best practices including opt-out handling, suppression lists, and legitimate interest documentation. However, ultimate legal responsibility for campaign compliance rests with you as the data controller.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">8. Disclaimer of warranties</h2>
              <p>
                THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT OUR SERVICES WILL MEET YOUR SPECIFIC REQUIREMENTS OR THAT ANY SPECIFIC RESULTS (INCLUDING MEETING VOLUME OR REPLY RATES) WILL BE ACHIEVED, EXCEPT AS EXPRESSLY GUARANTEED IN YOUR SOW.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">9. Limitation of liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, {COMPANY.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="mt-3">
                OUR TOTAL CUMULATIVE LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU IN THE THREE (3) MONTHS PRECEDING THE CLAIM.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">10. Term and termination</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>These Terms remain in effect for the duration of your active subscription or SOW</li>
                <li>Either party may terminate a month-to-month agreement with 30 days&apos; written notice</li>
                <li>We may suspend or terminate your account immediately for material breach, including non-payment or violation of Section 4</li>
                <li>Upon termination, all licenses granted to you cease. We will provide you with an export of your campaign data within 14 days of termination</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">11. Governing law and disputes</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the jurisdiction in which {COMPANY} is incorporated, without regard to conflict of law principles. Any disputes shall first be subject to good-faith negotiation. If unresolved within 30 days, disputes shall be resolved by binding arbitration.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">12. Changes to terms</h2>
              <p>
                We may update these Terms from time to time. Material changes will be communicated by email or by posting a notice on our platform at least 14 days before taking effect. Continued use of our services after that date constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">13. Contact</h2>
              <p>Questions about these Terms? Contact us at:</p>
              <div className="mt-3 p-5 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-800">{COMPANY}</p>
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
