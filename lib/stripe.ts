import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const PLANS = {
  STARTER: {
    name: "Starter",
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    price: 2500_00, // $2,500/mo
    features: [
      "1 sending domain",
      "Up to 5,000 emails/month",
      "Basic reporting dashboard",
      "Email support",
    ],
  },
  GROWTH: {
    name: "Growth",
    priceId: process.env.STRIPE_GROWTH_PRICE_ID!,
    price: 5000_00, // $5,000/mo
    features: [
      "3 sending domains",
      "Up to 25,000 emails/month",
      "Advanced analytics & A/B testing",
      "Slack integration",
      "Weekly performance reports",
      "Dedicated account manager",
    ],
  },
  SCALE: {
    name: "Scale",
    priceId: process.env.STRIPE_SCALE_PRICE_ID!,
    price: 10000_00, // $10,000/mo
    features: [
      "Unlimited sending domains",
      "Unlimited emails",
      "Multi-channel (email + LinkedIn)",
      "Real-time dashboard",
      "Custom integrations",
      "Priority support",
      "Quarterly business reviews",
    ],
  },
} as const;

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  orgId: string
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?setup=complete`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { orgId },
    subscription_data: { metadata: { orgId } },
  });
}

export async function createCustomerPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  });
}
