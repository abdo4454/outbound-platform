import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { notifyPaymentFailed } from "@/lib/slack";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ---- Subscription Created ----
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata.orgId;
        if (!orgId) break;

        await db.organization.update({
          where: { id: orgId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            status: "ACTIVE",
            mrr: subscription.items.data[0]?.price.unit_amount ?? 0,
          },
        });
        break;
      }

      // ---- Payment Succeeded ----
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const org = await db.organization.findFirst({
          where: { stripeCustomerId: invoice.customer as string },
        });
        if (!org) break;

        await db.invoice.upsert({
          where: { stripeInvoiceId: invoice.id },
          create: {
            stripeInvoiceId: invoice.id,
            orgId: org.id,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: "PAID",
            paidAt: new Date(),
            pdfUrl: invoice.invoice_pdf,
          },
          update: {
            status: "PAID",
            paidAt: new Date(),
            pdfUrl: invoice.invoice_pdf,
          },
        });
        break;
      }

      // ---- Payment Failed ----
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const org = await db.organization.findFirst({
          where: { stripeCustomerId: invoice.customer as string },
        });
        if (!org) break;

        await db.invoice.upsert({
          where: { stripeInvoiceId: invoice.id },
          create: {
            stripeInvoiceId: invoice.id,
            orgId: org.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: "OPEN",
          },
          update: { status: "OPEN" },
        });

        // Notify team
        await notifyPaymentFailed({
          name: org.name,
          email: org.billingEmail || "",
          amount: invoice.amount_due,
        });
        break;
      }

      // ---- Subscription Canceled ----
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const org = await db.organization.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (!org) break;

        await db.organization.update({
          where: { id: org.id },
          data: { status: "CHURNED", mrr: 0 },
        });

        await db.activityLog.create({
          data: {
            orgId: org.id,
            action: "subscription.canceled",
            details: { reason: subscription.cancellation_details?.reason },
          },
        });
        break;
      }

      // ---- Subscription Updated ----
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const org = await db.organization.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (!org) break;

        const newPrice = subscription.items.data[0]?.price;
        await db.organization.update({
          where: { id: org.id },
          data: {
            stripePriceId: newPrice?.id,
            mrr: newPrice?.unit_amount ?? org.mrr,
            status: subscription.status === "active" ? "ACTIVE" : "PAUSED",
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
