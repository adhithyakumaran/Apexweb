import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleEditor } from "@/components/admin/article-editor";
import { articleRowToForm } from "@/lib/cms/article-form";
import { getCmsArticleById } from "@/lib/cms/articles-repository";

export const metadata: Metadata = {
  title: "Edit Article",
  robots: { index: false, follow: false },
};

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) notFound();

  const article = await getCmsArticleById(articleId);
  if (!article) notFound();

  return (
    <AdminShell title="Edit article" description={`Editing “${article.title}”`}>
      <ArticleEditor mode="edit" initial={articleRowToForm(article)} />
    </AdminShell>
  );
}
