import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/articles/article-detail";
import { getRelatedArticles } from "@/lib/articles";
import { getAllArticles, getArticleBySlug } from "@/lib/articles/server";
import { articleJsonLd, buildArticleMetadata } from "@/lib/articles/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return buildArticleMetadata(article);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getAllArticles();
  const related = getRelatedArticles(article, allArticles);
  const jsonLd = articleJsonLd(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetail article={article} related={related} />
    </>
  );
}
