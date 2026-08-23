import { getAlertSettings, isResendConfigured, isTwilioConfigured } from "@/lib/alerts/settings";
import type { AlertChannel, AlertPayload } from "@/lib/alerts/shared";
import { siteConfig } from "@/config/site";

async function sendEmail(to: string[], subject: string, html: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ALERT_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return { ok: false, error: "RESEND_API_KEY and ALERT_FROM_EMAIL required" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: `Resend ${response.status}: ${body.slice(0, 200)}` };
  }

  return { ok: true };
}

async function sendTeams(webhookUrl: string, payload: AlertPayload) {
  const color =
    payload.severity === "critical" ? "Attention" : payload.severity === "warning" ? "Warning" : "Good";

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      summary: payload.title,
      themeColor: payload.severity === "critical" ? "E00" : payload.severity === "warning" ? "F5A623" : "50E3C2",
      title: `${siteConfig.shortName} — ${payload.title}`,
      text: payload.message,
      potentialAction: payload.link
        ? [{ "@type": "OpenUri", name: "View details", targets: [{ os: "default", uri: payload.link }] }]
        : undefined,
      sections: [{ activityTitle: color }],
    }),
  });

  if (!response.ok) {
    return { ok: false, error: `Teams webhook ${response.status}` };
  }
  return { ok: true };
}

async function sendSms(phone: string, message: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  if (!sid || !token || !from) {
    return { ok: false, error: "Twilio env vars required" };
  }

  const body = new URLSearchParams({
    To: phone,
    From: from,
    Body: message.slice(0, 1500),
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return { ok: false, error: `Twilio ${response.status}: ${err.slice(0, 200)}` };
  }
  return { ok: true };
}

export async function dispatchAlert(payload: AlertPayload) {
  const settings = await getAlertSettings();
  const channels = payload.channels ?? (["email", "teams", "sms"] as AlertChannel[]);
  const results: Record<string, { ok: boolean; error?: string }> = {};

  const text = `${payload.title}\n\n${payload.message}${payload.link ? `\n\n${payload.link}` : ""}`;

  if (channels.includes("email") && settings.emailEnabled && settings.emailRecipients.length > 0) {
    if (!isResendConfigured()) {
      results.email = { ok: false, error: "Resend not configured" };
    } else {
      const html = `<h2>${payload.title}</h2><p>${payload.message.replace(/\n/g, "<br>")}</p>${payload.link ? `<p><a href="${payload.link}">View details</a></p>` : ""}`;
      results.email = await sendEmail(
        settings.emailRecipients,
        `[${siteConfig.shortName}] ${payload.title}`,
        html,
        text
      );
    }
  }

  if (channels.includes("teams") && settings.teamsEnabled && settings.teamsWebhookUrl) {
    results.teams = await sendTeams(settings.teamsWebhookUrl, payload);
  }

  if (channels.includes("sms") && settings.smsEnabled && settings.smsPhone) {
    if (!isTwilioConfigured()) {
      results.sms = { ok: false, error: "Twilio not configured" };
    } else {
      results.sms = await sendSms(settings.smsPhone, text);
    }
  }

  return results;
}

export async function sendTestAlert() {
  return dispatchAlert({
    title: "Test alert",
    message: "This is a test notification from your Apexweb CMS alert settings.",
    severity: "info",
    channels: ["email", "teams", "sms"],
  });
}
