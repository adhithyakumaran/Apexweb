CREATE TABLE IF NOT EXISTS "cms_chatbot_settings" (
  "id" serial PRIMARY KEY,
  "provider" varchar(40) NOT NULL DEFAULT 'groq',
  "model" varchar(120) NOT NULL DEFAULT 'llama-3.3-70b-versatile',
  "system_prompt" text NOT NULL DEFAULT '',
  "tone" varchar(80) NOT NULL DEFAULT 'professional',
  "skills" jsonb NOT NULL DEFAULT '[]',
  "crawl_enabled" boolean NOT NULL DEFAULT true,
  "crawl_base_url" text,
  "last_crawled_at" timestamp,
  "enabled" boolean NOT NULL DEFAULT false,
  "welcome_message" text NOT NULL DEFAULT 'Hi — how can I help you today?',
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "cms_chatbot_memory" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "type" varchar(40) NOT NULL,
  "content" text,
  "file_url" text,
  "source_url" text,
  "char_count" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);
