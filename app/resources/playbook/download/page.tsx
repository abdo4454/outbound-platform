"use client";

import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

const CHAPTERS = [
  {
    number: "01",
    title: "Defining Your ICP with Signal Precision",
    intro:
      "The single biggest driver of cold email performance is not your subject line or your copy — it is whether you are emailing the right people. A precise ICP is the foundation everything else is built on.",
    sections: [
      {
        heading: "Why broad ICPs kill reply rates",
        body: "Most outbound campaigns fail before the first email is written. When your ICP is defined as 'B2B SaaS companies with 10–500 employees,' you are describing half the internet. The email that works for a seed-stage DevTools company does not work for a Series B HR platform. Broad ICPs force generic copy, which drives reply rates to 1–2%. Narrow ICPs enable specific, resonant messaging that buyers actually respond to.",
      },
      {
        heading: "The core firmographic filters",
        body: "Start with the hard filters: industry vertical (be specific — not 'software' but 'project management software'), company size by headcount (pick a tight band like 25–150, not 10–500), annual revenue or ARR range, funding stage and recency, and geography. These define your addressable market and determine list size. If your filters return fewer than 500 companies, your ICP is too narrow. If they return more than 50,000, it is too broad.",
      },
      {
        heading: "Technographic signals",
        body: "The tools a company uses tells you what problems they are trying to solve. A company using Salesforce, Outreach, and ZoomInfo has an established sales motion and buys in that category. A company using spreadsheets and nothing else is pre-sales-stack. Technographic filters let you find companies at the exact maturity level your product fits. They also reveal whether a prospect is already paying a competitor — one of the strongest buying intent signals available.",
      },
      {
        heading: "Behavioral triggers (the highest-converting signals)",
        body: "Trigger-based targeting converts at 3–5× the rate of static list targeting because it identifies companies in motion. The most reliable triggers are: new funding announcement (company has budget and urgency), new VP or C-suite hire in your target function (new leader wants to make changes), headcount growth in the target department (scaling pain), and job postings for the role your product automates or improves. A company that just hired a VP of Sales and posted three SDR roles is a perfect outbound target if you sell sales tools.",
      },
      {
        heading: "ICP validation before you send a single email",
        body: "Before building a list, validate the ICP manually. Pull 20 companies that match your filters and check them by hand. Are these the right companies? Do the titles you are targeting actually hold buying authority? Are there live job postings or news stories that confirm the pain you plan to reference? If 15 of 20 feel like a good fit, the ICP is solid. If fewer than 10 do, the filters need tightening. This 30-minute exercise prevents wasted spend on a list that was never going to convert.",
      },
    ],
  },
  {
    number: "02",
    title: "Cold Email Infrastructure & Deliverability",
    intro:
      "You can write the best cold email in the world and it will never be read if it lands in spam. Infrastructure is the unglamorous foundation that determines whether your outbound even has a chance.",
    sections: [
      {
        heading: "Why you must use separate sending domains",
        body: "Never send cold outbound from your primary company domain. A deliverability incident — too many bounces, too many spam reports — will damage your primary domain's reputation and affect every email your business sends, including transactional emails to paying customers. Instead, buy two to four secondary domains that redirect to your main site. Common naming patterns: getcompanyname.com, companyname-hq.com, trycompanyname.com. Set up two to three inboxes per domain.",
      },
      {
        heading: "SPF, DKIM, and DMARC — the technical minimum",
        body: "SPF (Sender Policy Framework) tells receiving mail servers which IP addresses are authorized to send email on behalf of your domain. DKIM (DomainKeys Identified Mail) adds a cryptographic signature to every email you send, proving it has not been tampered with. DMARC (Domain-based Message Authentication) tells receiving servers what to do if SPF or DKIM fails. All three must be configured correctly before a single email is sent. Any reputable email sending tool will walk you through this setup, and most domain registrars have guides. Without these, major providers like Google and Microsoft will begin filtering your email to spam.",
      },
      {
        heading: "Inbox warmup: the timeline",
        body: "A brand new sending domain has zero reputation — Google and Microsoft do not know whether it is legitimate or spam. Warmup is the process of building that reputation by sending a gradually increasing volume of real emails that get opened and replied to. Week 1: 10 emails per inbox per day to seed accounts. Week 2: 20 per inbox. Week 3: 30 per inbox. Week 4 onward: begin real outreach at 30–40 per inbox per day. Warmup tools automate most of this by sending emails between a network of accounts that automatically open and reply to each other.",
      },
      {
        heading: "Sending volume limits and inbox rotation",
        body: "Even after warmup, keep sending volume conservative: 30–50 emails per inbox per day is the sustainable range for maintaining good deliverability. Above 50 per inbox per day, bounce rates and spam rates tend to increase. With multiple inboxes across multiple domains, you can scale to several thousand emails per month while keeping each individual inbox within safe limits. Rotate sending across inboxes rather than hammering one.",
      },
    ],
  },
  {
    number: "03",
    title: "Writing Cold Emails That Get Replies",
    intro:
      "Most cold emails fail because they are written from the sender's perspective, not the recipient's. The goal of a cold email is not to explain your product — it is to earn a reply from someone who was not expecting to hear from you.",
    sections: [
      {
        heading: "The anatomy of a high-converting cold email",
        body: "Keep it short. Cold emails that convert are typically 50–100 words in the body. A long email signals that the sender is compensating for weak relevance with volume of words. The structure: a specific, personalized opening that references something real about the prospect or their company; one sentence of what you do, framed as an outcome not a feature; one sentence of social proof or context (optional, keep it tight); a single, low-friction call to action. That is the entire email.",
      },
      {
        heading: "Subject lines that get opened",
        body: "The subject line's only job is to earn the open. It does not sell the product. High-performing subject line patterns: questions ('Your SDR hiring plan?'), forward-style lines ('Re: pipeline for Q3'), name or company references ('[Company] + [your company]'), and curiosity gaps ('One thing about your outbound'). Avoid subject lines that read like marketing: 'Boost your revenue by 10X' gets filtered or deleted. Keep subject lines under 7 words and test multiple variants from the start.",
      },
      {
        heading: "First-line personalization at scale",
        body: "The opening line of a cold email is what a recipient reads after the subject line to decide whether to continue. Generic openers ('Hope this finds you well', 'I came across your profile') are noise. Effective openers reference something specific: a recent funding round, a job posting, a podcast the prospect appeared on, a product launch, or a LinkedIn post they wrote. The goal is to demonstrate that this email was written for them, not copied from a template. At scale, this can be partially automated using data enrichment — but the specific detail must be real and accurate.",
      },
      {
        heading: "Sequence structure: how many touches and when",
        body: "A typical B2B cold email sequence runs 4–6 emails over 2–3 weeks. Email 1 (Day 1): the main pitch — specific, short, clear CTA. Email 2 (Day 3): a different angle or use case, shorter. Email 3 (Day 7): a resource, case study reference, or relevant insight — value, not pitch. Email 4 (Day 12): a breakup email — 'I will stop reaching out after this, but wanted to make sure this is not a fit before closing your file.' Breakup emails often generate the highest reply rates of any step in the sequence. If a prospect does not reply to 4–6 touches over 2–3 weeks, they are not interested right now. Remove them and recycle in 90 days.",
      },
      {
        heading: "The call to action: ask for less than you want",
        body: "The most common cold email mistake is asking for too much in the CTA. 'Would you be open to a 45-minute call this week to explore a potential partnership?' is a high-commitment ask from someone who does not know you. Instead, ask for the smallest reasonable next step: 'Is this something worth a 15-minute call?' or 'Would it make sense to connect?' Lower-friction CTAs consistently outperform higher-friction ones. You are not closing a deal in the first email — you are earning a conversation.",
      },
    ],
  },
  {
    number: "04",
    title: "Appointment Setting & Reply Management",
    intro:
      "A positive reply is not a booked meeting. What happens in the exchange between first reply and scheduled call determines how many of your replies become revenue pipeline.",
    sections: [
      {
        heading: "Qualifying a positive reply",
        body: "Not every positive reply is qualified. 'Sounds interesting, tell me more' is a soft signal that needs qualification before booking. Before scheduling, confirm: they have the budget authority or direct access to it, the problem you solve is active and real for them right now, and there is a genuine reason to talk in the next two to three weeks rather than 'some time in Q4.' A 15-minute qualification check prevents no-shows and wasted AE time.",
      },
      {
        heading: "Handling the 6 most common objections",
        body: "'We already have something for this' — reply: 'Completely understood. Out of curiosity, what are you using?' Understanding their current tool tells you whether there is a gap worth exploring. 'Not the right time' — reply: 'Makes sense. When would make more sense — end of quarter or early next?' 'Send me more info' — reply: 'Happy to. To make sure I send the right thing, what specifically would be most useful?' This requalifies without rejecting them. 'Not interested' — accept it and close the loop professionally. 'We do this in-house' — reply: 'Understood. What does that look like for you right now?' Learn before you pitch. 'Too expensive' — before they know the price, this usually means they do not see the value yet. Reframe around ROI.",
      },
      {
        heading: "Moving from reply to booked meeting in one exchange",
        body: "When a prospect signals interest, book the meeting in the next reply — do not create back-and-forth. The moment you have a positive reply, respond within 4 hours, confirm the relevant point they raised, and give them a direct scheduling link or two to three specific time slots. 'Great — I have Tuesday at 2pm ET or Wednesday at 10am ET open. Which works better, or feel free to grab a time here: [link].' Every additional exchange is an opportunity for the meeting to fall apart.",
      },
      {
        heading: "No-show prevention",
        body: "No-shows are expensive. Reduce them with: a confirmation email sent immediately after booking, a reminder the day before, and a reminder 30 minutes before the call. In each reminder, restate the specific thing you are going to cover — not a generic 'looking forward to our call' but 'Looking forward to walking through what an outbound motion for [their market] looks like and giving you a realistic meeting volume estimate.' Specificity makes the meeting feel valuable enough to keep.",
      },
    ],
  },
  {
    number: "05",
    title: "Optimization: Making the Machine Better Each Week",
    intro:
      "The difference between a campaign that delivers for two months and one that delivers for two years is a structured optimization process. Without it, performance degrades as contacts age and messaging goes stale.",
    sections: [
      {
        heading: "The metrics that actually matter",
        body: "Track four numbers: open rate (tells you if your subject line and domain reputation are working — target 40–60%), reply rate (your primary performance metric — target 8–15% for a well-targeted ICP), positive reply rate (what percentage of replies are interested, not unsubscribes or objections — target 30–50% of replies), and meeting booked rate (what percentage of total emails sent result in a meeting — this is the ultimate output metric). Ignore vanity metrics like 'emails delivered' or 'unique clicks' — they tell you nothing about performance.",
      },
      {
        heading: "Weekly optimization cadence",
        body: "Every week, review the performance of active sequences by step. Which steps have high open rates but low reply rates? (Subject line is working, body copy is not.) Which steps have low open rates? (Subject line or deliverability issue.) Which steps generate the most positive replies? (This is your control — test variations against it.) The weekly review should result in at least one concrete change: a new subject line variant, a rewritten opening line, a different CTA, or a removed step that is consistently underperforming.",
      },
      {
        heading: "A/B testing framework",
        body: "Test one variable at a time. The most impactful variables to test, in order: (1) subject line — even small changes can move open rates by 20–30%, (2) opening line — the first sentence after the subject is the second gate, (3) CTA phrasing — 'worth a call?' vs. '15 minutes?' can make a meaningful difference, (4) sequence length — does removing step 4 hurt or help?, (5) sending time — for most B2B buyers, Tuesday–Thursday 7–9am local time outperforms other windows. Each test needs at least 200 sends to produce statistically meaningful results.",
      },
      {
        heading: "When to rebuild a sequence vs. tweak it",
        body: "Tweak when reply rates are between 4–8% — the foundation is working but not optimized. Rebuild when reply rates are below 3% for more than 500 sends — the ICP, the messaging angle, or both are wrong and incremental changes will not fix it. When rebuilding, change the core premise of the email, not just the wording. A completely new angle — different pain point, different proof, different CTA format — is the only way to recover a fundamentally broken sequence.",
      },
    ],
  },
];

