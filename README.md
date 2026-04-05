# Accelrated Growth Platform

Full-stack outbound marketing agency platform built with Next.js 14, Prisma, Stripe, Clerk, and Tailwind CSS.

## Architecture

```
├── app/
│   ├── page.tsx                    # Marketing landing page
│   ├── layout.tsx                  # Root layout (Clerk, fonts, analytics)
│   ├── dashboard/                  # Client portal (protected)
│   │   ├── layout.tsx              # Sidebar navigation
│   │   ├── page.tsx                # Overview with metrics & charts
│   │   ├── campaigns/              # Campaign details
│   │   ├── analytics/              # Deep analytics
│   │   ├── settings/               # Account & billing settings
│   │   └── ...
│   ├── admin/                      # Internal admin (protected)
│   │   ├── page.tsx                # All clients overview, MRR, health
│   │   ├── clients/                # Per-client management
│   │   └── revenue/                # Revenue analytics
│   ├── onboarding/                 # Client onboarding wizard
│   │   └── page.tsx                # Multi-step ICP, messaging, setup
│   └── api/
│       ├── leads/route.ts          # Lead capture endpoint
│       └── webhooks/
│           ├── stripe/route.ts     # Stripe billing events
│           ├── cal/route.ts        # Cal.com booking events
│           └── clerk/route.ts      # User/org sync events
├── components/
│   ├── marketing/                  # Landing page sections
│   ├── dashboard/                  # Dashboard widgets & charts
│   ├── admin/                      # Admin-specific components
│   ├── forms/                      # Lead capture, onboarding forms
│   └── ui/                         # Shared UI primitives
├── lib/
│   ├── db.ts                       # Prisma client singleton
│   ├── stripe.ts                   # Stripe SDK + helpers
│   ├── email.ts                    # Resend templates
│   ├── slack.ts                    # Slack notifications
│   ├── rate-limit.ts               # Upstash rate limiting
│   ├── validations.ts              # Zod schemas
│   └── utils.ts                    # Shared utilities
├── prisma/
│   └── schema.prisma               # Full database schema
├── styles/
│   └── globals.css                 # Tailwind + custom styles
└── middleware.ts                    # Clerk auth middleware
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Accounts: Clerk, Stripe, Resend, Upstash, PostHog

### Setup

1. **Clone and install:**
```bash
git clone <repo-url>
cd outbound-platform
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

3. **Set up the database:**
```bash
npx prisma db push    # Push schema to database
npx prisma generate   # Generate Prisma client
```

4. **Configure webhooks:**
   - **Stripe:** Point webhook to `https://yourdomain.com/api/webhooks/stripe`
   - **Cal.com:** Point webhook to `https://yourdomain.com/api/webhooks/cal`
   - **Clerk:** Point webhook to `https://yourdomain.com/api/webhooks/clerk`

5. **Run the dev server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | Clerk |
| Payments | Stripe |
| Email | Resend |
| Cache | Upstash Redis |
| Analytics | PostHog |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Deployment | Vercel |

## Key Features

- **Marketing Site** — High-converting landing page with hero, social proof, pricing, FAQ
- **Lead Capture** — Forms with UTM attribution, rate limiting, spam protection
- **Client Portal** — Real-time campaign metrics, charts, activity feeds
- **Admin Dashboard** — MRR tracking, client health scores, alerts
- **Client Onboarding** — Multi-step wizard for ICP, messaging, domain setup
- **Billing** — Stripe subscriptions, invoicing, customer portal
- **Webhooks** — Stripe, Cal.com, Clerk event processing
- **Notifications** — Slack alerts, email notifications for key events
- **Security** — CSP headers, rate limiting, input validation, CSRF protection

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set all environment variables in your Vercel project settings.
# Acceleratedgrowth
