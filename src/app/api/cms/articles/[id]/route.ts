import { NextResponse } from "next/server";
import { logCmsActivity } from "@/lib/cms/activity-log";
import { requireCmsAuth } from "@/lib/cms/api-auth";
import { revalidateArticlePaths } from "@/lib/cms/revalidate";
import {
  deleteCmsArticle,
  getCmsArticleById,
  updateCmsArticle,
  type ArticleInput,
} from "@/lib/cms/articles-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const { id } = await context.params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const article = await getCmsArticleById(articleId);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function PATCH(request: Request, context: RouteContext) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const { id } = await context.params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await request.json()) as Partial<ArticleInput>;

  try {
    const article = await updateCmsArticle(articleId, body);
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const publishedNow = body.status === "published";
    await logCmsActivity({
      action: publishedNow ? "article.published" : "article.updated",
      level: publishedNow ? "success" : "info",
      message: publishedNow
        ? `Published "${article.title}"`
        : `Updated "${article.title}"`,
      resourceType: "article",
      resourceId: String(article.id),
      metadata: { slug: article.slug, status: article.status },
    });

    revalidateArticlePaths(article.slug);
    return NextResponse.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const { id } = await context.params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const existing = await getCmsArticleById(articleId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const deleted = await deleteCmsArticle(articleId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await logCmsActivity({
    action: "article.deleted",
    level: "warning",
    message: `Deleted "${existing.title}"`,
    resourceType: "article",
    resourceId: String(articleId),
    metadata: { slug: existing.slug },
  });

  revalidateArticlePaths(existing.slug);
  return NextResponse.json({ ok: true });
}
