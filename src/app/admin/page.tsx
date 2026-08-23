import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Radio, Sparkles, FileText } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminLink,
  AdminPrimaryButton,
  AdminSectionHeading,
  AdminStatCard,
  AdminStatusPill,
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
      description="Monitor publishing activity, system connectivity, and your latest content updates."
      actions={
        <AdminPrimaryButton href="/admin/articles/new">
          <Plus className="size-4" />
          New article
        </AdminPrimaryButton>
      }
    >
      <AdminStatusStrip className="mb-6">
        <AdminStatusPill tone={dbOk ? "success" : "danger"}>
          {dbOk ? "Neon connected" : "Database offline"}
        </AdminStatusPill>
        <AdminStatusPill tone={r2Ok ? "success" : "warning"}>
          {r2Ok ? "R2 storage ready" : "Uploads unavailable"}
        </AdminStatusPill>
        <AdminStatusPill tone="neutral">5 templates</AdminStatusPill>
        <span className="ml-auto hidden text-xs text-[#6b7280] sm:inline">
          Private workspace · not indexed
        </span>
      </AdminStatusStrip>

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total articles" value={stats.total} icon={FileText} />
        <AdminStatCard
          label="Published"
          value={stats.published}
          hint="Live on /articles"
          icon={Radio}
        />
        <AdminStatCard label="Drafts" value={stats.drafts} hint="Hidden from public" icon={Sparkles} />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <AdminSectionHeading
            title="Recent articles"
            description="Quick access to your latest drafts and published pieces."
          />
          <div className="flex items-center gap-4">
            <AdminLink href="/admin/analytics">Analytics</AdminLink>
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
