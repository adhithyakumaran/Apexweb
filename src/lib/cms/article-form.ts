import type { ArticleCategory, ArticleContent } from "@/config/articles";
import { getCmsTemplate, type CmsTemplateId } from "@/lib/cms/templates";

export type ArticleFormState = {
  id?: number;
  slug: string;
  title: string;
  hook: string;
  excerpt: string;
  cmsTemplate: CmsTemplateId;
  category: ArticleCategory;
  topic: string;
  readTime: number;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  featured: boolean;
  tags: string;
  coverAccent: string;
  heroImageUrl: string;
  attachmentUrl: string;
  attachmentName: string;
  status: "draft" | "published";
  intro: string;
  pullQuote: string;
  sectionsJson: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  metricsJson: string;
  takeaways: string;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function defaultSections() {
  return JSON.stringify(
    [{ heading: "Overview", body: ["Add your first paragraph here."] }],
    null,
    2
  );
}

function defaultMetrics() {
  return JSON.stringify([{ label: "Metric", value: "Value" }], null, 2);
}

export function createEmptyArticleForm(): ArticleFormState {
  const now = new Date().toISOString().slice(0, 10);
  return {
    slug: "",
    title: "",
    hook: "",
    excerpt: "",
    cmsTemplate: "text-only",
    category: "articles",
    topic: "General",
    readTime: 5,
    publishedAt: now,
    authorName: "Apex Node Editorial",
    authorRole: "Content Team",
    featured: false,
    tags: "",
    coverAccent: "from-brand-orange/15 via-brand-orange/5 to-transparent",
    heroImageUrl: "",
    attachmentUrl: "",
    attachmentName: "",
    status: "draft",
    intro: "",
    pullQuote: "",
    sectionsJson: defaultSections(),
    client: "",
    industry: "",
    challenge: "",
    solution: "",
    metricsJson: defaultMetrics(),
    takeaways: "",
  };
}

export type CmsRowLike = {
  id: number;
  slug: string;
  title: string;
  hook: string;
  excerpt: string;
  cmsTemplate: string;
  category: string;
  topic: string;
  readTime: number;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  featured: boolean;
  tags: string[];
  coverAccent: string;
  heroImageUrl?: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  status: string;
  content: ArticleContent;
};

export function articleRowToForm(row: CmsRowLike): ArticleFormState {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    hook: row.hook,
    excerpt: row.excerpt,
    cmsTemplate: row.cmsTemplate as CmsTemplateId,
    category: row.category as ArticleCategory,
    topic: row.topic,
    readTime: row.readTime,
    publishedAt: row.publishedAt.slice(0, 10),
    authorName: row.authorName,
    authorRole: row.authorRole,
    featured: row.featured,
    tags: row.tags.join(", "),
    coverAccent: row.coverAccent,
    heroImageUrl: row.heroImageUrl ?? "",
    attachmentUrl: row.attachmentUrl ?? "",
    attachmentName: row.attachmentName ?? "",
    status: row.status as "draft" | "published",
    intro: row.content.intro,
    pullQuote: row.content.pullQuote ?? "",
    sectionsJson: JSON.stringify(row.content.sections ?? [], null, 2),
    client: row.content.client ?? "",
    industry: row.content.industry ?? "",
    challenge: row.content.challenge ?? "",
    solution: row.content.solution ?? "",
    metricsJson: JSON.stringify(row.content.results ?? [], null, 2),
    takeaways: (row.content.keyTakeaways ?? []).join("\n"),
  };
}

export function buildArticlePayload(form: ArticleFormState) {
  const template = getCmsTemplate(form.cmsTemplate);
  let sections: ArticleContent["sections"] = [];
  let results: ArticleContent["results"] = [];

  try {
    sections = JSON.parse(form.sectionsJson) as ArticleContent["sections"];
  } catch {
    throw new Error("Sections must be valid JSON");
  }

  if (template?.fields.metrics) {
    try {
      results = JSON.parse(form.metricsJson) as ArticleContent["results"];
    } catch {
      throw new Error("Metrics must be valid JSON");
    }
  }

  const content: ArticleContent = {
    intro: form.intro,
    sections,
    pullQuote: form.pullQuote || undefined,
    client: form.client || undefined,
    industry: form.industry || undefined,
    challenge: form.challenge || undefined,
    solution: form.solution || undefined,
    results: template?.fields.metrics ? results : undefined,
    keyTakeaways: template?.fields.takeaways
      ? form.takeaways
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : undefined,
  };

  return {
    slug: form.slug.trim(),
    title: form.title.trim(),
    hook: form.hook.trim(),
    excerpt: form.excerpt.trim(),
    cmsTemplate: form.cmsTemplate,
    displayTemplate: template?.displayTemplate ?? "standard",
    category: form.category,
    topic: form.topic.trim(),
    readTime: Number(form.readTime) || 5,
    publishedAt: new Date(form.publishedAt).toISOString(),
    authorName: form.authorName.trim(),
    authorRole: form.authorRole.trim(),
    featured: form.featured,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    coverAccent: form.coverAccent.trim(),
    heroImageUrl: form.heroImageUrl.trim() || null,
    attachmentUrl: form.attachmentUrl.trim() || null,
    attachmentName: form.attachmentName.trim() || null,
    content,
    status: form.status,
  };
}