export default function PlaybookDownloadPage() {
  return (
    <>
      {/* Screen navigation — hidden on print */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/resources/playbook" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" />
          Download as PDF
        </button>
      </div>

      {/* Document */}
      <div className="max-w-3xl mx-auto px-6 py-12 print:py-6 print:px-0">
        {/* Cover */}
        <div className="mb-16 print:mb-12">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3 print:text-gray-600">
            Accelerated Growth · Free Resource
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            The B2B SaaS<br />Cold Email Playbook
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
            A practical guide to building a cold email outbound engine for B2B SaaS companies — from ICP definition to optimization. No fluff, no fake numbers.
          </p>
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-6 text-sm text-gray-400">
            <span>5 Chapters</span>
            <span>·</span>
            <span>acceleratedgrowth.com</span>
            <span>·</span>
            <span>Free to use and share</span>
          </div>
        </div>

        {/* Chapters */}
        {CHAPTERS.map((chapter) => (
          <div key={chapter.number} className="mb-16 print:mb-12 print:break-before-page">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-brand-600 font-bold text-sm">Chapter {chapter.number}</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              {chapter.title}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 pb-6 border-b border-gray-100">
              {chapter.intro}
            </p>

            <div className="space-y-8">
              {chapter.sections.map((section) => (
                <div key={section.heading}>
                  <h3 className="font-display font-bold text-gray-900 text-xl mb-3">
                    {section.heading}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center print:mt-8">
          <p className="text-gray-500 text-sm mb-1">
            Want us to build and run this for you?
          </p>
          <p className="text-gray-900 font-semibold">
            Book a free strategy call at{" "}
            <span className="text-brand-600">acceleratedgrowth.com/book</span>
          </p>
          <p className="text-gray-400 text-xs mt-4">
            © Accelerated Growth · acceleratedgrowth.com · Free to use and share
          </p>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { font-size: 11pt; color: #111; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
