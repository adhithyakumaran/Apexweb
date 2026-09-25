export function getPostHogProjectToken() {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ||
    ""
  );
}

export function getPostHogHost() {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
}

export function getPostHogPersonalApiKey() {
  return process.env.POSTHOG_PERSONAL_API_KEY?.trim() || "";
}

export function getPostHogProjectId() {
  return process.env.POSTHOG_PROJECT_ID?.trim() || "";
}

export function isPostHogCaptureConfigured() {
  return Boolean(getPostHogProjectToken());
}

export function isPostHogQueryConfigured() {
  return Boolean(getPostHogPersonalApiKey() && getPostHogProjectId());
}
