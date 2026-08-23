import posthog from "posthog-js";

const token =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim() ||
  process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const host =
  process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";

if (token) {
  posthog.init(token, {
    api_host: host,
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    capture_performance: true,
    autocapture: true,
    before_send: (event) => {
      if (!event) return null;
      const url = String(event.properties?.$current_url ?? "");
      if (url.includes("/admin") || url.includes("/api/cms")) {
        return null;
      }
      return event;
    },
  });
}
