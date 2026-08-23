export {
  getPostHogHost,
  getPostHogPersonalApiKey,
  getPostHogProjectId,
  getPostHogProjectToken,
  isPostHogCaptureConfigured,
  isPostHogQueryConfigured,
} from "@/lib/analytics/posthog-config";

export { getVisitorAnalytics } from "@/lib/analytics/posthog-query";
export type {
  VisitorAnalyticsData,
  VisitorKpis,
  RankedRow,
  TrendPoint,
  WebVitals,
} from "@/lib/analytics/posthog-query";
