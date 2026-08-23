import type { Metadata } from "next";
import { ArticlesHub } from "@/components/articles/articles-hub";
import { getAllArticles } from "@/lib/articles/server";
import { buildArticlesHubMetadata } from "@/lib/articles/seo";

export const metadata: Metadata = buildArticlesHubMetadata();

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ArticlesPage() {
  const allArticles = await getAllArticles();

  return <ArticlesHub articles={allArticles} />;
}
