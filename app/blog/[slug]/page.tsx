import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://accelratedgrowth.com";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `${APP_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${APP_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.dateISO,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => post.relatedSlugs.includes(p.slug)).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.headline,
    description: post.metaDescription,
    author: { "@type": "Organization", name: "Accelrated Growth", url: APP_URL },
    publisher: {
      "@type": "Organization",
      name: "Accelrated Growth",
      url: APP_URL,
      logo: { "@type": "ImageObject", url: `${APP_URL}/logo-icon.svg` },
    },
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    url: `${APP_URL}/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${APP_URL}/blog/${post.slug}` },
    keywords: post.keywords.join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${APP_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${APP_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-14 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-brand-600/10 blur-[160px]" />
        </div>
        <div className="section max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Blog
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-brand-400 text-sm font-medium">{post.category}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
            {post.headline}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span>{post.date}</span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> {post.category}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="section">
          <div className="max-w-3xl mx-auto">
            {/* Intro excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed mb-12 pb-12 border-b border-gray-100">
              {post.excerpt}
            </p>

            {/* Sections */}
            <div className="space-y-14">
              {post.sections.map((section, i) => (
                <div key={i} className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-gray-900">
                    {section.heading}
                  </h2>

                  {section.body.map((para, j) => (
                    <p key={j} className="text-gray-600 leading-relaxed">
                      {para}
                    </p>
                  ))}

                  {section.callout && (
                    <div className={`rounded-xl px-6 py-5 border-l-4 ${
                      section.callout.type === "stat"
                        ? "bg-brand-50 border-brand-500"
                        : section.callout.type === "warning"
                        ? "bg-red-50 border-red-500"
                        : "bg-green-50 border-green-500"
                    }`}>
                      <p className={`text-sm font-semibold leading-relaxed ${
                        section.callout.type === "stat"
                          ? "text-brand-700"
                          : section.callout.type === "warning"
                          ? "text-red-700"
                          : "text-green-700"
                      }`}>
                        {section.callout.type === "stat" ? "📊 " : section.callout.type === "warning" ? "⚠️ " : "💡 "}
                        {section.callout.text}
                      </p>
                    </div>
                  )}

                  {section.bullets && (
                    <ul className="space-y-3 mt-2">
                      {section.bullets.map((bullet, k) => (
                        <li key={k} className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-brand-100 flex-shrink-0 mt-0.5 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          </span>
                          <span className="text-gray-600 leading-relaxed text-sm">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.template && (
                    <div className="bg-gray-950 rounded-xl p-6 overflow-x-auto">
                      <pre className="text-gray-300 text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-wrap">
                        {section.template}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 bg-midnight-950 rounded-2xl p-10 text-center">
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                {post.cta.heading}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">{post.cta.body}</p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors group"
              >
                Book a Free Strategy Call
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="section max-w-5xl mx-auto">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-8">Related Reading</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="badge-brand mb-3 inline-block">{rp.category}</span>
                  <h4 className="font-display font-bold text-gray-900 text-sm leading-snug group-hover:text-brand-600 transition-colors mb-2">
                    {rp.title}
                  </h4>
                  <span className="text-xs text-gray-400">{rp.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Breadcrumb nav */}
      <section className="py-6 bg-white border-t border-gray-100">
        <div className="section max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All posts
          </Link>
          <Link href="/book" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
            Book a strategy call <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
