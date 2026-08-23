import type { Metadata } from "next";
import type { Article } from "@/config/articles";
import { siteConfig } from "@/config/site";

export function getArticleUrl(slug: string): string {
  return `${siteConfig.url}/articles/${slug}`;
}

export function buildArticleMetadata(article: Article): Metadata {
  const url = getArticleUrl(article.slug);

  const ogImage = article.heroImageUrl
    ? [{ url: article.heroImageUrl, alt: article.title }]
    : undefined;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      url,
      siteName: siteConfig.name,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.heroImageUrl ? [article.heroImageUrl] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildArticlesHubMetadata(): Metadata {
  const url = `${siteConfig.url}/articles`;

  return {
    title: "Articles & Case Studies",
    description:
      "Insights on agentic QA, enterprise testing strategy, and real outcomes from Apex Node customers.",
    openGraph: {
      title: "Articles & Case Studies | Apex Node Technologies",
      description:
        "Insights on agentic QA, enterprise testing strategy, and real outcomes from Apex Node customers.",
      url,
      siteName: siteConfig.name,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getArticleUrl(article.slug),
    },
    keywords: article.tags.join(", "),
    ...(article.heroImageUrl ? { image: [article.heroImageUrl] } : {}),
  };
}
