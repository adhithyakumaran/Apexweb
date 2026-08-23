export type ContentType = "article" | "service" | "agent" | "page";

export type CmsContentMeta = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  status: "published" | "draft";
  updatedAt: string;
  template?: string;
};

export type CmsStats = {
  articles: number;
  services: number;
  agents: number;
  pages: number;
};

export interface ContentProvider {
  listArticles(): Promise<CmsContentMeta[]>;
  getStats(): Promise<CmsStats>;
}
