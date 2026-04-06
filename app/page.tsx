import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { HeroSection } from "@/components/marketing/hero";
import { LogoCloud } from "@/components/marketing/logo-cloud";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Services } from "@/components/marketing/services";
import { Results } from "@/components/marketing/results";
import { PlatformPreview } from "@/components/marketing/platform-preview";
import { Testimonials } from "@/components/marketing/testimonials";
import { ROICalculator } from "@/components/marketing/roi-calculator";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { BookCall } from "@/components/marketing/book-call";
import { CTASection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";
import { ExitIntentPopup } from "@/components/marketing/exit-intent-popup";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com";

export const metadata: Metadata = {
  title: "B2B SaaS Appointment Setting & Cold Email Outbound Agency",
  description:
    "Accelerated Growth builds done-for-you outbound engines for B2B SaaS companies. Cold email, LinkedIn outreach, ICP research, and appointment setting — 20–50 qualified sales meetings per month, fully managed.",
  alternates: { canonical: APP_URL },
  openGraph: {
    title: "B2B SaaS Appointment Setting & Cold Email Outbound Agency | Accelerated Growth",
    description:
      "Done-for-you cold email outreach, LinkedIn outbound, and appointment setting for B2B SaaS. We build your go-to-market engine and fill your calendar with qualified meetings.",
    url: APP_URL,
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "B2B SaaS Outbound & Appointment Setting",
  provider: { "@type": "Organization", name: "Accelerated Growth", url: APP_URL },
  serviceType: "B2B Outbound Sales & Appointment Setting",
  description:
    "Done-for-you outbound engine for B2B SaaS companies. Includes cold email outreach, LinkedIn outbound, ICP research, copywriting, sending infrastructure, reply management, and appointment setting.",
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Outbound Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Starter Plan",
        description: "Cold email outreach with 20–30 qualified meetings per month",
        price: "2500",
        priceCurrency: "USD",
        priceSpecification: { "@type": "RecurringCharges", billingPeriod: "Monthly" },
      },
      {
        "@type": "Offer",
        name: "Growth Plan",
        description: "Cold email + LinkedIn outreach, 30–50 qualified meetings per month",
        price: "5000",
        priceCurrency: "USD",
        priceSpecification: { "@type": "RecurringCharges", billingPeriod: "Monthly" },
      },
      {
        "@type": "Offer",
        name: "Scale Plan",
        description: "Full go-to-market outbound: multi-channel, intent data, 50+ meetings",
        price: "10000",
        priceCurrency: "USD",
        priceSpecification: { "@type": "RecurringCharges", billingPeriod: "Monthly" },
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is B2B appointment setting and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "B2B appointment setting is the process of identifying ideal-fit prospects, reaching out via cold email or LinkedIn, handling replies and objections, and booking qualified sales meetings directly onto your calendar. For B2B SaaS companies, it replaces or supplements an internal SDR team — giving you a consistent, predictable flow of pipeline without the overhead of hiring and managing reps.",
      },
    },
    {
      "@type": "Question",
      name: "How does a fully managed outbound agency work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A fully managed outbound agency embeds into your go-to-market motion as a done-for-you layer. At Accelerated Growth, we handle ICP definition, contact sourcing, email infrastructure setup, sequence copywriting, A/B testing, reply management, CRM handoff, and weekly reporting. You focus on running discovery calls and closing deals — we handle everything upstream from first contact to booked meeting.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Accelerated Growth different from other outbound agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most outbound agencies deliver a contact list and a 3-step email sequence, then move on. Accelerated Growth builds a full, continuously optimized outbound engine: dedicated sending infrastructure, weekly optimization cycles, real-time client dashboards, and a minimum meeting guarantee in every contract. We're specialists in B2B SaaS specifically — not generalists who work across industries.",
      },
    },
    {
      "@type": "Question",
      name: "How much does B2B outbound agency services cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Accelerated Growth pricing starts at $2,500/month for the Starter plan (cold email, 20–30 meetings/month target), $5,000/month for Growth (cold email + LinkedIn, 30–50 meetings/month), and $10,000/month for Scale (full multi-channel outbound, 50+ meetings/month). All plans are month-to-month with no long-term contracts required.",
      },
    },
    {
      "@type": "Question",
      name: "Is outbound sales more effective than inbound for B2B SaaS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Outbound and inbound serve different purposes. Inbound attracts prospects who are actively searching — it's high intent but slow to build. Outbound finds your ideal buyers before they start searching — it's faster to results and fully predictable in volume. For B2B SaaS companies that need consistent pipeline now, outbound is the most reliable motion. The best go-to-market strategies use both, with outbound generating meetings while inbound builds long-term brand authority.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can a B2B SaaS company start seeing meetings from outbound?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "With Accelerated Growth, week 1 is setup: sending domains, warmup, ICP research, and sequence writing. Emails start going out in week 2. Most clients see their first booked meetings in weeks 2–3. By month 2, campaigns are at full velocity. This is significantly faster than building an internal SDR team, which typically takes 6–9 months to produce consistent pipeline.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work with early-stage SaaS startups?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Accelerated Growth works with B2B SaaS companies from seed stage through Series C. The requirements are: a clear ideal customer profile (ICP), a product that is actively selling, and a founder or account executive who can run discovery calls. Budget starts at $2,500/month.",
      },
    },
    {
      "@type": "Question",
      name: "What is a realistic cold email reply rate for B2B outbound?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The industry average cold email reply rate is 3–5% for most B2B outbound campaigns. High-performing campaigns targeting well-defined ICPs with personalized messaging and strong deliverability can reach 8–15%. The key drivers are ICP precision, first-line personalization, sequence structure, sending domain reputation, and trigger-based targeting (funding rounds, hiring surges, tech stack signals).",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between an SDR agency and an appointment setting agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An SDR agency provides outsourced sales development representatives who prospect and qualify leads. An appointment setting agency focuses specifically on booking qualified meetings onto your calendar. Accelerated Growth combines both: we handle all SDR functions (prospecting, outreach, qualification) and the output is booked meetings with briefed, pre-qualified buyers — not just a list of leads to follow up on yourself.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer LinkedIn outreach alongside cold email?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. LinkedIn outreach is included in the Growth and Scale plans, and available as an add-on for Starter clients. We coordinate email and LinkedIn sequences so the same prospect is never contacted on both channels simultaneously — the approach is sequenced to maximize response without appearing spammy. A two-touch approach (email first, LinkedIn follow-up) consistently lifts overall conversion rates.",
      },
    },
    {
      "@type": "Question",
      name: "What is your meeting guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every Accelerated Growth contract includes a minimum number of qualified meetings per month based on your ICP, market size, and plan. If we fall short in any given month, we keep working at no extra charge until we make it up. This guarantee is written into every contract — not a verbal promise.",
      },
    },
    {
      "@type": "Question",
      name: "What CRMs do you integrate with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Accelerated Growth integrates with HubSpot, Salesforce, Pipedrive, Close, and Attio. Every booked meeting flows directly into your pipeline with contact data, sequence history, and full attribution. We also send real-time Slack alerts every time a meeting is booked.",
      },
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Accelerated Growth",
  url: APP_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${APP_URL}/case-studies` },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Navbar />
      <HeroSection />
      <LogoCloud />
      <HowItWorks />
      <Services />
      <Results />
      <PlatformPreview />
      <Testimonials />
      <ROICalculator />
      <Pricing />
      <FAQ />
      <BookCall />
      <CTASection />
      <Footer />
      <ExitIntentPopup />
    </main>
  );
}
