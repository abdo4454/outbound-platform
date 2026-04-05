import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

const FROM = process.env.EMAIL_FROM || `Accelerated Growth <${process.env.GMAIL_USER}>`;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = createTransporter();
  return transporter.sendMail({ from: FROM, to, subject, html });
}

// ---- Email Templates ----

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: "Welcome to Accelerated Growth — Let's get you set up",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1f35;">Welcome aboard, ${name}!</h1>
        <p>We're excited to have you. Here's what happens next:</p>
        <ol>
          <li><strong>Complete onboarding</strong> — Tell us about your ideal customer profile and messaging preferences.</li>
          <li><strong>We set up your campaigns</strong> — Our team configures domains, warms up inboxes, and writes your sequences.</li>
          <li><strong>Meetings start flowing</strong> — You'll see booked meetings in your dashboard within 2-3 weeks.</li>
        </ol>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding"
           style="display: inline-block; background: #3366ff; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Start Onboarding →
        </a>
        <p style="color: #666; margin-top: 24px;">Questions? Reply to this email and we'll get right back to you.</p>
      </div>
    `,
  });
}

export async function sendBookingNotification(
  to: string,
  prospectName: string,
  prospectCompany: string,
  bookingTime: string
) {
  return sendEmail({
    to,
    subject: `New meeting booked: ${prospectName} from ${prospectCompany}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1f35;">🎯 New Meeting Booked</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666;">Prospect</td><td style="padding: 8px 0; font-weight: 600;">${prospectName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0; font-weight: 600;">${prospectCompany}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0; font-weight: 600;">${bookingTime}</td></tr>
        </table>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; background: #3366ff; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          View in Dashboard →
        </a>
      </div>
    `,
  });
}

export async function sendLeadNotification(
  to: string,
  leadEmail: string,
  leadCompany: string | null,
  source: string | null
) {
  return sendEmail({
    to,
    subject: `New lead: ${leadEmail}${leadCompany ? ` from ${leadCompany}` : ""}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1f35;">📥 New Lead Captured</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0; font-weight: 600;">${leadEmail}</td></tr>
          ${leadCompany ? `<tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0; font-weight: 600;">${leadCompany}</td></tr>` : ""}
          ${source ? `<tr><td style="padding: 8px 0; color: #666;">Source</td><td style="padding: 8px 0; font-weight: 600;">${source}</td></tr>` : ""}
        </table>
      </div>
    `,
  });
}

export async function sendWeeklyReport(
  to: string,
  clientName: string,
  metrics: {
    emailsSent: number;
    openRate: number;
    replyRate: number;
    meetingsBooked: number;
  }
) {
  return sendEmail({
    to,
    subject: `Your Weekly Outbound Report — ${metrics.meetingsBooked} meetings booked`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1f35;">Weekly Report</h1>
        <p>Hi ${clientName}, here's your outbound performance this week:</p>
        <div style="display: flex; gap: 16px; margin: 24px 0;">
          <div style="flex: 1; background: #eef4ff; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #3366ff;">${metrics.emailsSent.toLocaleString()}</div>
            <div style="color: #666; font-size: 14px;">Emails Sent</div>
          </div>
          <div style="flex: 1; background: #eef4ff; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #3366ff;">${metrics.openRate}%</div>
            <div style="color: #666; font-size: 14px;">Open Rate</div>
          </div>
          <div style="flex: 1; background: #eef4ff; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #3366ff;">${metrics.replyRate}%</div>
            <div style="color: #666; font-size: 14px;">Reply Rate</div>
          </div>
          <div style="flex: 1; background: #f0fdf4; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 28px; font-weight: 700; color: #22c55e;">${metrics.meetingsBooked}</div>
            <div style="color: #666; font-size: 14px;">Meetings Booked</div>
          </div>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display: inline-block; background: #3366ff; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Full Dashboard →
        </a>
      </div>
    `,
  });
}
