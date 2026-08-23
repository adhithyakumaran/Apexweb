import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminLink,
  AdminPrimaryButton,
  AdminSectionHeading,
  AdminStatCard,
  AdminStatusDot,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { ArticlesTable } from "@/components/admin/articles-table";
import { getCmsStats, listCmsArticles } from "@/lib/cms/articles-repository";
import { isR2Configured } from "@/lib/cms/r2";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [stats, articles] = await Promise.all([getCmsStats(), listCmsArticles(true)]);
  const recent = articles.slice(0, 6);
  const dbOk = isDatabaseConfigured();
  const r2Ok = isR2Configured();

  return (
    <AdminShell
      title="Overview"
      actions={
        <AdminPrimaryButton href="/admin/articles/new">
          <Plus className="size-3.5" />
          New article
        </AdminPrimaryButton>
      }
    >
      <AdminStatusStrip className="mb-6">
        <AdminStatusDot tone={dbOk ? "success" : "danger"}>
          {dbOk ? "Neon connected" : "Database offline"}
        </AdminStatusDot>
        <AdminStatusDot tone={r2Ok ? "success" : "warning"}>
          {r2Ok ? "R2 storage ready" : "Uploads unavailable"}
        </AdminStatusDot>
        <span className="text-[#666]">5 templates</span>
        <span className="ml-auto hidden text-[13px] text-[#666] sm:inline">
          Private · not indexed
        </span>
      </AdminStatusStrip>

      <div className="grid gap-px overflow-hidden rounded-md border border-[#333] sm:grid-cols-3">
        <AdminStatCard label="Total articles" value={stats.total} className="rounded-none border-0 border-r border-[#333] last:border-r-0" />
        <AdminStatCard label="Published" value={stats.published} hint="Live on /articles" className="rounded-none border-0 border-r border-[#333] last:border-r-0" />
        <AdminStatCard label="Drafts" value={stats.drafts} hint="Hidden from public" className="rounded-none border-0" />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <AdminSectionHeading title="Recent articles" />
          <div className="flex items-center gap-4">
            <AdminLink href="/admin/analytics">PostHog</AdminLink>
            <AdminLink href="/admin/analytics/google">Google Analytics</AdminLink>
            <AdminLink href="/admin/logs">Logs</AdminLink>
            <AdminLink href="/admin/articles">View all</AdminLink>
          </div>
        </div>
        <ArticlesTable
          compact
          articles={recent.map((row) => ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            cmsTemplate: row.cmsTemplate,
            status: row.status as "draft" | "published",
            updatedAt: row.updatedAt,
            publishedAt: row.publishedAt,
          }))}
        />
      </section>
    </AdminShell>
  );
}
