import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticlesTable } from "@/components/admin/articles-table";
import { Button } from "@/components/ui/button";
import { listCmsArticles } from "@/lib/cms/articles-repository";

export const metadata: Metadata = {
  title: "Articles",
  robots: { index: false, follow: false },
};

export default async function AdminArticlesPage() {
  const articles = await listCmsArticles(true);

  return (
    <AdminShell
      title="Articles"
      description="Create, edit, publish, and delete articles. Draft articles are hidden from the public site — set status to Published to go live."
      actions={
        <Button asChild>
          <Link href="/admin/articles/new" className="gap-2">
            <Plus className="size-4" />
            New article
          </Link>
        </Button>
      }
    >
      <ArticlesTable
        articles={articles.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          cmsTemplate: row.cmsTemplate,
          status: row.status as "draft" | "published",
          updatedAt: row.updatedAt,
          publishedAt: row.publishedAt,
        }))}
      />
    </AdminShell>
  );
}
