import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Plus, Radio, Sparkles } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminStatCard,
  AdminStatusPill,
  AdminStatusStrip,
} from "@/components/admin/admin-ui";
import { ArticlesTable } from "@/components/admin/articles-table";
import { Button } from "@/components/ui/button";
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
        <Button asChild className="rounded-lg shadow-sm">
          <Link href="/admin/articles/new" className="gap-2">
            <Plus className="size-4" />
            New article
          </Link>
        </Button>
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
        <span className="ml-auto hidden text-xs text-neutral-500 sm:inline">
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Recent articles</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Quick access to your latest drafts and published pieces.
            </p>
          </div>
          <Link
            href="/admin/articles"
            className="text-sm font-medium text-neutral-700 transition-colors hover:text-brand-orange"
          >
            View all
          </Link>
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
