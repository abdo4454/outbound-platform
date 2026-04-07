import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Work | Accelerated Growth",
  description:
    "The principles that define how Accelerated Growth operates — how we work with clients, how we hold ourselves accountable, and what we believe about building an outbound business.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://acceleratedgrowth.com"}/culture`,
  },
};

const PRINCIPLES = [
  {
    number: "1",
    headline: "We only do first-class work, and only in a first-class way.",
    body: [
      "Every campaign we run has our name on it. Every email that lands in a prospect's inbox represents our client's brand and our reputation. We do not cut corners on infrastructure, targeting, or copy — even when it would be faster or cheaper to do so. We would rather turn down an engagement than do work we are not proud of.",
      "This applies to how we treat everyone we interact with. Clients, prospects, and our own team are all treated with the same seriousness and respect. We show up to every call prepared. We deliver reports on time. We respond quickly — not eventually. We hold ourselves to a standard that the people we work with can feel, not just read about on a website.",
      "We take inspiration from the builders and operators who shaped what professional excellence looks like. First-class work does not mean the most expensive solution or the most elaborate process. It means doing the right thing, the right way, every time — without needing to be asked.",
    ],
  },
  {
    number: "2",
    headline: "We respect the founder's time, because it is the most valuable resource they have.",
    body: [
      "The people we work with are running companies. Every hour they spend managing their outbound motion is an hour they are not spending on product, customers, or their team. They came to us because they could not afford to build this themselves — and we take that seriously.",
      "We show up to every meeting prepared. We do not ask clients to repeat themselves. We do not ask for information we could have found ourselves. We move at the pace that founders need, not the pace that is comfortable for us. When we say we will deliver something by Friday, we deliver it by Friday.",
      "We also respect the founder's intelligence. We do not dress up mediocre results with optimistic language. We do not send a three-paragraph update when one sentence would do. We communicate clearly, honestly, and with enough substance that the person on the other end can actually make a decision.",
      "We never waste a meeting. Every touchpoint — strategy call, weekly sync, kickoff — should result in a clear decision, a new piece of information, or a specific next step. If we cannot articulate why a meeting matters before it happens, we should not be having it.",
    ],
  },
  {
    number: "3",
    headline: "Our word is our bond.",
    body: [
      "The meeting guarantee in every contract is not a marketing tactic. When we commit to a number, we work until we hit it — no caveats, no renegotiation, no blaming the market. We say what we will do and we do what we say.",
      "This applies to everything we commit to, not just the headline deliverable. If we tell a client we will have their sequence copy ready by Wednesday, it is ready by Wednesday. If we tell a prospect they will hear from us by end of week, they hear from us by end of week. Small commitments honored consistently build the kind of trust that does not need a contract to sustain it.",
      "We are also careful about what we commit to. We do not over-promise to win a deal. We do not make commitments we are not certain we can keep. The standard is not 'we tried' — the standard is delivery. When we make a commitment, everyone in the room knows it will happen.",
    ],
  },
  {
    number: "4",
    headline: "We tell the truth, especially when it is hard.",
    body: [
      "If a campaign is underperforming, we say so immediately — with the data and a clear explanation of why. If a client's ICP is wrong, we tell them before we send a single email. If the meeting target they requested is not realistic for their market, we say that in the strategy call, not in month three when the numbers prove it.",
      "The temptation in a service business is to soften bad news, buy time, or blame external factors. We resist that temptation. Delivering uncomfortable truth early is almost always less damaging than delivering comfortable silence until the damage is done. Our clients can only fix what they know is broken.",
      "Honesty also means we do not cherry-pick metrics. We report open rates, reply rates, positive reply rates, and meetings booked — all of them, every week — not just the numbers that look good. If the open rate is 50% and the reply rate is 2%, we say so and explain what it means.",
      "We do not tell the truth to make people feel bad. We tell the truth to make things better. There is a difference between honesty and bluntness for its own sake. We are direct. We are not cruel.",
    ],
  },
  {
    number: "5",
    headline: "We take a long view of every relationship.",
    body: [
      "We are not trying to close a client for three months and move on. We want to be the outbound partner that a company uses for years — through growth stages, through market pivots, through team changes. That requires making decisions that are right for the client's business, even when they are not optimal for our short-term revenue.",
      "This means we will tell a client when outbound is not the right motion for them right now. It means we will recommend reducing scope if their market is saturated. It means we will flag when a campaign is working well enough that they could eventually build this capability in-house — because a client who trusts us that much will come back, and will refer others.",
      "We do not take a transactional view of the people we work with. We invest in understanding their business, their market, and their goals beyond the immediate campaign. When we see an opportunity that is relevant to them — a trigger in their market, a change in a competitor's strategy, an insight from a similar campaign — we share it, whether or not there is a direct commercial reason to do so.",
      "In exchange, we expect our clients to treat us as partners. We work best with teams that communicate openly, give us real feedback, and engage with the process. A great outbound campaign is built collaboratively. We bring the infrastructure and expertise — we need our clients to bring the context and the trust.",
    ],
  },
  {
    number: "6",
    headline: "We win when our clients win. That is the only scoreboard.",
    body: [
      "The only metric that measures whether we did our job is qualified meetings in our clients' calendars. Not emails sent. Not open rates. Not reply rates — though those matter as diagnostics. The output is pipeline. Everything else is a means to that end.",
      "This means we never optimize for the metric that looks good on a report at the expense of the metric that matters. A 50% open rate with a 1% positive reply rate is a failure, regardless of how impressive the open rate sounds. We hold ourselves to the standard that our clients hold themselves to: revenue.",
      "It also means we take losses seriously. When a campaign underperforms, we treat it as a problem to solve, not a number to explain away. We run a post-mortem, identify what went wrong, rebuild what needs rebuilding, and come back with a better version. Losing a week of meetings because we iterated too slowly is not acceptable.",
      "We play to win. We are competitive — with ourselves, with the benchmarks, and with the best outbound operations in the industry. We go into every engagement expecting to deliver. We hold each other to that expectation and we do not lower the bar because a result was close enough.",
    ],
  },
];

export default function CulturePage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-midnight-950 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-[160px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-brand-400/5 blur-[160px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="section relative z-10 max-w-4xl">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-6">
            How We Work
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight mb-8">
            The principles that
            <br />
            define this company.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            These are not aspirations. They are the operating standards we hold ourselves to — in how we run campaigns, how we communicate with clients, and how we make decisions when the right answer is not obvious.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-white">
        {PRINCIPLES.map((principle, i) => (
          <div
            key={principle.number}
            className={`border-b border-gray-100 ${i % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}
          >
            <div className="section max-w-4xl mx-auto py-20">
              <div className="grid lg:grid-cols-[120px_1fr] gap-8 lg:gap-16 items-start">
                {/* Number */}
                <div className="flex-shrink-0">
                  <div className="text-8xl font-display font-bold text-gray-100 leading-none select-none">
                    {principle.number}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-8">
                    {principle.headline}
                  </h2>
                  <div className="space-y-5">
                    {principle.body.map((para, j) => (
                      <p key={j} className="text-gray-600 leading-relaxed text-lg">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Closing section */}
      <section className="py-24 bg-midnight-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-[160px]" />
        </div>
        <div className="section relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-6">
            Working Together
          </p>
          <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
            If this sounds like the standard
            <br />you hold yourself to, we should talk.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            We are selective about who we work with — not because we are turning away business, but because the partnerships that work best are the ones where both sides take the work seriously. If that is you, we want to meet you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-primary btn-lg">
              Book a Strategy Call <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/about" className="btn-ghost text-gray-400 hover:text-white btn-lg border border-white/10">
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
