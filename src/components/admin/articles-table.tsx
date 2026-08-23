"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCmsTemplate, type CmsTemplateId } from "@/lib/cms/templates";

type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  cmsTemplate: string;
  status: "draft" | "published";
  updatedAt?: string | null;
  publishedAt: string;
};

type ArticlesTableProps = {
  articles: ArticleRow[];
};

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(article: ArticleRow) {
    const confirmed = window.confirm(`Delete "${article.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(article.id);
    const response = await fetch(`/api/cms/articles/${article.id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!response.ok) {
      alert("Failed to delete article");
      return;
    }

    router.refresh();
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-sm font-medium">No articles yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first article with one of five templates.
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/articles/new">New article</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border/70 bg-surface/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Template</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {articles.map((article) => {
              const template = getCmsTemplate(article.cmsTemplate as CmsTemplateId);
              return (
                <tr key={article.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{article.title}</p>
                    <p className="text-xs text-muted-foreground">/{article.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {template?.label ?? article.cmsTemplate}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={article.status === "published" ? "success" : "warning"}>
                      {article.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(article.updatedAt ?? article.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {article.status === "published" && (
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link href={`/articles/${article.slug}`} target="_blank">
                            <ExternalLink className="size-4" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        disabled={deletingId === article.id}
                        onClick={() => handleDelete(article)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
