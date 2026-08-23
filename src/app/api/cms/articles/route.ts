import { NextResponse } from "next/server";
import { logCmsActivity } from "@/lib/cms/activity-log";
import { requireCmsAuth } from "@/lib/cms/api-auth";
import { revalidateArticlePaths } from "@/lib/cms/revalidate";
import {
  createCmsArticle,
  listCmsArticles,
  type ArticleInput,
} from "@/lib/cms/articles-repository";

export async function GET() {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const articles = await listCmsArticles(true);
  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  const authError = await requireCmsAuth();
  if (authError) return authError;

  const body = (await request.json()) as ArticleInput;

  if (!body.slug?.trim() || !body.title?.trim()) {
    return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
  }

  try {
    const article = await createCmsArticle(body);
    await logCmsActivity({
      action: body.status === "published" ? "article.published" : "article.created",
      level: "success",
      message:
        body.status === "published"
          ? `Published "${body.title}"`
          : `Created draft "${body.title}"`,
      resourceType: "article",
      resourceId: String(article.id),
      metadata: { slug: body.slug, status: body.status },
    });
    revalidateArticlePaths(body.slug);
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
