import type { Metadata } from "next";
import { ArticlesHub } from "@/components/articles/articles-hub";
import { getAllArticles } from "@/lib/articles";
import { buildArticlesHubMetadata } from "@/lib/articles/seo";

export const metadata: Metadata = buildArticlesHubMetadata();

export default function ArticlesPage() {
  const allArticles = getAllArticles();

  return <ArticlesHub articles={allArticles} />;
}
