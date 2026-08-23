import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticlesTable } from "@/components/admin/articles-table";
import { AdminPrimaryButton } from "@/components/admin/admin-ui";
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
      actions={
        <AdminPrimaryButton href="/admin/articles/new">
          <Plus className="size-3.5" />
          New article
        </AdminPrimaryButton>
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
