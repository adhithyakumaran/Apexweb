import type { NextConfig } from "next";
import { getR2PublicHostname } from "@/lib/cms/r2";

const r2Hostname = getR2PublicHostname();

const nextConfig: NextConfig = {
  images: r2Hostname
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: r2Hostname,
            pathname: "/**",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
