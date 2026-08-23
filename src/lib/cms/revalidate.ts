import { revalidatePath } from "next/cache";
import { invalidateSearchCache } from "@/lib/search";

export function revalidateArticlePaths(slug?: string) {
  invalidateSearchCache();
  revalidatePath("/articles", "page");
  revalidatePath("/api/search");
  revalidatePath("/", "layout");
  if (slug) {
    revalidatePath(`/articles/${slug}`, "page");
  }
}
