import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "@/styles/globals.css";
import { CookieConsentBanner } from "@/components/analytics/cookie-consent-banner";
import { ConsentScripts } from "@/components/analytics/consent-scripts";
import { MetaPixelPageView } from "@/components/analytics/meta-pixel";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-cabinet",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-general-sans",
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Accelerated Growth | B2B SaaS Appointment Setting & Outbound Agency",
    template: "%s | Accelerated Growth",
  },
  description:
    "Accelerated Growth is the done-for-you outbound agency for B2B SaaS companies. We handle cold email, LinkedIn outreach, ICP research, and appointment setting — delivering 20–50 qualified sales meetings per month.",
  keywords: [
    "appointment setting for B2B SaaS",
    "B2B SaaS outbound agency",
    "cold email agency",
    "outbound sales development",
    "go-to-market agency",
    "SDR as a service",
    "outsourced SDR",
    "B2B lead generation",
    "sales appointment setting",
    "cold email outreach service",
    "pipeline generation SaaS",
    "outbound GTM",
    "managed outbound",
    "B2B meeting booking",
    "SaaS pipeline building",
    "cold outreach agency",
    "sales development representative",
    "qualified meeting booking",
    "outbound sales agency",
    "go-to-market execution",
  ],
  authors: [{ name: "Accelerated Growth" }],
  creator: "Accelerated Growth",
  publisher: "Accelerated Growth",
  alternates: { canonical: APP_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Accelerated Growth",
    title: "Accelerated Growth | B2B SaaS Appointment Setting & Outbound Agency",
    description:
      "Done-for-you cold email, LinkedIn outreach, and appointment setting for B2B SaaS companies. We build your outbound GTM engine and deliver 20–50 qualified meetings per month.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accelerated Growth — B2B SaaS Appointment Setting & Outbound Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accelerated Growth | B2B SaaS Appointment Setting & Outbound Agency",
    description:
      "Done-for-you cold email, LinkedIn outreach, and appointment setting for B2B SaaS companies. 20–50 qualified meetings per month.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: "Accelerated Growth",
  url: APP_URL,
  logo: {
    "@type": "ImageObject",
    url: `${APP_URL}/logo-icon.svg`,
    contentUrl: `${APP_URL}/logo-icon.svg`,
  },
  image: `${APP_URL}/opengraph-image`,
  description:
    "Accelerated Growth is a done-for-you B2B SaaS outbound agency specializing in cold email outreach, LinkedIn outbound, ICP research, and appointment setting. We deliver 20–50 qualified sales meetings per month for B2B SaaS companies.",
  slogan: "Predictable pipeline for B2B SaaS companies.",
  sameAs: [
    "https://www.linkedin.com/company/acceleratedgrowth",
    "https://twitter.com/accgrowth",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    url: `${APP_URL}/book`,
    availableLanguage: "English",
  },
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  serviceType: [
    "B2B Outbound Sales",
    "Appointment Setting",
    "Cold Email Outreach",
    "LinkedIn Outreach",
    "Sales Development",
    "Go-to-Market Execution",
  ],
  knowsAbout: [
    "B2B SaaS outbound sales",
    "appointment setting for SaaS",
    "cold email outreach",
    "go-to-market strategy",
    "sales development",
    "pipeline generation",
    "LinkedIn outreach",
    "ICP research",
    "email deliverability",
    "outbound sales sequencing",
    "SDR as a service",
    "outsourced sales development",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Outbound Agency Services",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Starter — Cold Email Outbound",
        price: "2500",
        priceCurrency: "USD",
        description: "Fully managed cold email outbound. 20–30 qualified meetings/month target.",
        eligibleCustomerType: "B2B SaaS companies, Seed to Series C",
      },
      {
        "@type": "Offer",
        name: "Growth — Cold Email + LinkedIn",
        price: "5000",
        priceCurrency: "USD",
        description: "Cold email and LinkedIn outreach combined. 30–50 qualified meetings/month target.",
        eligibleCustomerType: "B2B SaaS companies, Seed to Series C",
      },
      {
        "@type": "Offer",
        name: "Scale — Full GTM Outbound",
        price: "10000",
        priceCurrency: "USD",
        description: "Full multi-channel outbound with intent data and dedicated strategy. 50+ qualified meetings/month target.",
        eligibleCustomerType: "B2B SaaS companies, Series A to Series C",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body min-h-screen">
        {/* Consent-gated analytics & marketing scripts */}
        <ConsentScripts
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
          metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
          posthogKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
          posthogHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
        />
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Suspense fallback={null}>
            <MetaPixelPageView />
          </Suspense>
        )}
        {children}
        {/* Cookie consent banner — appears for first-time visitors */}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
