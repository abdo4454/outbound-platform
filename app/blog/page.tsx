import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com";

export const metadata: Metadata = {
  title: "B2B SaaS Outbound Blog | Cold Email & Appointment Setting Playbooks",
  description:
    "Practical guides on cold email, B2B appointment setting, go-to-market outbound strategy, and LinkedIn outreach — written by practitioners who run these campaigns daily.",
  keywords: [
    "cold email playbook",
    "B2B appointment setting guide",
    "outbound sales strategy",
    "cold email reply rate",
    "LinkedIn outreach B2B",
    "go-to-market outbound",
    "email deliverability guide",
    "ICP research framework",
    "SDR outbound tactics",
    "B2B SaaS outbound blog",
  ],
  alternates: {
    canonical: `${APP_URL}/blog`,
  },
  openGraph: {
    title: "B2B SaaS Outbound Blog | Cold Email & Appointment Setting Playbooks",
    description:
      "Practical outbound playbooks for B2B SaaS founders and sales leaders. Cold email, LinkedIn outreach, ICP research, and appointment setting — from practitioners who do this daily.",
    url: `${APP_URL}/blog`,
    type: "website",
  },
};

const POSTS = [
  {
    slug: "cold-email-reply-rate",
    category: "Cold Email",
    title: "Why Your Cold Email Reply Rate Is Below 3% (And How to Fix It)",
    excerpt:
      "Most B2B SaaS cold email campaigns fail for 3 predictable reasons: weak ICP targeting, generic first lines, and broken deliverability. Here's how to fix all three.",
    readTime: "8 min read",
    date: "Mar 20, 2026",
  },
  {
    slug: "appointment-setting-saas",
    category: "Appointment Setting",
    title: "The Complete Guide to B2B Appointment Setting for SaaS Companies",
    excerpt:
      "Appointment setting is the most leveraged motion in B2B SaaS go-to-market. This guide covers ICP research, sequence strategy, objection handling, and booking tactics.",
    readTime: "12 min read",
    date: "Mar 14, 2026",
  },
  {
    slug: "icp-research-framework",
    category: "Go-to-Market",
    title: "The ICP Research Framework That Lifts Reply Rates by 4x",
    excerpt:
      "Vague ICPs kill outbound campaigns. This framework shows you how to define your ideal customer profile with signal-based precision — and how that changes everything about your messaging.",
    readTime: "10 min read",
    date: "Mar 7, 2026",
  },
  {
    slug: "cold-email-deliverability",
    category: "Deliverability",
    title: "Cold Email Deliverability in 2026: The Setup That Gets You to the Primary Tab",
    excerpt:
      "Domain warmup, DMARC, SPF, DKIM, sending limits, and inbox rotation — everything you need to achieve 95%+ inbox placement for your outbound sequences.",
    readTime: "9 min read",
    date: "Feb 28, 2026",
  },
  {
    slug: "linkedin-outreach-saas",
    category: "LinkedIn Outreach",
    title: "LinkedIn Outreach That Actually Books Meetings: A B2B SaaS Playbook",
    excerpt:
      "LinkedIn is oversaturated with generic connection requests. Here's the multi-touch approach — connection request, voice note, DM sequence — that gets a 15%+ acceptance-to-meeting rate.",
    readTime: "7 min read",
    date: "Feb 21, 2026",
  },
  {
    slug: "gtm-outbound-strategy",
    category: "Go-to-Market",
    title: "Building Your Go-to-Market Outbound Stack: Tools, Processes, and Team Structure",
    excerpt:
      "The tech stack, workflow, and team structure behind an outbound motion that generates 30–50 meetings per month consistently. From Apollo to Instantly to Slack alerting.",
    readTime: "11 min read",
    date: "Feb 14, 2026",
  },
];

const CATEGORIES = ["All", "Cold Email", "Appointment Setting", "Go-to-Market", "Deliverability", "LinkedIn Outreach"];

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "B2B SaaS Outbound Blog — Accelerated Growth",
  description: "Practical outbound playbooks for B2B SaaS founders and sales leaders.",
  url: `${APP_URL}/blog`,
  itemListElement: POSTS.map((post, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${APP_URL}/blog/${post.slug}`,
    name: post.title,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${APP_URL}/blog` },
  ],
};

export default function BlogPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-600/15 blur-[128px]" />
        </div>
        <div className="section relative z-10">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Outbound Knowledge Base
          </p>
          <h1 className="font-display text-display-sm sm:text-display-md text-white mb-4">
            B2B SaaS Outbound &amp;<br />
            <span className="text-gradient-dark">Cold Email Playbooks</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Practical guides on cold email, appointment setting, go-to-market strategy, and LinkedIn outreach — written by practitioners who do this daily.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-100 sticky top-[64px] lg:top-[80px] z-40">
        <div className="section">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === "All"
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 bg-white">
        <div className="section">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-1.5 bg-gradient-to-r from-brand-600 to-brand-400" />
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-brand">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h2 className="font-display font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-brand-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 group-hover:gap-2 transition-all"
                    >
                      Read <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="section text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">
            Want us to build this for you?
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Everything in this blog is what we do for clients daily. Book a free call and we&apos;ll show you exactly what it looks like for your SaaS.
          </p>
          <Link href="/book" className="btn-primary btn-lg inline-flex">
            Book a Free Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
