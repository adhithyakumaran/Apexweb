import { NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cms/api-auth";
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

  const deleted = await deleteCmsArticle(articleId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
