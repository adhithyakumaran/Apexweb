CREATE TABLE IF NOT EXISTS "cms_activity_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "action" varchar(80) NOT NULL,
  "level" varchar(20) DEFAULT 'info' NOT NULL,
  "message" text NOT NULL,
  "resource_type" varchar(50),
  "resource_id" varchar(120),
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "cms_activity_logs_created_at_idx" ON "cms_activity_logs" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "cms_activity_logs_action_idx" ON "cms_activity_logs" ("action");
