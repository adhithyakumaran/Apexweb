export {
  activityActionLabels,
  getActivityLogStats,
  listCmsActivityLogs,
  logCmsActivity,
} from "@/lib/cms/activity-log";

export function isSentryConfigured() {
  return Boolean(process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim());
}
