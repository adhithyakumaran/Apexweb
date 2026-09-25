import { localContentProvider, listAllContent } from "@/cms/providers/local";
import type { ContentProvider } from "@/cms/types";

export function getContentProvider(): ContentProvider {
  return localContentProvider;
}

export { listAllContent, localContentProvider };
export type { CmsContentMeta, CmsStats, ContentType } from "@/cms/types";
