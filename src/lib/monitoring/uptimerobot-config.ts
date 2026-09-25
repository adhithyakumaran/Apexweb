export function getUptimeRobotApiKey() {
  return process.env.UPTIMEROBOT_API_KEY?.trim() ?? "";
}

export function getUptimeRobotDashboardUrl() {
  return (
    process.env.NEXT_PUBLIC_UPTIMEROBOT_DASHBOARD_URL?.trim() ||
    "https://dashboard.uptimerobot.com/monitors"
  );
}

export function getUptimeRobotStatusPageUrl() {
  return process.env.NEXT_PUBLIC_UPTIMEROBOT_STATUS_PAGE_URL?.trim() ?? "";
}

export function isUptimeRobotApiConfigured() {
  return Boolean(getUptimeRobotApiKey());
}

export function isUptimeRobotStatusPageConfigured() {
  return Boolean(getUptimeRobotStatusPageUrl());
}
