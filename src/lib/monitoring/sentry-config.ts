export function getSentryAuthToken() {
  return process.env.SENTRY_AUTH_TOKEN?.trim() ?? "";
}

export function getSentryOrg() {
  return process.env.SENTRY_ORG?.trim() ?? "";
}

export function getSentryProject() {
  return process.env.SENTRY_PROJECT?.trim() ?? "";
}

export function isSentryApiConfigured() {
  return Boolean(getSentryAuthToken() && getSentryOrg() && getSentryProject());
}

export function isSentryDsnConfigured() {
  return Boolean(process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim());
}
