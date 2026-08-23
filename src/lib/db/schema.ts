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

export const cmsActivityLogs = pgTable("cms_activity_logs", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 80 }).notNull(),
  level: varchar("level", { length: 20 }).notNull().default("info"),
  message: text("message").notNull(),
  resourceType: varchar("resource_type", { length: 50 }),
  resourceId: varchar("resource_id", { length: 120 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export type CmsActivityLogRow = typeof cmsActivityLogs.$inferSelect;
export type NewCmsActivityLogRow = typeof cmsActivityLogs.$inferInsert;

export const cmsChatbotSettings = pgTable("cms_chatbot_settings", {
  id: serial("id").primaryKey(),
  provider: varchar("provider", { length: 40 }).notNull().default("groq"),
  model: varchar("model", { length: 120 }).notNull().default("qwen/qwen3.6-27b"),
  systemPrompt: text("system_prompt").notNull().default(""),
  tone: varchar("tone", { length: 80 }).notNull().default("professional"),
  skills: jsonb("skills").$type<string[]>().notNull().default([]),
  crawlEnabled: boolean("crawl_enabled").notNull().default(true),
  crawlBaseUrl: text("crawl_base_url"),
  lastCrawledAt: timestamp("last_crawled_at", { mode: "string" }),
  enabled: boolean("enabled").notNull().default(false),
  welcomeMessage: text("welcome_message").notNull().default("Hi — how can I help you today?"),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const cmsChatbotMemory = pgTable("cms_chatbot_memory", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  content: text("content"),
  fileUrl: text("file_url"),
  sourceUrl: text("source_url"),
  charCount: integer("char_count").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export type CmsChatbotSettingsRow = typeof cmsChatbotSettings.$inferSelect;
export type CmsChatbotMemoryRow = typeof cmsChatbotMemory.$inferSelect;
