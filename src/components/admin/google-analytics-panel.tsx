"use client";

import { useState } from "react";
import {
  AdminAlert,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminSecondaryButton,
  AdminStatusDot,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { adminClasses } from "@/components/admin/admin-theme";
import { ExternalLink } from "lucide-react";

type GoogleAnalyticsPanelProps = {
  url: string;
  configured: boolean;
};

export function GoogleAnalyticsPanel({ url, configured }: GoogleAnalyticsPanelProps) {
  const [embedOpen, setEmbedOpen] = useState(configured);

  return (
    <div className="space-y-6">
      <AdminStatusStrip>
        <AdminStatusDot tone={configured ? "success" : "warning"}>
          {configured ? "Report URL configured" : "Awaiting report link"}
        </AdminStatusDot>
      </AdminStatusStrip>

      {!configured ? (
        <AdminAlert tone="info">
          <p>
            Paste your Google Analytics report URL in Vercel as{" "}
            <code className="text-[#ededed]">NEXT_PUBLIC_GA_REPORT_URL</code> (Looker Studio,
            GA4 explore view, or any share link). The sidebar will open it here once set.
          </p>
        </AdminAlert>
      ) : (
        <AdminAlert tone="info">
          <p>
            Opening <span className="text-[#ededed]">{url}</span>. Use the button below if the embed
            is blocked by Google&apos;s frame policy.
          </p>
        </AdminAlert>
      )}

      <AdminPanel>
        <AdminPanelHeader
          title="GA4 dashboard"
          description="Embedded when the URL allows iframes; otherwise open in a new tab."
          action={
            configured ? (
              <div className="flex gap-2">
                <AdminSecondaryButton onClick={() => setEmbedOpen((v) => !v)}>
                  {embedOpen ? "Hide embed" : "Show embed"}
                </AdminSecondaryButton>
                <a href={url} target="_blank" rel="noopener noreferrer" className={adminClasses.primaryBtn + " inline-flex items-center gap-2"}>
                  <ExternalLink className="size-3.5" />
                  Open GA
                </a>
              </div>
            ) : undefined
          }
        />
        <AdminPanelBody>
          {configured && embedOpen ? (
            <div className="overflow-hidden rounded border border-[#333] bg-[#0a0a0a]">
              <iframe
                title="Google Analytics"
                src={url}
                className="h-[min(70vh,720px)] w-full"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          ) : (
            <div className="rounded border border-dashed border-[#333] px-6 py-16 text-center">
              <p className="text-[13px] font-medium text-[#ededed]">
                {configured ? "Embed hidden" : "No Google Analytics URL yet"}
              </p>
              <p className="mt-2 text-[13px] text-[#666]">
                Share your GA href and we&apos;ll wire it here, or set{" "}
                <code className="text-[#a1a1a1]">NEXT_PUBLIC_GA_REPORT_URL</code> in environment
                variables.
              </p>
              {configured && (
                <div className="mt-4">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-[#a1a1a1] underline-offset-4 hover:text-white hover:underline"
                  >
                    Open report in new tab
                  </a>
                </div>
              )}
            </div>
          )}
        </AdminPanelBody>
      </AdminPanel>
    </div>
  );
}
