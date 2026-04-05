import { Rocket, Mail, Users, BarChart3, ArrowRight, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Mail,
    title: "Manage Sequences",
    description: "View and manage every email sequence, step-by-step. See which steps are performing and which need work.",
  },
  {
    icon: Users,
    title: "Prospect Inbox",
    description: "Handle all replies from one unified inbox. Mark leads as interested, not interested, or book them directly.",
  },
  {
    icon: BarChart3,
    title: "Campaign Analytics",
    description: "Drill into per-campaign performance. Opens, clicks, replies, bounces — all in one view.",
  },
  {
    icon: Zap,
    title: "Live Sending",
    description: "See your campaigns sending in real time. Monitor deliverability, warmup progress, and volume.",
  },
];

const instantlyUrl = process.env.NEXT_PUBLIC_INSTANTLY_URL;

export default function CampaignHubPage() {
  const isConfigured = !!instantlyUrl;

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl bg-midnight-950 p-8 sm:p-10">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 -right-16 w-64 h-64 rounded-full bg-brand-600/20 blur-[80px]" />
          <div className="absolute -bottom-8 left-1/4 w-48 h-48 rounded-full bg-brand-400/10 blur-[80px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white">Campaign Hub</h2>
              <p className="text-gray-400 text-sm">Your outreach command center</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-xl mb-8 leading-relaxed">
            This is where you manage the actual outbound — sequences, prospect inbox, replies,
            and live campaign performance. Powered by your agency&apos;s white-labeled outreach platform.
          </p>

          {isConfigured ? (
            <a
              href={instantlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors group"
            >
              Open Campaign Hub
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          ) : (
            <div className="inline-flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl px-6 py-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <p className="text-white font-semibold text-sm">Platform Being Configured</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Your account manager is setting up your Campaign Hub. You&apos;ll receive login credentials within 24 hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What's inside */}
      <div className="grid sm:grid-cols-2 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="card">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">{f.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See metrics in dashboard */}
      <div className="card border-dashed">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-700">Campaign data syncs to your dashboard</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Metrics from the Campaign Hub sync here every 15 minutes.{" "}
              <Link href="/dashboard" className="text-brand-600 hover:underline inline-flex items-center gap-0.5">
                View dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="card bg-gray-50 border-0">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Need help?</span>{" "}
          Contact your account manager at{" "}
          <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@accelratedgrowth.com"}`} className="text-brand-600 hover:underline">
            {process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@accelratedgrowth.com"}
          </a>{" "}
          or reply to any of our emails.
        </p>
      </div>
    </div>
  );
}
