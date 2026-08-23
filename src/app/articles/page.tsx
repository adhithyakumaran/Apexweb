import type { Metadata } from "next";
import { ArticlesHub } from "@/components/articles/articles-hub";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles & Case Studies",
  description:
    "Apex Node knowledge hub — articles, case studies, insights, and agent spotlights on enterprise QA automation.",
};

export default function ArticlesPage() {
  const allArticles = getAllArticles();

  return <ArticlesHub articles={allArticles} />;
}
