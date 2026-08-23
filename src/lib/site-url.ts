import { siteConfig } from "@/config/site";

/** Canonical public site URL for crawls, OG, and chatbot context. */
export function getSiteBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  const configured = siteConfig.url?.trim();
  if (configured && !configured.includes("example.com")) {
    return configured.replace(/\/$/, "");
  }

  return "https://apexweb-three.vercel.app";
}
