import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Accelerated Growth — B2B SaaS Outbound Agency",
    short_name: "Accelerated Growth",
    description:
      "Done-for-you cold email, LinkedIn outreach, and appointment setting for B2B SaaS companies.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1e",
    theme_color: "#3366ff",
    icons: [
      {
        src: "/logo-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
