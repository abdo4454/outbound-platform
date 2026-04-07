"use client";

import { useEffect, useState } from "react";
import { hasAnalyticsConsent, hasMarketingConsent } from "@/lib/cookie-consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
    posthog: { init: (...args: unknown[]) => void };
  }
}

interface ConsentScriptsProps {
  gtmId?: string;
  metaPixelId?: string;
  posthogKey?: string;
  posthogHost?: string;
}

export function ConsentScripts({ gtmId, metaPixelId, posthogKey, posthogHost }: ConsentScriptsProps) {
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const [marketingLoaded, setMarketingLoaded] = useState(false);

  function loadAnalytics() {
    if (analyticsLoaded) return;

    // Google Tag Manager
    if (gtmId && !document.querySelector(`script[data-gtm="${gtmId}"]`)) {
      const script = document.createElement("script");
      script.setAttribute("data-gtm", gtmId);
      script.async = true;
      script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(script);
    }

    // PostHog
    if (posthogKey && !document.querySelector("script[data-posthog]")) {
      const script = document.createElement("script");
      script.setAttribute("data-posthog", "1");
      script.innerHTML = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${posthogKey}',{api_host:'${posthogHost || "https://us.i.posthog.com"}'})`;
      document.head.appendChild(script);
    }

    setAnalyticsLoaded(true);
  }

  function loadMarketing() {
    if (marketingLoaded) return;

    // Meta Pixel
    if (metaPixelId && !document.querySelector(`script[data-pixel="${metaPixelId}"]`)) {
      const script = document.createElement("script");
      script.setAttribute("data-pixel", metaPixelId);
      script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`;
      document.head.appendChild(script);
    }

    setMarketingLoaded(true);
  }

  useEffect(() => {
    // Load immediately if consent was already given
    if (hasAnalyticsConsent()) loadAnalytics();
    if (hasMarketingConsent()) loadMarketing();

    // Listen for consent being granted during this session
    function handleConsent(e: Event) {
      const level = (e as CustomEvent).detail;
      if (level === "all") {
        loadAnalytics();
        loadMarketing();
      }
    }

    window.addEventListener("consent-updated", handleConsent);
    return () => window.removeEventListener("consent-updated", handleConsent);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
