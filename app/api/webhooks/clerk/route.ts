import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ---- Organization Created ----
      case "organization.created": {
        const { id, name, slug } = event.data;
        await db.organization.create({
          data: {
            clerkOrgId: id,
            name: name || "Untitled",
            slug: slug || id,
          },
        });

        // Create onboarding record
        const org = await db.organization.findUnique({
          where: { clerkOrgId: id },
        });
        if (org) {
          await db.onboarding.create({ data: { orgId: org.id } });
        }
        break;
      }

      // ---- Organization Updated ----
      case "organization.updated": {
        const { id, name, slug } = event.data;
        await db.organization.update({
          where: { clerkOrgId: id },
          data: { name: name || undefined, slug: slug || undefined },
        });
        break;
      }

      // ---- Member Created ----
      case "organizationMembership.created": {
        const { organization, public_user_data } = event.data;
        const org = await db.organization.findUnique({
          where: { clerkOrgId: organization.id },
        });
        if (!org) break;

        await db.member.upsert({
          where: { clerkUserId: public_user_data.user_id },
          create: {
            clerkUserId: public_user_data.user_id,
            email: public_user_data.identifier || "",
            name: `${public_user_data.first_name || ""} ${public_user_data.last_name || ""}`.trim(),
            avatar: public_user_data.image_url,
            orgId: org.id,
            role: event.data.role === "admin" ? "CLIENT_ADMIN" : "VIEWER",
          },
          update: {
            orgId: org.id,
            role: event.data.role === "admin" ? "CLIENT_ADMIN" : "VIEWER",
          },
        });

        // Send welcome email to new members
        if (public_user_data.identifier) {
          await sendWelcomeEmail(
            public_user_data.identifier,
            public_user_data.first_name || "there"
          );
        }
        break;
      }

      // ---- User Created (for individual signups) ----
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        const primaryEmail = email_addresses?.[0]?.email_address;
        if (!primaryEmail) break;

        // Check if member already exists from org membership
        const existing = await db.member.findUnique({
          where: { clerkUserId: id },
        });

        if (!existing) {
          // Will be linked to an org later via organization membership webhook
          console.log(`User created: ${primaryEmail} — awaiting org assignment`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
