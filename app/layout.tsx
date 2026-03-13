import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "OutboundPro — Outbound That Books Meetings",
    template: "%s | OutboundPro",
  },
  description:
    "We build and run your entire outbound engine. Cold email, LinkedIn, lead research — all done for you. You just show up to the meetings.",
  keywords: [
    "outbound marketing",
    "cold email agency",
    "lead generation",
    "SDR as a service",
    "B2B lead gen",
    "outbound sales",
    "meeting booking",
  ],
  authors: [{ name: "OutboundPro" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "OutboundPro",
    title: "OutboundPro — Outbound That Books Meetings",
    description:
      "We build and run your entire outbound engine. You just show up to the meetings.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OutboundPro — Outbound That Books Meetings",
    description:
      "We build and run your entire outbound engine. You just show up to the meetings.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
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
        </head>
        <body className="font-body min-h-screen">
          {children}

          {/* PostHog Analytics */}
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
    </ClerkProvider>
  );
}
