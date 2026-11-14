import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${siteConfig.url}/sitemap.xml`,
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/cms", "/development", "/development/"],
    },
  };
}
