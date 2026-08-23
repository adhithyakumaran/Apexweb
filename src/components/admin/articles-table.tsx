"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, GitBranch, Pencil, Trash2 } from "lucide-react";
import {
  AdminEmptyState,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminStatusDot,
} from "@/components/admin/admin-ui";
import { getCmsTemplate, type CmsTemplateId } from "@/lib/cms/templates";
import { cn } from "@/lib/utils";

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
  compact?: boolean;
};

function relativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ArticlesTable({ articles, compact = false }: ArticlesTableProps) {
  const router = useRouter();
  const [rows, setRows] = useState(articles);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setRows(articles);
  }, [articles]);

  async function handlePublish(article: ArticleRow) {
    setError("");
    setBusyId(article.id);

    try {
      const response = await fetch(`/api/cms/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status: "published" }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? `Publish failed (${response.status})`);
        return;
      }

      setRows((current) =>
        current.map((row) =>
          row.id === article.id ? { ...row, status: "published" as const } : row
        )
      );
      router.refresh();
    } catch {
      setError("Publish failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(article: ArticleRow) {
    const confirmed = window.confirm(`Delete "${article.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setBusyId(article.id);
    setError("");

    try {
      const response = await fetch(`/api/cms/articles/${article.id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? `Delete failed (${response.status})`);
        return;
      }

      setRows((current) => current.filter((row) => row.id !== article.id));
      router.refresh();
    } catch {
      setError("Delete failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <AdminEmptyState
        title="No articles"
        description="Create your first article to get started."
        action={<AdminPrimaryButton href="/admin/articles/new">Create article</AdminPrimaryButton>}
      />
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md border border-[#e00]/30 px-3 py-2 text-[13px] text-[#ff6666]">
          {error}
        </p>
      )}

      {!compact && (
        <div className="flex flex-wrap items-center gap-2 border-b border-[#333] pb-4">
          <span className="text-[13px] text-[#666]">{rows.length} articles</span>
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-[#333]">
        {rows.map((article, index) => {
          const template = getCmsTemplate(article.cmsTemplate as CmsTemplateId);
          const isBusy = busyId === article.id;
          const updated = article.updatedAt ?? article.publishedAt;

          return (
            <div
              key={article.id}
              className={cn(
                "group flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-[#0a0a0a]",
                index !== rows.length - 1 && "border-b border-[#333]"
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-[13px] font-medium text-[#ededed] hover:underline"
                  >
                    {article.title}
                  </Link>
                  {article.status === "published" && (
                    <span className="rounded border border-[#0070f3]/40 bg-[#0070f3]/10 px-1.5 py-0.5 text-[11px] font-medium text-[#3291ff]">
                      Production
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[13px]">
                <AdminStatusDot
                  tone={article.status === "published" ? "success" : "warning"}
                >
                  {article.status === "published" ? "Ready" : "Draft"}
                </AdminStatusDot>

                <span className="hidden items-center gap-1.5 text-[#666] sm:inline-flex">
                  <GitBranch className="size-3.5" />
                  <span className="font-mono text-[12px]">{template?.label ?? article.cmsTemplate}</span>
                </span>

                <span className="hidden font-mono text-[12px] text-[#666] md:inline">
                  /articles/{article.slug}
                </span>

                <span className="tabular-nums text-[#666]">{relativeTime(updated)}</span>

                <div className="flex items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                  {article.status === "draft" && (
                    <AdminSecondaryButton
                      onClick={() => handlePublish(article)}
                      className={cn("h-7 px-2 text-[12px]", isBusy && "opacity-50")}
                    >
                      Publish
                    </AdminSecondaryButton>
                  )}
                  {article.status === "published" && (
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="inline-flex size-7 items-center justify-center rounded text-[#a1a1a1] hover:bg-[#111] hover:text-white"
                      title="View live"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="inline-flex size-7 items-center justify-center rounded text-[#a1a1a1] hover:bg-[#111] hover:text-white"
                    title="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-[#a1a1a1] hover:bg-[#111] hover:text-[#ff6666] disabled:opacity-50"
                    disabled={isBusy}
                    onClick={() => handleDelete(article)}
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
