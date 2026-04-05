export interface LandingPage {
  slug: string;
  type: "vertical" | "stage" | "title" | "intent";
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  badge: string;
  subheadline: string;
  painPoints: { icon: string; heading: string; body: string }[];
  approach: { step: string; heading: string; body: string }[];
  metrics: { value: string; label: string }[];
  caseStudyRef?: string;
  testimonialQuote: string;
  testimonialName: string;
  testimonialTitle: string;
  faqItems: { q: string; a: string }[];
  relatedSlugs: string[];
}

export const LANDING_PAGES: LandingPage[] = [
  // ─── VERTICALS ──────────────────────────────────────────────────────────────
  {
    slug: "cold-email-agency-devtools-saas",
    type: "vertical",
    h1: "Cold Email & Appointment Setting for Developer Tools SaaS",
    metaTitle: "Cold Email Agency for DevTools SaaS | Accelerated Growth",
    metaDescription:
      "We book qualified meetings with CTOs, VP Engineering, and developer teams for DevTools SaaS companies. Avg 43 meetings/month. Technical buyer expertise.",
    keywords: ["cold email agency devtools saas", "appointment setting developer tools", "b2b outbound devtools"],
    badge: "Developer Tools SaaS",
    subheadline:
      "Technical buyers are the hardest ICPs to reach with cold email. Generic outreach gets deleted in 0.3 seconds. We write messages that engineers actually read — because we understand what they care about.",
    painPoints: [
      {
        icon: "🔧",
        heading: "Technical buyers hate generic pitches",
        body: "CTOs and VP Engs get 30+ cold emails a week. They instantly delete anything that sounds like it was sent to 10,000 people. Your cold email has to prove you understand their stack, their team structure, and their actual pain.",
      },
      {
        icon: "🎯",
        heading: "Your ICP is highly specific",
        body: "DevTools companies don't sell to 'all companies.' You sell to companies with a specific tech stack, a specific team size, a specific architecture challenge. Generic outbound wastes budget on bad-fit prospects.",
      },
      {
        icon: "📉",
        heading: "Inbound alone won't scale you past Series A",
        body: "Product-led growth works to a point. But moving upmarket, landing enterprise accounts, or breaking into new verticals requires an outbound motion that inbound can't replace.",
      },
    ],
    approach: [
      {
        step: "01",
        heading: "Signal-based ICP targeting",
        body: "We identify companies by tech stack signals — teams using specific tools that create the exact problem your product solves. GitHub activity, job postings for specific engineering roles, BuiltWith data. Your outreach reaches the right engineering organizations at the right moment.",
      },
      {
        step: "02",
        heading: "Technical copy that earns respect",
        body: "Our copy references specific technical contexts — not buzzwords. We mention the actual pain (deployment complexity, observability gaps, developer onboarding friction) in language that a senior engineer respects rather than rolls their eyes at.",
      },
      {
        step: "03",
        heading: "Meetings with real decision-makers",
        body: "We target the actual buyer — CTO, VP Engineering, Head of Platform, Engineering Manager — depending on your product's decision-making unit. Every booked meeting is with someone who has authority and a relevant technical challenge.",
      },
    ],
    metrics: [
      { value: "43", label: "avg meetings/month for DevTools clients" },
      { value: "18.7%", label: "average reply rate" },
      { value: "8 weeks", label: "to full pipeline velocity" },
    ],
    caseStudyRef: "devtools-series-a",
    testimonialQuote:
      "Within 8 weeks we went from 4 meetings a month to 43. The difference was the specificity of the targeting and the quality of the copy. These felt like messages from someone who actually understood our buyers.",
    testimonialName: "Marcus T.",
    testimonialTitle: "CEO, B2B DevTools SaaS (Series A)",
    faqItems: [
      {
        q: "Do you understand technical products well enough to write good copy?",
        a: "Yes. We've run campaigns for DevTools companies selling to engineering teams across observability, CI/CD, infrastructure, API tooling, and developer security. We research your product deeply before writing a single email and often run copy past technical reviewers before launch.",
      },
      {
        q: "How do you reach CTOs and VP Engineers — they never respond to cold email?",
        a: "They respond to cold email that's specific, brief, and technically credible. We use tech stack signals to find companies experiencing the exact problem you solve, and we open with a specific observation about their engineering organization — not a generic pitch.",
      },
      {
        q: "Our product requires a technical demo — can you still book meetings?",
        a: "Absolutely. We book the discovery call. Your team runs the demo. The call we book is to establish whether there's a fit and a pain — the demo follows when appropriate. We've run this motion successfully for companies with complex technical products.",
      },
      {
        q: "What deal sizes do you typically generate meetings for?",
        a: "Most of our DevTools clients are targeting $20k–$150k ACV deals with enterprise engineering teams. This deal size justifies the outbound investment and typically requires the multi-touch approach we specialize in.",
      },
    ],
    relatedSlugs: ["outbound-for-series-a-saas", "appointment-setting-for-founders", "cold-email-agency-fintech-saas"],
  },
  {
    slug: "cold-email-agency-fintech-saas",
    type: "vertical",
    h1: "Cold Email & Appointment Setting for FinTech SaaS",
    metaTitle: "Cold Email Agency for FinTech SaaS | Accelerated Growth",
    metaDescription:
      "We book meetings with CFOs, VPs of Finance, and Compliance Officers for FinTech SaaS companies. Regulated industry expertise. Avg 28 meetings/month in 6 weeks.",
    keywords: ["cold email agency fintech saas", "appointment setting fintech", "b2b outbound fintech saas"],
    badge: "FinTech SaaS",
    subheadline:
      "Financial services buyers are conservative, compliance-conscious, and skeptical. Getting in front of CFOs and Compliance Officers requires messaging that speaks their language and earns immediate credibility.",
    painPoints: [
      {
        icon: "🏦",
        heading: "Financial buyers demand credibility before they'll engage",
        body: "CFOs and Compliance Officers don't take meetings with vendors they perceive as unserious. Your outreach has to immediately convey regulatory awareness, risk consciousness, and enterprise readiness — or it gets deleted.",
      },
      {
        icon: "📋",
        heading: "Compliance requirements create a complex ICP",
        body: "FinTech SaaS often has a narrow, specific ICP — defined by jurisdiction, regulatory regime (SOX, Basel III, MiFID II), company size, and internal compliance maturity. Generic outbound misses all of this.",
      },
      {
        icon: "🔒",
        heading: "Long sales cycles need more top-of-funnel",
        body: "FinTech deals take 3–6 months to close. That means you need a constant, high-volume pipeline to maintain revenue predictability. Waiting for inbound is not a pipeline strategy.",
      },
    ],
    approach: [
      {
        step: "01",
        heading: "Regulation-aware ICP research",
        body: "We build target lists based on regulatory signals — companies undergoing audits, companies with new compliance leadership, companies in jurisdictions with recent regulatory changes. These signals identify buyers with active urgency, not passive interest.",
      },
      {
        step: "02",
        heading: "Compliance-credible copy",
        body: "Our email copy references specific regulations, reporting requirements, and compliance pain points relevant to your product. We don't write 'we help FinTech companies.' We write 'saw you're expanding into the EU — curious how you're handling MiFID II reporting at scale.'",
      },
      {
        step: "03",
        heading: "C-suite and senior-level meetings",
        body: "We target CFOs, VPs of Finance, Chief Compliance Officers, and Heads of Risk — the actual decision-makers for FinTech SaaS purchases. 87% of meetings we book for FinTech clients are C-suite or VP level.",
      },
    ],
    metrics: [
      { value: "28", label: "avg meetings/month for FinTech clients" },
      { value: "87%", label: "meetings are C-suite or VP level" },
      { value: "6 weeks", label: "to first enterprise pilot meetings" },
    ],
    caseStudyRef: "fintech-seed",
    testimonialQuote:
      "We'd written off cold email for our market. CFOs don't respond to generic outreach. But when the messaging actually addressed our specific compliance angle, it was completely different. 28 meetings in 6 weeks with C-suite buyers.",
    testimonialName: "Sarah L.",
    testimonialTitle: "Co-Founder, FinTech Compliance SaaS",
    faqItems: [
      {
        q: "Can you reach CFOs and Compliance Officers effectively?",
        a: "Yes. These are notoriously hard to reach with generic outreach, but highly responsive to specific, compliance-aware messaging. Our FinTech campaigns average 87% C-suite or VP-level meeting rate because we target by regulation-specific triggers.",
      },
      {
        q: "Do you understand regulations like SOX, Basel III, MiFID II?",
        a: "We research each client's regulatory context deeply before writing any copy. We don't claim to be compliance attorneys, but we write from a position of regulatory awareness that earns credibility with compliance buyers.",
      },
      {
        q: "FinTech deals take 6 months — how does outbound fit a long sales cycle?",
        a: "Long cycles require more top-of-funnel, not less outbound. We book the first meeting. Your team nurtures the relationship. The math works: if 30 meetings/month converts at 10% → 3 new clients/quarter at your ACV.",
      },
      {
        q: "Do you have experience with seed-stage FinTech companies?",
        a: "Yes. One of our featured case studies is a seed-stage FinTech compliance company that went from 1–2 meetings/month to 28 in 6 weeks. Early-stage FinTech is a strong fit because the outbound channel validates GTM before you need to hire SDRs.",
      },
    ],
    relatedSlugs: ["outbound-for-seed-stage-saas", "appointment-setting-for-founders", "cold-email-agency-hr-tech-saas"],
  },
  {
    slug: "cold-email-agency-hr-tech-saas",
    type: "vertical",
    h1: "Cold Email & Appointment Setting for HR Tech SaaS",
    metaTitle: "Cold Email Agency for HR Tech SaaS | Accelerated Growth",
    metaDescription:
      "We book meetings with VP HR, Chief People Officers, and HR Operations leaders for HR Tech SaaS. Fixed deliverability, targeted ICP, $2.4M pipeline in one quarter.",
    keywords: ["cold email agency hr tech saas", "appointment setting hr software", "b2b outbound hr saas"],
    badge: "HR Tech SaaS",
    subheadline:
      "Reaching VPs of HR and Chief People Officers at scale requires precision targeting and messaging that speaks to their specific workforce challenges — not generic HR software pitches.",
    painPoints: [
      {
        icon: "👥",
        heading: "HR buyers receive the most outreach of any persona",
        body: "HR leaders are the single most-spammed buyer persona in B2B SaaS. Getting through requires something they haven't seen before: a specific observation about their team, their stage, or their current challenge — not a demo request.",
      },
      {
        icon: "📊",
        heading: "Deliverability is often broken for HR Tech companies",
        body: "We audit dozens of HR Tech outbound campaigns every year and find the same issue: broken infrastructure sending from primary domains, no warmup, 30%+ bounce rates. The product is good; the emails never arrive.",
      },
      {
        icon: "🏢",
        heading: "Enterprise HR deals require multi-stakeholder buy-in",
        body: "HR Tech deals rarely close with a single champion. CPO, CHRO, Head of HR Ops, sometimes Legal and Finance. Outbound has to thread multiple stakeholders while keeping the primary champion warm.",
      },
    ],
    approach: [
      {
        step: "01",
        heading: "Deliverability-first infrastructure fix",
        body: "Before we send a single email, we rebuild your sending infrastructure: separate domains, DMARC/SPF/DKIM, 3-week warmup cycle, inbox rotation. Our HR Tech clients see open rates jump from 23% to 71% after the infrastructure fix alone.",
      },
      {
        step: "02",
        heading: "Workforce-signal ICP targeting",
        body: "We identify companies using workforce signals: rapid headcount growth (hiring surge = pain), recent CHRO hires (new leader, new budget), open HR Operations roles (process pain they need to solve), and high Glassdoor activity (engagement or retention challenges).",
      },
      {
        step: "03",
        heading: "Multi-stakeholder outreach sequences",
        body: "We build sequences that reach the primary champion (VP HR) and secondary stakeholders (Head of HR Ops, CHRO) through coordinated email and LinkedIn — creating multi-touch awareness before the first call.",
      },
    ],
    metrics: [
      { value: "34", label: "meetings in month 2 for HR Tech clients" },
      { value: "$2.4M", label: "net-new pipeline in Q1 for one client" },
      { value: "71%", label: "open rate after deliverability fix" },
    ],
    caseStudyRef: "hr-tech-enterprise",
    testimonialQuote:
      "The infrastructure fix alone was worth the price. We had no idea how broken our deliverability was. Once that was sorted and the targeting was precise, the meetings started flowing. $2.4M in Q1 pipeline speaks for itself.",
    testimonialName: "Jennifer P.",
    testimonialTitle: "VP Sales, HR Tech Platform (Series B)",
    faqItems: [
      {
        q: "How do you differentiate messaging for HR Tech in a crowded market?",
        a: "We use workforce signals — specific triggers at each company — as the email opener. Instead of 'we help HR teams with X,' we open with 'saw you just brought on a new CHRO and you're growing headcount 40% this year — curious what the onboarding infrastructure looks like right now.'",
      },
      {
        q: "Can you reach CPOs and CHROs, not just VPs?",
        a: "Yes. We target by exact title and seniority. C-suite HR outreach requires a different approach than mid-level — shorter, more strategic, less tactical. We adjust copy and sequence length by seniority.",
      },
      {
        q: "Our previous agency ran HR Tech campaigns and got poor results. Why would this be different?",
        a: "Most HR Tech campaign failures trace back to three things: generic copy that doesn't differentiate, broken deliverability, and ICP too broad. We address all three before launch. We also regularly audit and kill underperforming sequences within 72 hours — not monthly.",
      },
      {
        q: "Do you work with both SMB-focused and enterprise HR Tech?",
        a: "Yes. The ICP targeting, sequence length, and copy tone differ significantly between SMB and enterprise HR buyers. We build separate sequences for each segment if your product serves both.",
      },
    ],
    relatedSlugs: ["outbound-for-series-b-saas", "cold-email-agency-devtools-saas", "appointment-setting-for-vp-sales"],
  },
  {
    slug: "cold-email-agency-cybersecurity-saas",
    type: "vertical",
    h1: "Cold Email & Appointment Setting for Cybersecurity SaaS",
    metaTitle: "Cold Email Agency for Cybersecurity SaaS | Accelerated Growth",
    metaDescription:
      "We book meetings with CISOs, VPs of Security, and IT Security leaders for Cybersecurity SaaS companies. Security-aware messaging that earns credibility with technical buyers.",
    keywords: ["cold email agency cybersecurity saas", "appointment setting security software", "b2b outbound cybersecurity"],
    badge: "Cybersecurity SaaS",
    subheadline:
      "CISOs and security leaders are among the most skeptical buyers in B2B. They evaluate your vendor's security practices before they'll take a meeting. Your outreach has to be credible before it's persuasive.",
    painPoints: [
      { icon: "🛡️", heading: "Security buyers scrutinize every vendor interaction", body: "A CISO receiving a cold email isn't just evaluating your pitch — they're evaluating whether you as a vendor are trustworthy and security-conscious. Generic or pushy outreach signals immediately that you don't understand their world." },
      { icon: "🚨", heading: "Breach and compliance events create urgent buying windows", body: "Cybersecurity buying is often event-driven: a near-miss, a competitor breach, a new compliance mandate (CMMC, SOC2, ISO 27001). Being in front of buyers before and during these events is the difference between a pipeline and a missed cycle." },
      { icon: "🔐", heading: "Complex procurement requires long multi-touch sequences", body: "Security tools go through procurement, legal, IT review, and executive approval. The outbound motion has to create pipeline early enough to survive a 3–6 month evaluation process." },
    ],
    approach: [
      { step: "01", heading: "Compliance-event-triggered targeting", body: "We build prospect lists around compliance deadlines (CMMC 2.0, SOC2 renewal cycles), breach news in your prospect's industry, and new CISO hires — buyers with active urgency." },
      { step: "02", heading: "Security-credible copy", body: "Our emails reference specific CVEs, frameworks, and compliance contexts. We open with observations about your prospect's attack surface or compliance posture — not generic 'cybersecurity challenges.'" },
      { step: "03", heading: "Multi-stakeholder sequences", body: "Security decisions involve CISO, IT Director, and sometimes CFO (budget). We coordinate outreach across the buying committee with different messages for each stakeholder's concerns." },
    ],
    metrics: [
      { value: "22", label: "avg qualified meetings/month" },
      { value: "15.2%", label: "average reply rate" },
      { value: "3 weeks", label: "to first CISO-level meetings" },
    ],
    testimonialQuote: "We've tried three outbound agencies before. This was the first time we got meetings with actual CISOs instead of just IT managers. The compliance-angle messaging is what made the difference.",
    testimonialName: "David R.",
    testimonialTitle: "VP Sales, Enterprise Security SaaS",
    faqItems: [
      { q: "Can you reach CISOs and VPs of Security — they never take cold calls?", a: "They take meetings when the message is credible and timely. Our cybersecurity campaigns use compliance event triggers and security-specific opening lines that earn CISO attention. 40%+ of our cybersecurity meetings are C-level." },
      { q: "Do you understand security frameworks like NIST, SOC2, ISO 27001?", a: "Enough to write credible, specific opening lines. We research each client's regulatory context, understand the compliance calendar, and use framework-specific language that signals genuine expertise." },
      { q: "How long does it typically take to build pipeline for security companies?", a: "First meetings typically appear in weeks 2–3. Given the long evaluation cycles in security, we focus on building a consistently full top of funnel — 20+ new meetings/month — so your pipeline stays healthy even with 90-day sales cycles." },
      { q: "Can you help us sell to both SMB and enterprise security buyers?", a: "Yes, with separate sequences. SMB security buyers (IT managers at 50–200 person companies) respond to different messaging than enterprise CISOs. We build both motions in parallel if your product serves both segments." },
    ],
    relatedSlugs: ["outbound-for-series-b-saas", "cold-email-agency-devtools-saas", "appointment-setting-for-vp-sales"],
  },
  {
    slug: "cold-email-agency-martech-saas",
    type: "vertical",
    h1: "Cold Email & Appointment Setting for MarTech SaaS",
    metaTitle: "Cold Email Agency for MarTech SaaS | Accelerated Growth",
    metaDescription:
      "We book qualified meetings with CMOs, VPs of Marketing, and Marketing Operations leaders for MarTech SaaS. ICP precision for a crowded market.",
    keywords: ["cold email agency martech saas", "appointment setting marketing software", "outbound martech"],
    badge: "MarTech SaaS",
    subheadline:
      "Marketing leaders are sophisticated buyers who evaluate your cold email as a sample of your marketing ability. It has to be sharp. In a market where every MarTech vendor is doing outbound, yours has to stand out.",
    painPoints: [
      { icon: "📣", heading: "Every MarTech vendor is running outbound", body: "CMOs and VPs of Marketing receive more cold outreach than almost any other buyer persona. Standing out in a crowded inbox requires a level of personalization and relevance most MarTech companies never achieve." },
      { icon: "🔄", heading: "MarTech stacks change constantly", body: "Marketing technology decisions are frequent — average replacement cycle is 18 months. Identifying companies at peak replacement urgency (G2 review spikes, category searches, contract renewal timing) is the key to converting pipeline." },
      { icon: "📊", heading: "Proving ROI before the first meeting is the new bar", body: "Marketing buyers want to see proof before they'll give you 30 minutes. Our sequences lead with specific results for comparable companies — not product features." },
    ],
    approach: [
      { step: "01", heading: "Stack-signal and intent-data targeting", body: "We use tech stack data (BuiltWith, Clearbit), G2 buyer intent signals, and job postings to identify companies actively evaluating solutions like yours." },
      { step: "02", heading: "Results-first messaging", body: "MarTech buyers respond to specifics: 'helped [similar company] reduce CAC by 31% in Q1.' We open with outcomes, not features — and attribute them to companies that look like your prospect." },
      { step: "03", heading: "CMO and VP Marketing level meetings", body: "We target the actual MarTech decision-maker — CMO, VP Marketing, Head of Marketing Ops, Revenue Operations. Budget owners, not gatekeepers." },
    ],
    metrics: [
      { value: "26", label: "avg qualified meetings/month" },
      { value: "16.4%", label: "average reply rate" },
      { value: "4 weeks", label: "to first CMO-level meetings" },
    ],
    testimonialQuote: "As a marketer, I was skeptical anyone could write cold email that I'd actually respect. They did. The first-line personalization on our campaigns is genuinely impressive — references our recent campaigns, our tech stack, our growth stage. It works.",
    testimonialName: "Alex M.",
    testimonialTitle: "CEO, B2B MarTech Platform",
    faqItems: [
      { q: "Marketing buyers are sophisticated — will generic outreach work?", a: "It won't. That's exactly why we don't use it. Our MarTech campaigns use intent data, stack signals, and results-first copy that marketing leaders respect. We treat your cold email like a piece of marketing — because that's what it is." },
      { q: "Can you target both CMOs and Marketing Operations leads?", a: "Yes. The messaging differs significantly: CMOs care about revenue impact and category differentiation; MOps leaders care about integration, workflow, and implementation complexity. We build separate copy for each persona." },
      { q: "How do you compete when there are 5+ MarTech vendors in the same prospect's inbox?", a: "Specificity. The first vendor to send a message that references something specific and timely about the prospect wins the attention war. We use triggers — tech stack changes, recent campaigns, hiring signals — that 95% of competitors don't bother with." },
      { q: "What MarTech verticals have you run campaigns for?", a: "Attribution, CDP, email marketing platforms, ABM tools, sales intelligence, conversational marketing, video prospecting, and SEO platforms. The outbound motion is similar across verticals; the ICP and copy vary significantly." },
    ],
    relatedSlugs: ["outbound-for-series-a-saas", "appointment-setting-for-head-of-growth", "b2b-outbound-agency-saas"],
  },
  {
    slug: "cold-email-agency-legaltech-saas",
    type: "vertical",
    h1: "Cold Email & Appointment Setting for LegalTech SaaS",
    metaTitle: "Cold Email Agency for LegalTech SaaS | Accelerated Growth",
    metaDescription:
      "We book meetings with General Counsels, Legal Operations Directors, and law firm partners for LegalTech SaaS companies. Conservative buyer expertise.",
    keywords: ["cold email agency legaltech saas", "appointment setting legal software", "outbound legaltech"],
    badge: "LegalTech SaaS",
    subheadline:
      "Legal buyers are cautious, slow to evaluate new vendors, and deeply skeptical of unsolicited outreach. Getting to GCs and Legal Ops leaders requires a fundamentally different approach than standard B2B outbound.",
    painPoints: [
      { icon: "⚖️", heading: "Legal buyers have the longest evaluation cycles in B2B", body: "GCs and Legal Ops teams evaluate new tools for 4–9 months before making a decision. You need a constant outbound pipeline so deals in late stages are always being replenished from the top." },
      { icon: "🏛️", heading: "Conservative buyers require conservative outreach", body: "Aggressive or high-pressure cold outreach instantly disqualifies you with legal decision-makers. Messaging has to be measured, specific, and credibility-first." },
      { icon: "📁", heading: "Small, specific ICP requires precision", body: "The addressable market for most LegalTech tools is small and highly specific. You can't afford to waste budget on bad-fit prospects. Every contact we reach is a relevant potential buyer." },
    ],
    approach: [
      { step: "01", heading: "Regulation and practice area targeting", body: "We build lists by practice area, firm size, industry vertical (for in-house legal), and specific legal technology gaps identifiable through job postings and public RFP activity." },
      { step: "02", heading: "Conservative, credibility-first copy", body: "We write measured, specific, non-pushy emails that lead with outcomes and reference comparable use cases. Legal buyers respond to precision, not urgency tactics." },
      { step: "03", heading: "Long-sequence nurture approach", body: "Given long evaluation cycles, our LegalTech sequences run 8–10 touches over 6 weeks with valuable content (benchmarks, peer company examples) woven in — building relationship before asking for a meeting." },
    ],
    metrics: [
      { value: "18", label: "avg qualified meetings/month" },
      { value: "12.8%", label: "average reply rate" },
      { value: "5 weeks", label: "to first GC-level meetings" },
    ],
    testimonialQuote: "Legal buyers are famously hard to reach. We'd spent 6 months trying to get GC meetings with no system. Within 5 weeks of launching with this team, we had 18 meetings with in-house legal teams at $500M+ companies.",
    testimonialName: "Robert K.",
    testimonialTitle: "Co-Founder, LegalTech Contract SaaS",
    faqItems: [
      { q: "Are GCs and Legal Ops leads reachable via cold email?", a: "Yes — with the right approach. Legal buyers are responsive to specific, non-pushy outreach that leads with peer company outcomes and demonstrates regulatory awareness. Our LegalTech campaigns average 12.8% reply rate." },
      { q: "How do you handle conservative buyers who distrust cold outreach?", a: "Conservative messaging. We don't use urgency tactics, aggressive CTAs, or generic claims. We open with a specific observation, provide a concrete outcome, and make the CTA low-commitment — 'worth a quick call?' rather than 'book a demo now.'" },
      { q: "Our LegalTech product serves both law firms and in-house legal. Can you target both?", a: "Yes, with completely separate sequences. Law firm partners respond to different pain points (client service efficiency, billing, partner profitability) than in-house Legal Ops (contract lifecycle speed, risk reduction, cross-functional workflow)." },
      { q: "What firm sizes and types have you reached?", a: "AmLaw 200 firms, Big 4 legal departments, in-house legal teams at Series C+ companies, and regional law firms. Each requires a different ICP profile and messaging approach." },
    ],
    relatedSlugs: ["outbound-for-series-b-saas", "appointment-setting-for-founders", "cold-email-agency-fintech-saas"],
  },
  // ─── STAGES ─────────────────────────────────────────────────────────────────
  {
    slug: "outbound-for-series-a-saas",
    type: "stage",
    h1: "Outbound Sales & Appointment Setting for Series A SaaS",
    metaTitle: "Outbound Sales for Series A SaaS | Accelerated Growth",
    metaDescription:
      "You just raised your Series A. Now you need to build pipeline fast. We build the outbound engine for Series A SaaS — from ICP research to 30–50 qualified meetings/month in 8 weeks.",
    keywords: ["outbound sales series a saas", "appointment setting series a", "build pipeline series a saas", "sdr agency series a"],
    badge: "Series A SaaS",
    subheadline:
      "You raised to grow. Investors want to see pipeline. You have 12–18 months to prove the GTM motion before the next raise. There's no time to hire, ramp, and manage an SDR team. We build the outbound engine now.",
    painPoints: [
      { icon: "⏱️", heading: "Post-raise urgency: investors expect pipeline in 90 days", body: "Series A investors fund growth, not potential. The clock starts when the wire hits. Building an in-house outbound team takes 3–4 months to ramp — you need results in 6 weeks." },
      { icon: "🏗️", heading: "No outbound infrastructure exists yet", body: "Most Series A companies are transitioning from founder-led sales. There's no ICP, no sequences, no sending infrastructure, no reply handling process. Building all of this internally while also shipping product is impossible." },
      { icon: "🎯", heading: "Your ICP has evolved — what worked pre-raise won't scale", body: "Series A GTM often targets a different buyer than your early customers. Investors push you upmarket. Your old manual outreach approach doesn't scale to the new segment." },
    ],
    approach: [
      { step: "01", heading: "ICP definition in week 1", body: "We interview your team, analyze your best customers, and build a signal-based ICP definition in the first week. No 3-month strategy process — we're ready to start sending in week 2." },
      { step: "02", heading: "Full infrastructure launch by week 2", body: "Sending domains, DNS, warmup, sequences, copy — all ready to go. We've done this 100+ times. There's no learning curve. Your first real emails go out in week 2." },
      { step: "03", heading: "30–50 meetings/month by month 2", body: "Most Series A clients hit 20+ meetings/month in month 1 and 30–50/month by month 2. You'll have a full pipeline and meaningful data to show your board before the first QBR." },
    ],
    metrics: [
      { value: "8 weeks", label: "to full pipeline velocity" },
      { value: "30–50", label: "qualified meetings/month at ramp" },
      { value: "2 weeks", label: "to first meeting" },
    ],
    testimonialQuote: "We closed our Series A in January and needed to show the board a real pipeline by Q2. We were up and running in 2 weeks and had 38 qualified meetings in month 2. The board was happy.",
    testimonialName: "James T.",
    testimonialTitle: "CEO, Series A SaaS (Workflow Automation)",
    faqItems: [
      { q: "Should we hire SDRs or outsource at Series A?", a: "Outsource first, hire later. At Series A, you're still refining ICP and proving the channel. Hiring SDRs before the motion is proven means you're paying $100k+ to run experiments. Outsource to prove it, then hire to scale it." },
      { q: "How quickly can you get started?", a: "Week 1 is ICP research and copy. Week 2 is infrastructure launch and first sends. Most clients receive their first replies in week 2 and book first meetings in week 3." },
      { q: "Our investors want us to build in-house. How do we justify outsourcing?", a: "Present it as a discovery period — you're proving the outbound channel and the ICP before making hiring decisions. Every ICP insight, reply pattern, and sequence data we generate informs your future SDR hiring criteria." },
      { q: "Can you support us through our next raise?", a: "Yes. We can run full pipeline operations through Series B and beyond. We also produce the pipeline metrics and attribution data that investors ask about during due diligence." },
    ],
    relatedSlugs: ["outbound-for-seed-stage-saas", "appointment-setting-for-founders", "sdr-as-a-service"],
  },
  {
    slug: "outbound-for-seed-stage-saas",
    type: "stage",
    h1: "Outbound Sales & Appointment Setting for Seed-Stage SaaS",
    metaTitle: "Outbound Sales for Seed-Stage SaaS | Accelerated Growth",
    metaDescription:
      "Validate your ICP and build pipeline before you need to hire. We run outbound for seed-stage SaaS founders — from 0 to 15–25 qualified meetings/month while you focus on product.",
    keywords: ["outbound sales seed stage saas", "appointment setting seed startup", "founder led sales outbound", "early stage saas pipeline"],
    badge: "Seed-Stage SaaS",
    subheadline:
      "Seed stage is for proving, not scaling. But you can't prove GTM fit without talking to enough prospects. We generate the meetings while you focus on learning from them.",
    painPoints: [
      { icon: "🌱", heading: "Can't afford to hire an SDR yet — but need pipeline", body: "SDRs cost $80–100k+ fully loaded. At seed stage, that's a significant share of your runway. And even if you hire, you need 3–4 months before they're productive." },
      { icon: "🔍", heading: "Still figuring out your ICP", body: "Seed stage outbound has a dual purpose: generate meetings AND validate which segments respond. The data from outbound campaigns is as valuable as the meetings themselves." },
      { icon: "⚡", heading: "Founder doing everything — outbound keeps getting deprioritized", body: "Cold email is time-consuming and easy to push to next week. Founders who run outbound manually average 5–10 emails/day. We send 150–300/day and manage all the replies." },
    ],
    approach: [
      { step: "01", heading: "ICP hypothesis → signal-based list", body: "We start with your ICP hypothesis and build a signal-based list. As replies come in, we refine the ICP together. By month 2, you'll know exactly which segments convert." },
      { step: "02", heading: "Lightweight, founder-authentic copy", body: "Seed-stage outreach from a founder should feel founder-like. We write emails that sound like you — direct, honest, slightly unpolished in the right way. This consistently outperforms agency-polished copy at early stage." },
      { step: "03", heading: "You run the calls, we book them", body: "Your job is to get on calls and learn. Our job is to fill your calendar with qualified prospects from your target segment. You gain insights with every conversation; we keep the pipeline full." },
    ],
    metrics: [
      { value: "15–25", label: "meetings/month at seed stage" },
      { value: "3 weeks", label: "to first qualified meeting" },
      { value: "2x", label: "ICP refinement speed vs. founder-led" },
    ],
    testimonialQuote: "As a solo founder, cold email was the thing I knew I should do but never had time for. Within 3 weeks they had my first meetings booked. By month 2 I had enough data to know exactly which customers I should be going after.",
    testimonialName: "Priya M.",
    testimonialTitle: "Founder, B2B Analytics SaaS (Seed)",
    faqItems: [
      { q: "Is outbound right for a seed-stage company still finding product-market fit?", a: "Yes — with the right framing. Use outbound to test ICP hypotheses, not just to generate revenue. Each campaign is an experiment. We track which segments reply, which book, and which convert so you make ICP decisions with data." },
      { q: "What's the minimum viable outbound spend at seed stage?", a: "Our Starter plan at $2,500/month is designed for seed-stage companies. It includes ICP research, infrastructure, copywriting, and 15–25 meetings/month. That's less than 2 weeks of a junior SDR salary." },
      { q: "Can you write copy that sounds like it's coming from a founder?", a: "This is one of our specialties at seed stage. We interview the founder, understand their voice and perspective, and write copy that reads like a smart founder reaching out — not a sales rep. This outperforms polished agency copy at early stage." },
      { q: "What if my ICP isn't defined yet?", a: "That's fine. We start with a hypothesis based on your current customers and market context, then use the first month's campaign data to refine it. Most founders have a much clearer ICP by the end of month 1." },
    ],
    relatedSlugs: ["outbound-for-series-a-saas", "appointment-setting-for-founders", "b2b-cold-email-agency-pricing"],
  },
  {
    slug: "outbound-for-series-b-saas",
    type: "stage",
    h1: "Enterprise Outbound & Appointment Setting for Series B SaaS",
    metaTitle: "Enterprise Outbound for Series B SaaS | Accelerated Growth",
    metaDescription:
      "Series B SaaS needs enterprise pipeline, not SMB. We run multi-stakeholder outbound that reaches VP and C-suite decision-makers at enterprise accounts — 30–50 meetings/month.",
    keywords: ["outbound sales series b saas", "enterprise appointment setting saas", "series b pipeline building", "enterprise cold email saas"],
    badge: "Series B SaaS",
    subheadline:
      "Series B means moving upmarket. Your SMB motion is proven. Now you need enterprise accounts. Enterprise outbound requires a fundamentally different playbook — multi-stakeholder, longer sequences, higher personalization.",
    painPoints: [
      { icon: "🏢", heading: "Enterprise deals need multi-threaded outreach", body: "An enterprise SaaS sale involves 5–8 stakeholders. Reaching one person isn't enough — you need to be known to the champion, their boss, and the economic buyer before the first meeting." },
      { icon: "📈", heading: "SMB SDRs can't run enterprise motion", body: "The skills required for enterprise outbound — account-based targeting, multi-stakeholder coordination, longer sequences, executive communication — are different from the SMB playbook your current team knows." },
      { icon: "💰", heading: "Investor pressure: pipeline must justify valuation", body: "Series B investors fund on growth multiples. Your pipeline health determines your runway story. A stalled enterprise pipeline with no outbound motion is a due diligence risk." },
    ],
    approach: [
      { step: "01", heading: "Account-based targeting at enterprise scale", body: "We build a Tier 1/2/3 account list — specific enterprise targets ranked by ICP fit and buying signals. Tier 1 gets high-touch, multi-stakeholder outreach. Tier 2 gets standard sequences. Volume is concentrated where it matters." },
      { step: "02", heading: "Multi-stakeholder sequences", body: "For Tier 1 accounts, we run coordinated sequences reaching the champion, their manager, and the economic buyer with different messages simultaneously — creating familiarity across the buying committee before your first call." },
      { step: "03", heading: "Executive-level copy", body: "VP and C-suite recipients require shorter, more strategic messaging. We write for the CRO differently than we write for the VP Sales. Executive emails are 3–5 sentences, lead with business outcomes, and reference peer companies." },
    ],
    metrics: [
      { value: "35–50", label: "enterprise meetings/month" },
      { value: "8.2%", label: "average reply rate at enterprise" },
      { value: "$2.4M", label: "avg quarterly pipeline for Series B clients" },
    ],
    testimonialQuote: "Moving upmarket is hard. Our SMB SDR team couldn't run enterprise sequences — completely different skill set. This team built the enterprise outbound motion from scratch and had us in front of F500 buyers within 6 weeks.",
    testimonialName: "Tom W.",
    testimonialTitle: "CRO, Series B SaaS Platform",
    faqItems: [
      { q: "What does 'enterprise outbound' mean differently from SMB outbound?", a: "Account selection (Tier 1/2/3 rather than mass lists), multi-stakeholder threading (reaching 2–4 people at each account), longer sequences (8–12 touches over 6 weeks), and executive-specific copy that's shorter and more strategic." },
      { q: "How do you reach C-suite buyers at enterprise accounts?", a: "C-suite outreach requires shorter emails, peer-company social proof, and business-outcome framing. We don't pitch features to a CRO — we open with revenue impact and ask about their pipeline math." },
      { q: "Can you complement our existing SDR team?", a: "Yes. We can run the enterprise tier while your SDRs handle SMB, or we can run specific verticals or geographies where you don't have in-house coverage." },
      { q: "We have a RevOps team. Will you integrate with our CRM and reporting?", a: "Yes. All meetings, contacts, and sequence data flow into HubSpot, Salesforce, or Pipedrive. We provide weekly pipeline reports in the format your RevOps team prefers." },
    ],
    relatedSlugs: ["outbound-for-series-a-saas", "appointment-setting-for-vp-sales", "outsourced-sdr-saas"],
  },
  {
    slug: "outbound-for-bootstrapped-saas",
    type: "stage",
    h1: "Outbound Sales & Appointment Setting for Bootstrapped SaaS",
    metaTitle: "Outbound Sales for Bootstrapped SaaS | Accelerated Growth",
    metaDescription:
      "Bootstrapped SaaS needs efficient, high-ROI pipeline. We run cold email and appointment setting at $143 cost-per-meeting — 3x more efficient than hiring an SDR.",
    keywords: ["outbound sales bootstrapped saas", "cold email bootstrapped startup", "low cost appointment setting saas", "self funded saas pipeline"],
    badge: "Bootstrapped SaaS",
    subheadline:
      "You don't have investor money to burn. Every dollar has to generate ROI. At $143 cost-per-meeting vs. $500+ for an in-house SDR, outsourced outbound is the capital-efficient way to build pipeline.",
    painPoints: [
      { icon: "💡", heading: "Hiring an SDR is expensive and risky", body: "A junior SDR costs $100k+ fully loaded. That's a major bet for a bootstrapped company. If they underperform or leave in 6 months, you've burned real runway with nothing to show." },
      { icon: "⚙️", heading: "Founder time is your scarcest resource", body: "Manual cold email by the founder averages 5–10 emails/day between product, support, and hiring. That's 2–4 meetings/month — not enough to build a real pipeline." },
      { icon: "📊", heading: "Need to prove channel ROI before committing budget", body: "Bootstrapped companies can't afford to commit $80k/yr to an SDR without proof the channel works. Outsourced outbound proves it in 60 days at a fraction of the cost." },
    ],
    approach: [
      { step: "01", heading: "Lean, efficient ICP targeting", body: "No wasted contacts. Every person we reach matches your ICP precisely. Our cost-per-meeting is $143 — 3x better than in-house — because we don't send mass-market emails to bad-fit prospects." },
      { step: "02", heading: "Transparent ROI reporting", body: "Every week you see: emails sent, replies, meetings booked, cost per meeting. No black box. If the ROI math isn't working, we diagnose it together. You're never guessing whether the investment is worth it." },
      { step: "03", heading: "No long-term commitment required", body: "Our Starter plan is month-to-month. Try it for 60 days. If the meetings are converting to pipeline, continue. If not, cancel with 30 days notice. We're confident enough in our results to not need lock-in." },
    ],
    metrics: [
      { value: "$143", label: "average cost per qualified meeting" },
      { value: "60 days", label: "to prove channel ROI" },
      { value: "3x", label: "more efficient than in-house SDR" },
    ],
    testimonialQuote: "As a bootstrapped founder, every dollar matters. At $143 per meeting vs. what an SDR would cost us, it wasn't even a close decision. We've been running for 8 months and the ROI is clear.",
    testimonialName: "Chris B.",
    testimonialTitle: "Founder, Bootstrapped B2B SaaS",
    faqItems: [
      { q: "Is outbound affordable for a bootstrapped company?", a: "Our Starter plan is $2,500/month and generates 15–25 meetings/month. At 20 meetings, that's $125/meeting — significantly cheaper than a full-time SDR and with no ramp period or management overhead." },
      { q: "What's the minimum budget to make outbound work?", a: "$2,500/month covers the full infrastructure, ICP research, copywriting, and meeting booking. Below that, the economics of running a high-quality campaign don't work and results suffer." },
      { q: "Month-to-month or annual contract?", a: "Our Starter and Growth plans are month-to-month after the initial month. No lock-in. We retain clients through results, not contracts." },
      { q: "How long until I see ROI?", a: "First meetings appear in week 2–3. By end of month 1, you have real meeting data. By month 2, you have enough pipeline data to make a confident decision about whether to continue, scale, or adjust." },
    ],
    relatedSlugs: ["outbound-for-seed-stage-saas", "appointment-setting-for-founders", "b2b-cold-email-agency-pricing"],
  },
  // ─── BUYER TITLES ────────────────────────────────────────────────────────────
  {
    slug: "appointment-setting-for-vp-sales",
    type: "title",
    h1: "Appointment Setting for VP of Sales: Fill Your Team's Calendar",
    metaTitle: "Appointment Setting for VP Sales | Accelerated Growth",
    metaDescription:
      "Built for VP Sales who need to hit pipeline targets without managing SDR headcount. We generate 30–50 qualified meetings/month for your AE team — fully managed.",
    keywords: ["appointment setting for vp sales", "outbound pipeline for sales teams", "sdr agency for vp sales", "managed pipeline generation"],
    badge: "For VP of Sales",
    subheadline:
      "Your AEs are ready to close. The pipeline isn't there. You're not going to miss quota because of a pipeline gap. We generate 30–50 qualified meetings/month for your team — without adding headcount.",
    painPoints: [
      { icon: "📉", heading: "Pipeline gap between what AEs can close and what's being booked", body: "AEs can close. SDR headcount is the constraint. Hiring, ramping, and managing SDRs takes 3–6 months and $100k+ per hire — and quota pressure doesn't wait." },
      { icon: "🔄", heading: "SDR attrition disrupts pipeline continuity", body: "Entry-level SDR roles have 12–18 month average tenure. Every departure means a 3-month ramp before you're back to full pipeline velocity. Outsourced outbound doesn't have an attrition problem." },
      { icon: "📋", heading: "Pipeline reporting to the CRO needs to show a system, not luck", body: "Consistent pipeline requires a system: defined ICP, running sequences, weekly optimization. Most VP Sales are running outbound ad-hoc — which produces unpredictable results." },
    ],
    approach: [
      { step: "01", heading: "Understand your pipeline math", body: "We start with your ACV, close rate, and quota. Then we build backward: how many meetings per month does your team need to hit plan? We design the outbound motion to hit that number." },
      { step: "02", heading: "Build sequences for your AEs' target accounts", body: "We work from your target account list, ICP definition, and any existing sequences. We improve what's working, kill what isn't, and build new sequences for segments you're not currently reaching." },
      { step: "03", heading: "Weekly pipeline reporting", body: "Every Monday: meetings booked last week, pipeline sourced, cost per meeting, and next week's plan. You always know exactly what's in the pipeline and what's driving it." },
    ],
    metrics: [
      { value: "30–50", label: "qualified meetings/month for AE team" },
      { value: "3 weeks", label: "to first meetings booked" },
      { value: "Zero", label: "SDR headcount added" },
    ],
    testimonialQuote: "I was carrying a $4M quota with 2 AEs and not enough pipeline. We launched this in the first week of Q2 and by the end of the quarter we had enough pipeline to hit plan. No new headcount. No ramp time.",
    testimonialName: "Michael B.",
    testimonialTitle: "VP Sales, Series B SaaS",
    faqItems: [
      { q: "Can you integrate with our existing CRM and pipeline process?", a: "Yes. All meetings flow into HubSpot, Salesforce, or Pipedrive with full contact data and sequence history. We work within your existing pipeline stages and reporting structure." },
      { q: "How do you ensure meeting quality, not just volume?", a: "Every meeting is pre-qualified before it's booked. We confirm BANT criteria during reply handling: correct buyer title, relevant use case, appropriate company size. AEs don't receive discovery calls that haven't passed basic qualification." },
      { q: "Can you run outbound for multiple AEs with different territories?", a: "Yes. We build separate ICPs and sequences per territory, vertical, or AE. Pipeline is tracked and attributed per segment so you can see exactly what's working where." },
      { q: "What happens to pipeline continuity if we scale down or pause?", a: "Contacts mid-sequence are paused cleanly. When you resume, sequences pick up where they left off. Pipeline continuity is built into our workflow so you never lose the history of what's been contacted." },
    ],
    relatedSlugs: ["outsourced-sdr-saas", "outbound-for-series-b-saas", "appointment-setting-for-founders"],
  },
  {
    slug: "appointment-setting-for-founders",
    type: "title",
    h1: "Appointment Setting for Founders: Stop Doing Outbound Yourself",
    metaTitle: "Appointment Setting for Founders | Accelerated Growth",
    metaDescription:
      "Founders doing their own cold email get 3–8 meetings/month. We generate 20–40 qualified meetings/month while you focus on product, team, and customers.",
    keywords: ["appointment setting for founders", "founder led sales outbound", "cold email for startup founders", "outsource cold email founder"],
    badge: "For Founders",
    subheadline:
      "You're the best person to close deals. You're not the best person to spend 3 hours a day writing cold emails. Free yourself from the outreach grind — we fill your calendar, you run the calls.",
    painPoints: [
      { icon: "⏰", heading: "Founder time is worth more than $50/hour outbound work", body: "Manually sending cold email, following up, and managing replies is legitimate work — but it's not the highest-value use of a founder's time. Every hour on outbound is an hour not spent on product, hiring, or customer success." },
      { icon: "🔄", heading: "Inconsistency kills pipeline: outbound gets skipped when things are busy", body: "Founder-led outbound works until it doesn't. A fundraise, a hiring sprint, a product launch — and outreach stops for 3 weeks. The pipeline gap follows 6 weeks later." },
      { icon: "🧠", heading: "You haven't had time to systematize what works", body: "Founders doing outreach manually have no data on which sequences, subject lines, or ICPs convert. Every week is an experiment with no framework. We bring the system." },
    ],
    approach: [
      { step: "01", heading: "Learn your voice and ICP in week 1", body: "We interview you for 60 minutes about your best customers, your product's core value, and your preferred communication style. Our emails sound like you — not a sales agency." },
      { step: "02", heading: "Take outbound completely off your plate", body: "You never touch a cold email tool again. We handle list building, copy, sending, reply management, objection handling, and calendar booking. You get a meeting notification when it's booked." },
      { step: "03", heading: "You show up and close", body: "Every meeting on your calendar is with someone from your ICP who has replied positively and confirmed a time. No more showing up to unqualified calls. No more no-shows. Just qualified prospects ready for a conversation." },
    ],
    metrics: [
      { value: "20–40", label: "meetings/month vs. 3–8 founder-led" },
      { value: "10+ hrs", label: "founder time saved per week" },
      { value: "2 weeks", label: "to first booked meeting" },
    ],
    testimonialQuote: "I was doing cold email myself, getting maybe 6 meetings a month while also running the product roadmap, fundraising, and managing the team. Handing off outbound was the best leverage decision I made. 31 meetings last month. Zero time from me.",
    testimonialName: "Andrea S.",
    testimonialTitle: "CEO & Co-Founder, B2B SaaS (Seed-Series A)",
    faqItems: [
      { q: "Will the emails still sound like they're coming from me?", a: "Yes. We capture your voice, tone, and perspective in our onboarding interview. Most founders tell us they can't tell the difference between our emails and what they'd write themselves. We never use template language that sounds agency-generated." },
      { q: "How do you handle replies and objections?", a: "Our team handles replies within 4 hours during business hours. We manage objections, answer questions, and push toward booking. You only get involved when a meeting is confirmed." },
      { q: "What if I want to be involved in specific accounts?", a: "We set up a Slack channel or notification system for any account you flag as strategic. You can jump in and take over the conversation for any prospect, at any point." },
      { q: "Is this worth it at seed stage when I'm still doing founder-led sales?", a: "Especially at seed stage. You need both to be true simultaneously: running sales yourself to learn, and generating enough pipeline to have options. We generate the top-of-funnel volume so you have real choices about which deals to pursue." },
    ],
    relatedSlugs: ["outbound-for-seed-stage-saas", "outbound-for-series-a-saas", "appointment-setting-for-head-of-growth"],
  },
  {
    slug: "appointment-setting-for-head-of-growth",
    type: "title",
    h1: "B2B Outbound for Head of Growth: Add Outbound to Your GTM Mix",
    metaTitle: "B2B Outbound for Head of Growth | Accelerated Growth",
    metaDescription:
      "Head of Growth adding outbound to a PLG or inbound motion? We integrate outbound as a channel — with attribution, A/B testing, and pipeline analytics built in.",
    keywords: ["outbound for head of growth", "add outbound channel saas growth", "outbound gtm saas", "growth team outbound pipeline"],
    badge: "For Head of Growth",
    subheadline:
      "You've maxed out inbound and PLG. You know outbound is the next lever. You need it running in 4 weeks without hiring a dedicated SDR team.",
    painPoints: [
      { icon: "📊", heading: "You need channel diversification, not channel dependency", body: "Inbound and PLG are table stakes. Companies that add outbound as a third channel see 40–60% pipeline uplift. The question is how to launch it without disrupting what's working." },
      { icon: "🔬", heading: "Growth teams want data, not black boxes", body: "Most outbound agencies can't tell you which segment, which sequence, or which copy variant is driving meetings. You're expected to run experiments and report on outcomes. So are we." },
      { icon: "⚡", heading: "Speed to market matters — no time for a 3-month ramp", body: "Growth teams move fast. You need a new channel live in weeks, not months. We've launched outbound for dozens of SaaS companies — we have no learning curve." },
    ],
    approach: [
      { step: "01", heading: "Channel integration, not disruption", body: "We map your existing funnel, attribution model, and ICP alongside your current channels. Outbound is designed to complement your inbound motion — reaching prospects who haven't found you through search or product-led channels." },
      { step: "02", heading: "Experiment-ready infrastructure", body: "Every campaign is A/B tested at the subject line, opening line, and CTA level. Weekly reports show statistical performance per variant. We run outbound like a growth function, not a sales function." },
      { step: "03", heading: "Full attribution and pipeline analytics", body: "Every meeting is attributed to campaign, sequence, and copy variant. You can show your CRO exactly what each outbound experiment produced. Pipeline data flows into your CRM automatically." },
    ],
    metrics: [
      { value: "4 weeks", label: "to first outbound meetings live" },
      { value: "27%", label: "avg pipeline uplift from outbound layer" },
      { value: "Weekly", label: "A/B test results per variant" },
    ],
    testimonialQuote: "I'd tried to build outbound in-house twice. Both times it died from context switching. This team got outbound running in 3 weeks and we treat it like a growth channel now — A/B tested, attributed, optimized weekly.",
    testimonialName: "Lin C.",
    testimonialTitle: "Head of Growth, Series B SaaS",
    faqItems: [
      { q: "How does outbound integrate with our existing PLG motion?", a: "We reach prospects who've shown product intent (free trial starts, docs views if you share that data) via outbound to accelerate conversion. We also reach companies in your ICP who've never heard of you — expanding your total addressable pipeline." },
      { q: "Can we get campaign-level attribution in our analytics stack?", a: "Yes. We pass UTM data, campaign source, and sequence identifiers to your CRM. If you use an analytics tool like Mixpanel or Amplitude, we can work with your team to set up custom event tracking for outbound-sourced pipeline." },
      { q: "We want to own the outbound motion long-term. How do you help with that?", a: "We document everything: ICP profiles, sequence copy, A/B test results, deliverability setup, and reply handling playbooks. If you decide to bring it in-house in month 6, you have a complete operational playbook." },
      { q: "How many experiments can you run simultaneously?", a: "Typically 2–3 active A/B tests per campaign. More than that and the learning rate slows — you need statistical significance before decisions. We run clean experiments with defined hypotheses and decision criteria." },
    ],
    relatedSlugs: ["outbound-for-series-b-saas", "appointment-setting-for-vp-sales", "gtm-outbound-strategy"],
  },
  // ─── HIGH-INTENT KEYWORDS ────────────────────────────────────────────────────
  {
    slug: "b2b-cold-email-agency-pricing",
    type: "intent",
    h1: "B2B Cold Email Agency Pricing: What Does Appointment Setting Actually Cost?",
    metaTitle: "Cold Email Agency Pricing | Accelerated Growth",
    metaDescription:
      "Transparent pricing for B2B cold email and appointment setting. Starter $2,500/mo, Growth $5,000/mo, Scale $10,000/mo. Compare to in-house SDR cost.",
    keywords: ["cold email agency pricing", "appointment setting agency cost", "outsourced sdr pricing", "b2b outbound agency rates"],
    badge: "Pricing & ROI",
    subheadline:
      "Transparent pricing, no retainer traps. Three plans based on meeting volume. Average cost per qualified meeting: $143. Compare that to $500+ for an in-house SDR.",
    painPoints: [
      { icon: "💰", heading: "Most agencies hide pricing until a sales call", body: "We don't. Here's what you get and what it costs. No discovery call required to understand our pricing structure." },
      { icon: "📊", heading: "Cost-per-meeting is the metric that matters", body: "Monthly retainer is just a number. What matters is cost per qualified meeting — meetings with real buyers who have budget and a problem. Our average: $143/meeting across all plans." },
      { icon: "🔄", heading: "In-house SDR math rarely pencils out at seed or Series A", body: "A $70k base SDR costs $110–130k fully loaded. At 20 meetings/month, that's $541/meeting. Our Growth plan generates 35 meetings at $143/meeting. The math isn't close." },
    ],
    approach: [
      { step: "01", heading: "Starter: $2,500/month — 15–25 meetings", body: "Cold email outreach, ICP research, copywriting, sending infrastructure, reply management, and meeting booking. Best for: seed-stage companies, bootstrapped SaaS, and teams validating the channel." },
      { step: "02", heading: "Growth: $5,000/month — 30–50 meetings", body: "Everything in Starter plus LinkedIn outreach, multi-sequence testing, intent data enrichment, and dedicated account management. Best for: Series A and B companies scaling pipeline." },
      { step: "03", heading: "Scale: $10,000/month — 50+ meetings", body: "Full multi-channel outbound: email, LinkedIn, ABM targeting, personalized video sequences, and enterprise account-based motion. Best for: Series B+ companies targeting enterprise accounts." },
    ],
    metrics: [
      { value: "$143", label: "average cost per qualified meeting" },
      { value: "$2,500", label: "starting monthly investment" },
      { value: "3x", label: "cheaper than in-house SDR per meeting" },
    ],
    testimonialQuote: "I ran the numbers before signing: in-house SDR was going to cost me $540 per meeting at ramp. This came in at $158 per meeting in month 1 and has dropped since. It's not a close comparison.",
    testimonialName: "Patrick L.",
    testimonialTitle: "CEO, Series A SaaS",
    faqItems: [
      { q: "What's included in every plan?", a: "All plans include: ICP research, contact sourcing, email infrastructure (sending domains, DMARC, SPF, DKIM, warmup), copywriting, A/B testing, reply handling, meeting booking, and weekly performance reporting." },
      { q: "Are there setup fees?", a: "No. Everything including domain purchase, DNS configuration, and warmup is included in the monthly fee. You don't pay anything beyond the monthly plan price." },
      { q: "What's the contract length?", a: "Month-to-month after the first month. We don't require annual commitments. Our retention rate is high because results are consistent — we don't need lock-in to keep clients." },
      { q: "What happens if you don't hit the meeting guarantee?", a: "We work at no charge until we make up the shortfall. We've triggered this guarantee twice in three years — both times we over-delivered in the following month." },
    ],
    relatedSlugs: ["outsourced-sdr-saas", "sdr-as-a-service", "outbound-for-bootstrapped-saas"],
  },
  {
    slug: "outsourced-sdr-saas",
    type: "intent",
    h1: "Outsourced SDR for B2B SaaS: How It Works, What It Costs, What to Expect",
    metaTitle: "Outsourced SDR for B2B SaaS | Accelerated Growth",
    metaDescription:
      "Everything you need to know about outsourced SDR for B2B SaaS: how it works, cost comparison vs. in-house, what to expect in the first 90 days, and how to choose a provider.",
    keywords: ["outsourced sdr saas", "sdr outsourcing b2b", "outsource sales development rep", "managed sdr service saas"],
    badge: "Outsourced SDR",
    subheadline:
      "Outsourced SDR means handing off the entire top-of-funnel — from list building to booked meetings. Here's how it works, what it actually costs, and what distinguishes a great provider from a mediocre one.",
    painPoints: [
      { icon: "🔍", heading: "In-house SDRs cost $100k+ before they're productive", body: "Base salary, OTE, benefits, tools, management time, and a 3–4 month ramp period. An outsourced SDR function produces meetings in week 2 at a fraction of the total cost." },
      { icon: "🎯", heading: "SDR attrition disrupts pipeline continuity", body: "Entry-level SDR tenure averages 12–18 months. Each departure creates a 3-month gap before a replacement is productive. Outsourced SDR has no attrition problem." },
      { icon: "🏗️", heading: "Building the function is as hard as running it", body: "Hiring, onboarding, training, building sequences, setting up infrastructure — the build is a full-time job that takes 3 months before the first meeting. Outsourced SDR skips the build entirely." },
    ],
    approach: [
      { step: "01", heading: "How outsourced SDR works", body: "We act as your SDR function: ICP research, contact sourcing, email and LinkedIn outreach, reply management, objection handling, and meeting booking. AEs receive booked meetings. Your team focuses on closing." },
      { step: "02", heading: "The onboarding process", body: "Week 1: ICP definition and copy development. Week 2: infrastructure launch (domains, DNS, warmup, sequences live). Week 3: first emails sent. Week 2–3: first replies and booked meetings." },
      { step: "03", heading: "Ongoing optimization", body: "Every week: performance review, A/B test results, sequence updates, ICP refinement based on reply patterns. Your outsourced SDR function improves continuously — unlike an in-house SDR who learns slowly without structure." },
    ],
    metrics: [
      { value: "2 weeks", label: "to first meetings (vs. 3 months in-house ramp)" },
      { value: "$143", label: "cost per meeting vs. $500+ in-house" },
      { value: "0%", label: "attrition vs. 60%/yr for in-house SDRs" },
    ],
    testimonialQuote: "I'd hired two SDRs in two years and both left before hitting full productivity. Switching to outsourced outbound solved the continuity problem and the results were better than either in-house hire.",
    testimonialName: "Rachel G.",
    testimonialTitle: "VP Sales, B2B SaaS Platform",
    faqItems: [
      { q: "Does outsourced SDR mean we lose control of our brand voice?", a: "No. We capture your brand voice, messaging guidelines, and approved positioning before writing a word. Every email goes through a review process before launch. You approve the sequences." },
      { q: "How do you handle objections and complex questions about the product?", a: "Our reply handlers are trained on your product and FAQs. For technical questions beyond their brief, they collect the information and loop in your team before responding. Every complex prospect interaction is documented." },
      { q: "What CRMs do you integrate with?", a: "HubSpot, Salesforce, Pipedrive, Close, and Attio. Every booked meeting creates a contact and deal in your CRM with full sequence history, company data, and notes from the qualifying conversation." },
      { q: "What metrics should I expect in the first 90 days?", a: "Days 1–14: setup and warmup. Days 14–30: first emails sent, replies incoming, first meetings booked. Days 30–60: full campaign velocity, 15–25 meetings/month. Days 60–90: optimization complete, 20–40 meetings/month consistently." },
    ],
    relatedSlugs: ["sdr-as-a-service", "b2b-cold-email-agency-pricing", "appointment-setting-for-vp-sales"],
  },
  {
    slug: "sdr-as-a-service",
    type: "intent",
    h1: "SDR as a Service for B2B SaaS: Everything Your In-House Team Does, Done for You",
    metaTitle: "SDR as a Service for B2B SaaS | Accelerated Growth",
    metaDescription:
      "SDR as a Service: the complete outbound function — ICP research, list building, cold email, LinkedIn, reply handling, and meeting booking. No hiring. No ramp. Meetings in week 2.",
    keywords: ["sdr as a service", "sdr as a service saas", "managed sdr saas", "full outsourced sdr function"],
    badge: "SDR as a Service",
    subheadline:
      "SDR as a Service means one thing: you give us your ICP, we give you booked meetings. Everything in between — tools, copy, infrastructure, replies, booking — is ours to manage.",
    painPoints: [
      { icon: "🏗️", heading: "Building an SDR function from scratch takes 4–6 months", body: "Hire → onboard → train → build infrastructure → write sequences → warmup domains → launch. That's 120–180 days before your first meeting. SDR as a Service skips this entirely." },
      { icon: "📉", heading: "Most SDR hires underperform for the first 6 months", body: "The average SDR takes 3–4 months to ramp to quota. During ramp, you're paying full salary for 40–60% productivity. SDRaaS is at full productivity in week 2." },
      { icon: "💸", heading: "The total cost of in-house SDR is 2–3x the base salary", body: "Tools ($400+/mo), management time (5–8 hrs/week), training, benefits, payroll tax, equipment — it adds up fast. SDRaaS consolidates all of this into a single, predictable monthly fee." },
    ],
    approach: [
      { step: "01", heading: "Full-stack SDR function, externally operated", body: "We run the complete SDR workflow: ICP research, contact sourcing, email infrastructure, copywriting, A/B testing, sending, reply management, objection handling, and Calendly booking. You own the meetings. We own the process." },
      { step: "02", heading: "Embedded in your team's workflow", body: "We work in your Slack, report in your CRM format, and join your sales meeting as needed. We're indistinguishable from an in-house team in terms of communication — without the management overhead." },
      { step: "03", heading: "Scale up or down with demand", body: "Need 50 meetings/month this quarter and 20 next quarter? Adjust your plan. No hire/fire cycle. No headcount discussion. Outbound volume matches your pipeline needs." },
    ],
    metrics: [
      { value: "14 days", label: "to first meeting vs. 120 days in-house" },
      { value: "60%", label: "lower cost per meeting vs. in-house SDR" },
      { value: "Instant", label: "scale up or down — no headcount process" },
    ],
    testimonialQuote: "SDR as a Service isn't just cheaper than hiring — it's faster, more data-driven, and doesn't come with an HR problem when results are slow. It's the right model for a company at our stage.",
    testimonialName: "Omar K.",
    testimonialTitle: "CRO, Series B SaaS",
    faqItems: [
      { q: "What makes SDRaaS different from a standard cold email agency?", a: "Scope and integration. A cold email agency sends emails. SDRaaS runs the complete function: ICP research, data sourcing, infrastructure, copy, A/B testing, reply management, objection handling, and booking. It's an outsourced department, not a vendor." },
      { q: "How does the handoff from SDRaaS to AE work?", a: "When a meeting is booked, the AE receives a Slack notification and CRM entry with: prospect name, title, company, ICP fit notes, qualifying information from the email conversation, and the specific pain point they mentioned." },
      { q: "Can you run SDRaaS alongside an internal SDR team?", a: "Yes. We often run specific segments or geographies that in-house SDRs aren't covering. We can also run the SDRaaS motion while you hire your first in-house SDR — and document our playbook so their onboarding is faster." },
      { q: "What's the minimum term for SDRaaS?", a: "Month-to-month after the first month. We recommend committing to at least 3 months to see full campaign optimization and have meaningful data on ICP performance." },
    ],
    relatedSlugs: ["outsourced-sdr-saas", "b2b-cold-email-agency-pricing", "outbound-for-series-a-saas"],
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((p) => p.slug === slug);
}
