import { revalidatePath } from "next/cache";

export function revalidateArticlePaths(slug?: string) {
  revalidatePath("/articles", "page");
  revalidatePath("/api/search");
  revalidatePath("/", "layout");
  if (slug) {
    revalidatePath(`/articles/${slug}`, "page");
  }
}
