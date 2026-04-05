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
      name: "What is appointment setting for B2B SaaS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Appointment setting is the process of identifying ideal-fit prospects, reaching out via cold email or LinkedIn, handling replies, and booking qualified sales meetings directly onto your calendar. For B2B SaaS companies, this replaces or supplements an internal SDR team — giving you a consistent flow of qualified meetings without hiring.",
      },
    },
    {
      "@type": "Question",
      name: "How does go-to-market outbound support work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We embed into your go-to-market motion as a fully managed outbound layer. We handle ICP definition, contact sourcing, email infrastructure, copywriting, A/B testing, reply management, and CRM handoff. You focus on closing — we handle everything upstream.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work with early-stage SaaS or only funded companies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work with SaaS companies from seed stage to Series C. The main requirements are: you have a clear ICP, a product that's actively selling, and an AE (or founder) who can run discovery calls. Budget typically starts at $2,500/month.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can we start seeing meetings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Week 1 is setup — domains, warm-up, sequence writing, and ICP targeting. Week 2 emails start going out. Most clients see their first booked meetings in week 2-3. By month 2 you're in full swing.",
      },
    },
    {
      "@type": "Question",
      name: "What cold email strategies do you use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We combine hyper-personalized first lines, trigger-based targeting (funding rounds, hiring signals, tech stack changes), multi-step sequences, and rigorous deliverability management. Our average reply rate is 18.7% vs. the industry average of 3–5%.",
      },
    },
    {
      "@type": "Question",
      name: "What's your guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We guarantee a minimum number of qualified meetings per month based on your ICP and plan. If we fall short, we work for free until we make it up. We've only triggered this guarantee twice in three years — and both times we over-delivered in the following month.",
      },
    },
    {
      "@type": "Question",
      name: "Do you run LinkedIn outreach too?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, as an add-on or included in the Scale plan. LinkedIn outreach is coordinated with email — we never spray the same person on both channels at once. The two-touch approach (email first, LinkedIn follow-up after a reply or open) consistently lifts conversion by 20-30%.",
      },
    },
    {
      "@type": "Question",
      name: "What CRMs do you integrate with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HubSpot, Salesforce, Pipedrive, Close, and Attio. Every booked meeting flows directly into your pipeline with contact data, sequence history, and full attribution. We also sync to Slack so you get a ping every time a meeting is booked.",
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
