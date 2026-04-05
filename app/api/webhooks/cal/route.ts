import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { notifyNewBooking } from "@/lib/slack";
import { sendBookingNotification } from "@/lib/email";

function verifyCalSignature(body: string, signature: string | null): boolean {
  if (!signature || !process.env.CAL_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", process.env.CAL_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-cal-signature-256");

  // Verify webhook signature
  if (!verifyCalSignature(body, signature)) {
    console.error("Cal.com webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(body);
    const { triggerEvent } = payload;

    switch (triggerEvent) {
      // ---- Booking Created ----
      case "BOOKING_CREATED": {
        const { attendees, startTime, organizer, metadata } = payload.payload;
        const attendee = attendees?.[0];
        if (!attendee) break;

        const prospectName = attendee.name || attendee.email;
        const prospectEmail = attendee.email;
        const prospectCompany = metadata?.company || attendee.metadata?.company;
        const bookingTime = new Date(startTime).toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        });

        // Update or create lead with booking info
        const existingLead = await db.lead.findFirst({
          where: { email: prospectEmail },
          orderBy: { createdAt: "desc" },
        });

        if (existingLead) {
          await db.lead.update({
            where: { id: existingLead.id },
            data: { status: "DISCOVERY_BOOKED" },
          });
        } else {
          await db.lead.create({
            data: {
              email: prospectEmail,
              name: attendee.name,
              company: prospectCompany,
              status: "DISCOVERY_BOOKED",
              source: metadata?.utm_source,
              medium: metadata?.utm_medium,
              campaign: metadata?.utm_campaign,
            },
          });
        }

        // Notify team
        await Promise.allSettled([
          notifyNewBooking({
            name: prospectName,
            email: prospectEmail,
            company: prospectCompany,
            time: bookingTime,
            assignedTo: organizer?.name,
          }),
          sendBookingNotification(
            organizer?.email || process.env.TEAM_NOTIFICATION_EMAIL!,
            prospectName,
            prospectCompany || "Unknown",
            bookingTime
          ),
        ]);

        // Log activity (only if we have a real orgId)
        if (existingLead?.orgId) {
          await db.activityLog.create({
            data: {
              orgId: existingLead.orgId,
              action: "booking.created",
              details: JSON.stringify({
                prospectName,
                prospectEmail,
                prospectCompany,
                bookingTime: startTime,
                assignedTo: organizer?.name,
              }),
            },
          });
        }

        break;
      }

      // ---- Booking Canceled ----
      case "BOOKING_CANCELLED": {
        const { attendees } = payload.payload;
        const attendee = attendees?.[0];
        if (!attendee) break;

        const lead = await db.lead.findFirst({
          where: { email: attendee.email, status: "DISCOVERY_BOOKED" },
          orderBy: { createdAt: "desc" },
        });

        if (lead) {
          await db.lead.update({
            where: { id: lead.id },
            data: { status: "QUALIFIED" }, // Revert to qualified
          });
        }
        break;
      }

      // ---- Booking Rescheduled ----
      case "BOOKING_RESCHEDULED": {
        // Log but don't change status — skip if no orgId available
        const { attendees: reschAtts } = payload.payload;
        const reschEmail = reschAtts?.[0]?.email;
        if (reschEmail) {
          const reschLead = await db.lead.findFirst({
            where: { email: reschEmail },
            orderBy: { createdAt: "desc" },
          });
          if (reschLead?.orgId) {
            await db.activityLog.create({
              data: {
                orgId: reschLead.orgId,
                action: "booking.rescheduled",
                details: JSON.stringify({ email: reschEmail, startTime: payload.payload.startTime }),
              },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Cal.com webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
