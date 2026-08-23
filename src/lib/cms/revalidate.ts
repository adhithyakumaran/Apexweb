import { revalidatePath } from "next/cache";

export function revalidateArticlePaths(slug?: string) {
  revalidatePath("/articles");
  revalidatePath("/api/search");
  if (slug) {
    revalidatePath(`/articles/${slug}`);
  }
}
