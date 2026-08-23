export type AlertChannel = "email" | "teams" | "sms";

export type AlertSettings = {
  emailEnabled: boolean;
  emailRecipients: string[];
  teamsEnabled: boolean;
  teamsWebhookUrl: string;
  smsEnabled: boolean;
  smsPhone: string;
  digestEnabled: boolean;
  digestDay: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  digestHourUtc: number;
  alertOnUptimeFailure: boolean;
  alertOnDeploy: boolean;
  alertOnError: boolean;
  updatedAt: string | null;
};

export const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  emailEnabled: false,
  emailRecipients: [],
  teamsEnabled: false,
  teamsWebhookUrl: "",
  smsEnabled: false,
  smsPhone: "",
  digestEnabled: false,
  digestDay: "monday",
  digestHourUtc: 6,
  alertOnUptimeFailure: true,
  alertOnDeploy: false,
  alertOnError: true,
  updatedAt: null,
};

export type AlertPayload = {
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  link?: string;
  channels?: AlertChannel[];
};
