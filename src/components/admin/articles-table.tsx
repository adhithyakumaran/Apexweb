"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, Pencil, Send, Trash2 } from "lucide-react";
import {
  AdminEmptyState,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminPrimaryButton,
  AdminStatusPill,
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
        title="No articles yet"
        description="Create your first article with one of five professional templates."
        action={<AdminPrimaryButton href="/admin/articles/new">Create article</AdminPrimaryButton>}
      />
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <AdminPanel>
        {!compact && (
          <AdminPanelHeader
            title="All articles"
            description="Drafts stay private until you publish them to the live site."
          />
        )}
        <AdminPanelBody className={cn("p-0", compact && "p-0")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/[0.06] bg-[#25262c] text-[0.68rem] uppercase tracking-[0.14em] text-[#9CA3AF]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Article</th>
                  <th className="px-4 py-3 font-semibold">Template</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {rows.map((article) => {
                  const template = getCmsTemplate(article.cmsTemplate as CmsTemplateId);
                  const isBusy = busyId === article.id;

                  return (
                    <tr
                      key={article.id}
                      className="transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-white">{article.title}</p>
                        <p className="mt-0.5 font-mono text-xs text-[#6b7280]">
                          /articles/{article.slug}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-[#9CA3AF]">
                        {template?.label ?? article.cmsTemplate}
                      </td>
                      <td className="px-4 py-3.5">
                        <AdminStatusPill
                          tone={article.status === "published" ? "success" : "warning"}
                        >
                          {article.status}
                        </AdminStatusPill>
                      </td>
                      <td className="px-4 py-3.5 tabular-nums text-[#9CA3AF]">
                        {new Date(article.updatedAt ?? article.publishedAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-0.5">
                          {article.status === "draft" && (
                            <button
                              type="button"
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-3 text-xs font-medium text-blue-300 transition-colors hover:bg-[#3B82F6]/20 disabled:opacity-50"
                              disabled={isBusy}
                              onClick={() => handlePublish(article)}
                            >
                              <Send className="size-3.5" />
                              Publish
                            </button>
                          )}
                          {article.status === "published" && (
                            <Link
                              href={`/articles/${article.slug}`}
                              target="_blank"
                              className="inline-flex size-9 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-white/[0.05] hover:text-white"
                            >
                              <ExternalLink className="size-4" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="inline-flex size-9 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-white/[0.05] hover:text-white"
                          >
                            <Pencil className="size-4" />
                          </Link>
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                            disabled={isBusy}
                            onClick={() => handleDelete(article)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AdminPanelBody>
      </AdminPanel>
    </div>
  );
}
