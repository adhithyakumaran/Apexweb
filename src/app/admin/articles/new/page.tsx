import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleEditor } from "@/components/admin/article-editor";
import { createEmptyArticleForm } from "@/lib/cms/article-form";

export const metadata: Metadata = {
  title: "New Article",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function NewArticlePage() {
  return (
    <AdminShell title="New article">
      <ArticleEditor mode="create" initial={createEmptyArticleForm()} />
    </AdminShell>
  );
}
