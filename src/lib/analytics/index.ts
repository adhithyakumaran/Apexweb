export { getAnalyticsDashboardData } from "@/lib/analytics/dashboard";
export type { AnalyticsDashboardData } from "@/lib/analytics/dashboard";

export function isPostHogConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim());
}
