import {
  isSentryApiConfigured,
  isSentryDsnConfigured,
} from "@/lib/monitoring/sentry-config";

export {
  activityActionLabels,
  getActivityLogStats,
  listCmsActivityLogs,
  logCmsActivity,
} from "@/lib/cms/activity-log";

export { getPipelineLogs } from "@/lib/monitoring/pipeline-logs";

export {
  pipelineLogsToCsv,
  pipelineLogsToPrintHtml,
  type PipelineLogCategory,
  type PipelineLogEntry,
  type PipelineLogsData,
  type PipelineLogsKpis,
  type PipelineLogsPeriod,
} from "@/lib/monitoring/pipeline-logs-shared";

export { getSentrySnapshot } from "@/lib/monitoring/sentry-query";

export {
  getSentryAuthToken,
  getSentryOrg,
  getSentryProject,
  isSentryApiConfigured,
  isSentryDsnConfigured,
} from "@/lib/monitoring/sentry-config";

export function isSentryConfigured() {
  return isSentryDsnConfigured() || isSentryApiConfigured();
}

export function getGoogleAnalyticsUrl() {
  return process.env.NEXT_PUBLIC_GA_REPORT_URL?.trim() ?? "";
}

export function isGoogleAnalyticsConfigured() {
  return Boolean(getGoogleAnalyticsUrl());
}
