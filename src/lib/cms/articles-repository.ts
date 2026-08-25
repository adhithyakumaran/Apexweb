/**
 * Article persistence layer — Neon PostgreSQL with local JSON fallback.
 *
 * When DATABASE_URI is unset (local dev), articles read/write from
 * data/cms-articles.json. On Vercel, Neon is required.
 *
 * Seed articles from config/articles.ts are merged on first load.
 */
import { promises as fs } from "fs";
import path from "path";
import { eq, desc } from "drizzle-orm";
import type { Article, ArticleContent } from "@/config/articles";
import { articles as seedArticles } from "@/config/articles";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { canUseLocalFileStore } from "@/lib/cms/storage";
import { cmsArticles, type CmsArticleRow, type NewCmsArticleRow } from "@/lib/db/schema";
import type { CmsTemplateId } from "@/lib/cms/templates";

const storePath = path.join(process.cwd(), "data", "cms-articles.json");

export type ArticleInput = {
  slug: string;
  title: string;
  hook: string;
  excerpt: string;
  cmsTemplate: CmsTemplateId;
  displayTemplate: Article["template"];
  category: Article["category"];
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
  content: ArticleContent;
  status: "draft" | "published";
};

type FileStoreArticle = ArticleInput & { id: number; createdAt: string; updatedAt: string };

function rowToArticle(row: CmsArticleRow | FileStoreArticle): Article {
  return {
    slug: row.slug,
    title: row.title,
    hook: row.hook,
    excerpt: row.excerpt,
    template: row.displayTemplate as Article["template"],
    category: row.category as Article["category"],
    topic: row.topic,
    readTime: row.readTime,
    publishedAt: row.publishedAt,
    author: { name: row.authorName, role: row.authorRole },
    featured: row.featured,
    tags: row.tags ?? [],
    cover: { accent: row.coverAccent, label: row.cmsTemplate },
    heroImageUrl: row.heroImageUrl ?? null,
    attachmentUrl: row.attachmentUrl ?? null,
    attachmentName: row.attachmentName ?? null,
    content: row.content,
  };
}

async function readFileStore(): Promise<FileStoreArticle[]> {
  if (!canUseLocalFileStore()) return [];

  try {
    const raw = await fs.readFile(storePath, "utf8");
    return JSON.parse(raw) as FileStoreArticle[];
  } catch {
    try {
      await fs.mkdir(path.dirname(storePath), { recursive: true });
      await fs.writeFile(storePath, "[]");
    } catch {
      return [];
    }
    return [];
  }
}

async function writeFileStore(items: FileStoreArticle[]) {
  if (!canUseLocalFileStore()) {
    throw new Error("File storage is not available on Vercel. Set DATABASE_URI to use Neon.");
  }
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(items, null, 2));
}

async function seedFileStoreIfEmpty() {
  const items = await readFileStore();
  if (items.length > 0) return items;

  const seeded: FileStoreArticle[] = seedArticles.map((article, index) => ({
    id: index + 1,
    slug: article.slug,
    title: article.title,
    hook: article.hook,
    excerpt: article.excerpt,
    cmsTemplate: mapDisplayToCmsTemplate(article.template),
    displayTemplate: article.template,
    category: article.category,
    topic: article.topic,
    readTime: article.readTime,
    publishedAt: article.publishedAt,
    authorName: article.author.name,
    authorRole: article.author.role,
    featured: Boolean(article.featured),
    tags: article.tags,
    coverAccent: article.cover.accent,
    heroImageUrl: null,
    attachmentUrl: null,
    attachmentName: null,
    content: article.content,
    status: "published",
    createdAt: article.publishedAt,
    updatedAt: article.publishedAt,
  }));

  await writeFileStore(seeded);
  return seeded;
}

function mapDisplayToCmsTemplate(template: Article["template"]): CmsTemplateId {
  switch (template) {
    case "case-study":
      return "case-study";
    case "insight":
      return "insight-brief";
    case "agent-spotlight":
      return "image-text";
    default:
      return "text-only";
  }
}

function seedArticleToInput(article: Article): ArticleInput {
  return {
    slug: article.slug,
    title: article.title,
    hook: article.hook,
    excerpt: article.excerpt,
    cmsTemplate: mapDisplayToCmsTemplate(article.template),
    displayTemplate: article.template,
    category: article.category,
    topic: article.topic,
    readTime: article.readTime,
    publishedAt: article.publishedAt,
    authorName: article.author.name,
    authorRole: article.author.role,
    featured: Boolean(article.featured),
    tags: article.tags,
    coverAccent: article.cover.accent,
    heroImageUrl: null,
    attachmentUrl: null,
    attachmentName: null,
    content: article.content,
    status: "published",
  };
}

