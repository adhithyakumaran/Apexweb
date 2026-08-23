import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Plus, Sparkles } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticlesTable } from "@/components/admin/articles-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCmsStats, listCmsArticles } from "@/lib/cms/articles-repository";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [stats, articles] = await Promise.all([getCmsStats(), listCmsArticles(true)]);
  const recent = articles.slice(0, 6);

  return (
    <AdminShell
      title="Dashboard"
      description="Manage articles, templates, and publishing workflow. This area is private and not indexed by search engines."
      actions={
        <Button asChild>
          <Link href="/admin/articles/new" className="gap-2">
            <Plus className="size-4" />
            New article
          </Link>
        </Button>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant={isDatabaseConfigured() ? "success" : "warning"}>
          {isDatabaseConfigured() ? "Neon database connected" : "Local file store (set DATABASE_URI for Neon)"}
        </Badge>
        <Badge variant="secondary">5 article templates</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total articles", value: stats.total, icon: FileText },
          { label: "Published", value: stats.published, icon: Sparkles },
          { label: "Drafts", value: stats.drafts, icon: FileText },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Recent articles</h2>
          <Link href="/admin/articles" className="text-sm font-medium text-brand-orange hover:underline">
            View all
          </Link>
        </div>
        <ArticlesTable
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
