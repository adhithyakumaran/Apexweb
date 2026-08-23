import { pgTable, serial, text, varchar, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import type { ArticleContent } from "@/config/articles";

export const cmsArticles = pgTable("cms_articles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  hook: text("hook").notNull(),
  excerpt: text("excerpt").notNull(),
  cmsTemplate: varchar("cms_template", { length: 50 }).notNull(),
  displayTemplate: varchar("display_template", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  topic: varchar("topic", { length: 120 }).notNull(),
  readTime: integer("read_time").notNull().default(5),
  publishedAt: timestamp("published_at", { mode: "string" }).notNull(),
  authorName: varchar("author_name", { length: 120 }).notNull(),
  authorRole: varchar("author_role", { length: 120 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  coverAccent: varchar("cover_accent", { length: 120 }).notNull().default("from-brand-orange/15 via-brand-orange/5 to-transparent"),
  heroImageUrl: text("hero_image_url"),
  attachmentUrl: text("attachment_url"),
  attachmentName: text("attachment_name"),
  content: jsonb("content").$type<ArticleContent>().notNull(),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export type CmsArticleRow = typeof cmsArticles.$inferSelect;
export type NewCmsArticleRow = typeof cmsArticles.$inferInsert;