async function ensureCmsDatabaseSeeded() {
  if (!isDatabaseConfigured()) return;

  const db = getDb();
  if (!db) return;

  try {
    const existing = await db.select({ slug: cmsArticles.slug }).from(cmsArticles);
    const existingSlugs = new Set(existing.map((row) => row.slug));
    const missing = seedArticles.filter((article) => !existingSlugs.has(article.slug));
    if (missing.length === 0) return;

    const now = new Date().toISOString();
    for (const article of missing) {
      await db.insert(cmsArticles).values({
        ...seedArticleToInput(article),
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    if (isMissingTableError(error)) return;
    console.error("[cms] Failed to seed default articles:", error);
  }
}

function isMissingTableError(error: unknown) {
  const code =
    (error as { code?: string })?.code ??
    (error as { cause?: { code?: string } })?.cause?.code;
  return code === "42P01";
}

async function queryCmsArticlesFromDb(includeDrafts: boolean) {
  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db.select().from(cmsArticles).orderBy(desc(cmsArticles.updatedAt));
    return includeDrafts ? rows : rows.filter((row) => row.status === "published");
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn(
        "[cms] Table cms_articles does not exist yet. Run: npm run db:push (or execute drizzle/0000_init_cms_articles.sql in Neon)"
      );
      return [];
    }
    throw error;
  }
}

export async function listCmsArticles(includeDrafts = false) {
  if (isDatabaseConfigured()) {
    await ensureCmsDatabaseSeeded();
    return queryCmsArticlesFromDb(includeDrafts);
  }

  if (!canUseLocalFileStore()) {
    return [];
  }

  const items = await seedFileStoreIfEmpty();
  return includeDrafts ? items : items.filter((item) => item.status === "published");
}

export async function getPublishedArticlesMerged(): Promise<Article[]> {
  const cmsRows = await listPublishedCmsArticles();
  const cmsArticlesMapped = cmsRows.map((row) => rowToArticle(row as CmsArticleRow));
  const cmsSlugs = new Set(cmsArticlesMapped.map((a) => a.slug));
  const legacy = seedArticles.filter((a) => !cmsSlugs.has(a.slug));
  return [...cmsArticlesMapped, ...legacy].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** Fast read for public routes (search, listings) — no DB seeding side effects. */
export async function listPublishedCmsArticles() {
  if (isDatabaseConfigured()) {
    return queryCmsArticlesFromDb(false);
  }

  if (!canUseLocalFileStore()) {
    return [];
  }

  const items = await readFileStore();
  return items.filter((item) => item.status === "published");
}

export async function getArticleBySlugMerged(slug: string) {
  const all = await getPublishedArticlesMerged();
  return all.find((article) => article.slug === slug);
}

export async function getCmsArticleById(id: number) {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) return null;
    try {
      const rows = await db.select().from(cmsArticles).where(eq(cmsArticles.id, id)).limit(1);
      return rows[0] ?? null;
    } catch (error) {
      if (isMissingTableError(error)) return null;
      throw error;
    }
  }

  if (!canUseLocalFileStore()) {
    return null;
  }

  const items = await seedFileStoreIfEmpty();
  return items.find((item) => item.id === id) ?? null;
}

export async function createCmsArticle(input: ArticleInput) {
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) throw new Error("Database unavailable");
    const payload: NewCmsArticleRow = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    const [row] = await db.insert(cmsArticles).values(payload).returning();
    return row;
  }

  if (!canUseLocalFileStore()) {
    throw new Error("Database is required in production. Set DATABASE_URI in Vercel environment variables.");
  }

  const items = await seedFileStoreIfEmpty();
  const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const row: FileStoreArticle = { ...input, id: nextId, createdAt: now, updatedAt: now };
  items.unshift(row);
  await writeFileStore(items);
  return row;
}

export async function updateCmsArticle(id: number, input: Partial<ArticleInput>) {
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) throw new Error("Database unavailable");
    const [row] = await db
      .update(cmsArticles)
      .set({ ...input, updatedAt: now })
      .where(eq(cmsArticles.id, id))
      .returning();
    return row ?? null;
  }

  if (!canUseLocalFileStore()) {
    throw new Error("Database is required in production. Set DATABASE_URI in Vercel environment variables.");
  }

  const items = await seedFileStoreIfEmpty();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...input, updatedAt: now };
  await writeFileStore(items);
  return items[index];
}

export async function deleteCmsArticle(id: number) {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (!db) throw new Error("Database unavailable");
    await db.delete(cmsArticles).where(eq(cmsArticles.id, id));
    return true;
  }

  if (!canUseLocalFileStore()) {
    throw new Error("Database is required in production. Set DATABASE_URI in Vercel environment variables.");
  }

  const items = await seedFileStoreIfEmpty();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;
  await writeFileStore(next);
  return true;
}

export async function getCmsStats() {
  const rows = await listCmsArticles(true);
  const published = rows.filter((row) => row.status === "published").length;
  const drafts = rows.filter((row) => row.status === "draft").length;
  return { total: rows.length, published, drafts };
}
