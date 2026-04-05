import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "@/styles/globals.css";
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
  "@type": "Organization",
  name: "Accelerated Growth",
  url: APP_URL,
  logo: `${APP_URL}/og-image.png`,
  description:
    "Done-for-you B2B SaaS outbound agency. We handle cold email, LinkedIn outreach, ICP research, and appointment setting for SaaS companies.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    url: `${APP_URL}/book`,
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "B2B SaaS outbound sales",
    "appointment setting",
    "cold email outreach",
    "go-to-market strategy",
    "sales development",
    "pipeline generation",
    "LinkedIn outreach",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
        {/* Meta Pixel */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${process.env.NEXT_PUBLIC_META_PIXEL_ID}');fbq('track','PageView');`,
              }}
            />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body min-h-screen">
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Suspense fallback={null}>
            <MetaPixelPageView />
          </Suspense>
        )}
        {children}
        {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"}'});
            `,
            }}
          />
        )}
      </body>
    </html>
  );
}
