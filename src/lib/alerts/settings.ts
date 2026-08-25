/**
 * Alert settings persistence — Neon singleton or local JSON fallback.
 *
 * Stores email recipients, Teams webhook URL, SMS number, digest schedule,
 * and per-event toggles (uptime failure, deploy, error). Same dual-store
 * pattern as articles-repository.ts.
 */
import { promises as fs } from "fs";
import path from "path";
import { eq } from "drizzle-orm";
import { canUseLocalFileStore } from "@/lib/cms/storage";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { cmsAlertSettings } from "@/lib/db/schema";
import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "@/lib/alerts/shared";

const storePath = path.join(process.cwd(), "data", "cms-alerts.json");

function isMissingTableError(error: unknown) {
  const code =
    (error as { code?: string })?.code ??
    (error as { cause?: { code?: string } })?.cause?.code;
  return code === "42P01";
}

function normalizeSettings(input: Partial<AlertSettings>): AlertSettings {
  return {
    ...DEFAULT_ALERT_SETTINGS,
    ...input,
    emailRecipients: Array.isArray(input.emailRecipients)
      ? input.emailRecipients.filter(Boolean)
      : typeof input.emailRecipients === "string"
        ? (input.emailRecipients as string).split(",").map((s) => s.trim()).filter(Boolean)
        : DEFAULT_ALERT_SETTINGS.emailRecipients,
    digestHourUtc: Math.min(23, Math.max(0, input.digestHourUtc ?? DEFAULT_ALERT_SETTINGS.digestHourUtc)),
    updatedAt: input.updatedAt ?? new Date().toISOString(),
  };
}

async function readFileStore(): Promise<AlertSettings> {
  if (!canUseLocalFileStore()) return DEFAULT_ALERT_SETTINGS;

  try {
    const raw = await fs.readFile(storePath, "utf8");
    return normalizeSettings(JSON.parse(raw) as Partial<AlertSettings>);
  } catch {
    return DEFAULT_ALERT_SETTINGS;
  }
}

async function writeFileStore(settings: AlertSettings) {
  if (!canUseLocalFileStore()) return;
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(settings, null, 2));
}

function rowToSettings(row: typeof cmsAlertSettings.$inferSelect): AlertSettings {
  return normalizeSettings({
    emailEnabled: row.emailEnabled,
    emailRecipients: row.emailRecipients ?? [],
    teamsEnabled: row.teamsEnabled,
    teamsWebhookUrl: row.teamsWebhookUrl ?? "",
    smsEnabled: row.smsEnabled,
    smsPhone: row.smsPhone ?? "",
    digestEnabled: row.digestEnabled,
    digestDay: row.digestDay as AlertSettings["digestDay"],
    digestHourUtc: row.digestHourUtc,
    alertOnUptimeFailure: row.alertOnUptimeFailure,
    alertOnDeploy: row.alertOnDeploy,
    alertOnError: row.alertOnError,
    updatedAt: row.updatedAt,
  });
}

export async function getAlertSettings(): Promise<AlertSettings> {
  if (!isDatabaseConfigured()) return readFileStore();

  const db = getDb();
  if (!db) return readFileStore();

  try {
    const rows = await db.select().from(cmsAlertSettings).limit(1);
    if (!rows[0]) return DEFAULT_ALERT_SETTINGS;
    return rowToSettings(rows[0]);
  } catch (error) {
    if (isMissingTableError(error)) return readFileStore();
    throw error;
  }
}

export async function saveAlertSettings(input: Partial<AlertSettings>): Promise<AlertSettings> {
  const current = await getAlertSettings();
  const next = normalizeSettings({ ...current, ...input, updatedAt: new Date().toISOString() });

  if (!isDatabaseConfigured()) {
    await writeFileStore(next);
    return next;
  }

  const db = getDb();
  if (!db) {
    await writeFileStore(next);
    return next;
  }

  try {
    const existing = await db.select().from(cmsAlertSettings).limit(1);
    if (existing[0]) {
      await db
        .update(cmsAlertSettings)
        .set({
          emailEnabled: next.emailEnabled,
          emailRecipients: next.emailRecipients,
          teamsEnabled: next.teamsEnabled,
          teamsWebhookUrl: next.teamsWebhookUrl,
          smsEnabled: next.smsEnabled,
          smsPhone: next.smsPhone,
          digestEnabled: next.digestEnabled,
          digestDay: next.digestDay,
          digestHourUtc: next.digestHourUtc,
          alertOnUptimeFailure: next.alertOnUptimeFailure,
          alertOnDeploy: next.alertOnDeploy,
          alertOnError: next.alertOnError,
          updatedAt: next.updatedAt,
        })
        .where(eq(cmsAlertSettings.id, existing[0].id));
    } else {
      await db.insert(cmsAlertSettings).values({
        emailEnabled: next.emailEnabled,
        emailRecipients: next.emailRecipients,
        teamsEnabled: next.teamsEnabled,
        teamsWebhookUrl: next.teamsWebhookUrl,
        smsEnabled: next.smsEnabled,
        smsPhone: next.smsPhone,
        digestEnabled: next.digestEnabled,
        digestDay: next.digestDay,
        digestHourUtc: next.digestHourUtc,
        alertOnUptimeFailure: next.alertOnUptimeFailure,
        alertOnDeploy: next.alertOnDeploy,
        alertOnError: next.alertOnError,
        updatedAt: next.updatedAt,
      });
    }
    return next;
  } catch (error) {
    if (isMissingTableError(error)) {
      await writeFileStore(next);
      return next;
    }
    throw error;
  }
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.ALERT_FROM_EMAIL?.trim());
}

export function isTwilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_FROM_NUMBER?.trim()
  );
}
