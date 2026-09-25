export const activityActionLabels: Record<string, string> = {
  "auth.login": "Sign in",
  "auth.logout": "Sign out",
  "article.created": "Article created",
  "article.updated": "Article updated",
  "article.published": "Article published",
  "article.deleted": "Article deleted",
  "media.uploaded": "File uploaded",
};

export type ActivityLogLevel = "info" | "success" | "warning" | "error";
