type SlackBlock = {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: { type: string; text: string }[];
  elements?: { type: string; text: string }[];
};

async function sendSlackMessage(blocks: SlackBlock[], text: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL not set, skipping notification");
    return;
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, blocks }),
  });
}

export async function notifyNewLead(lead: {
  email: string;
  name?: string | null;
  company?: string | null;
  source?: string | null;
  landingPage?: string | null;
}) {
  await sendSlackMessage(
    [
      {
        type: "header",
        text: { type: "plain_text", text: "📥 New Lead", emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Email:*\n${lead.email}` },
          { type: "mrkdwn", text: `*Name:*\n${lead.name || "—"}` },
          { type: "mrkdwn", text: `*Company:*\n${lead.company || "—"}` },
          { type: "mrkdwn", text: `*Source:*\n${lead.source || "Direct"}` },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Landing page: ${lead.landingPage || "Unknown"}`,
          },
        ],
      },
    ],
    `New lead: ${lead.email} from ${lead.company || "Unknown"}`
  );
}

export async function notifyNewBooking(booking: {
  name: string;
  email: string;
  company?: string;
  time: string;
  assignedTo?: string;
}) {
  await sendSlackMessage(
    [
      {
        type: "header",
        text: { type: "plain_text", text: "🎯 Meeting Booked", emoji: true },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Prospect:*\n${booking.name}` },
          { type: "mrkdwn", text: `*Company:*\n${booking.company || "—"}` },
          { type: "mrkdwn", text: `*Time:*\n${booking.time}` },
          {
            type: "mrkdwn",
            text: `*Assigned to:*\n${booking.assignedTo || "Unassigned"}`,
          },
        ],
      },
    ],
    `New meeting: ${booking.name} from ${booking.company || "Unknown"} at ${booking.time}`
  );
}

export async function notifyPaymentFailed(org: {
  name: string;
  email: string;
  amount: number;
}) {
  await sendSlackMessage(
    [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "⚠️ Payment Failed",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Client:*\n${org.name}` },
          { type: "mrkdwn", text: `*Email:*\n${org.email}` },
          {
            type: "mrkdwn",
            text: `*Amount:*\n$${(org.amount / 100).toFixed(2)}`,
          },
        ],
      },
    ],
    `Payment failed for ${org.name}: $${(org.amount / 100).toFixed(2)}`
  );
}

export async function notifyCampaignAlert(alert: {
  client: string;
  campaign: string;
  issue: string;
  metric: string;
}) {
  await sendSlackMessage(
    [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 Campaign Alert",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Client:*\n${alert.client}` },
          { type: "mrkdwn", text: `*Campaign:*\n${alert.campaign}` },
          { type: "mrkdwn", text: `*Issue:*\n${alert.issue}` },
          { type: "mrkdwn", text: `*Metric:*\n${alert.metric}` },
        ],
      },
    ],
    `Campaign alert for ${alert.client}: ${alert.issue}`
  );
}
