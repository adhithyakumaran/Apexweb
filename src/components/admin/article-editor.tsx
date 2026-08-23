"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2, Upload } from "lucide-react";
import type { ArticleCategory } from "@/config/articles";
import { articleCategoryLabels } from "@/config/articles";
import {
  buildArticlePayload,
  slugify,
  type ArticleFormState,
} from "@/lib/cms/article-form";
import { cmsTemplates, getCmsTemplate } from "@/lib/cms/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ArticleEditorProps = {
  initial: ArticleFormState;
  mode: "create" | "edit";
};

export function ArticleEditor({ initial, mode }: ArticleEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleFormState>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"hero" | "attachment" | null>(null);
  const [error, setError] = useState("");

  const template = useMemo(() => getCmsTemplate(form.cmsTemplate), [form.cmsTemplate]);

  function update<K extends keyof ArticleFormState>(key: K, value: ArticleFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadFile(file: File, target: "hero" | "attachment") {
    setUploading(target);
    setError("");
    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/cms/upload", { method: "POST", body });
    setUploading(null);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Upload failed");
      return;
    }

    const data = (await response.json()) as { url: string; name: string };
    if (target === "hero") {
      update("heroImageUrl", data.url);
    } else {
      update("attachmentUrl", data.url);
      update("attachmentName", data.name);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      const payload = buildArticlePayload(form);
      const url =
        mode === "create" ? "/api/cms/articles" : `/api/cms/articles/${form.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string; article?: { id: number } };

      if (!response.ok) {
        setError(data.error ?? "Failed to save article");
        setSaving(false);
        return;
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!form.id) return;
    const confirmed = window.confirm(
      `Delete "${form.title}" permanently? This cannot be undone.`
    );
    if (!confirmed) return;

    setSaving(true);
    const response = await fetch(`/api/cms/articles/${form.id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Failed to delete article");
      setSaving(false);
      return;
    }
    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold">Template</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a layout. Fields below adapt to the template you pick.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cmsTemplates.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => update("cmsTemplate", item.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition-all",
                form.cmsTemplate === item.id
                  ? "border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/20"
                  : "border-border hover:border-brand-orange/40 hover:bg-muted/30"
              )}
            >
              <p className="font-medium">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                update("title", title);
                if (mode === "create" && !form.slug) {
                  update("slug", slugify(title));
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hook">Hook</Label>
            <Input id="hook" value={form.hook} onChange={(e) => update("hook", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intro">Intro</Label>
            <Textarea
              id="intro"
              value={form.intro}
              onChange={(e) => update("intro", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value as ArticleCategory)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                {Object.entries(articleCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => update("status", e.target.value as "draft" | "published")}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" value={form.topic} onChange={(e) => update("topic", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readTime">Read time (min)</Label>
              <Input
                id="readTime"
                type="number"
                min={1}
                value={form.readTime}
                onChange={(e) => update("readTime", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedAt">Published date</Label>
            <Input
              id="publishedAt"
              type="date"
              value={form.publishedAt}
              onChange={(e) => update("publishedAt", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="authorName">Author</Label>
              <Input
                id="authorName"
                value={form.authorName}
                onChange={(e) => update("authorName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorRole">Author role</Label>
              <Input
                id="authorRole"
                value={form.authorRole}
                onChange={(e) => update("authorRole", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="size-4 rounded border-input"
            />
            Feature on articles hub
          </label>
        </div>
      </section>

      {template?.fields.heroImage && (
        <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold">Hero image</h2>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div className="min-w-[240px] flex-1 space-y-2">
              <Label htmlFor="heroImageUrl">Image URL</Label>
              <Input
                id="heroImageUrl"
                value={form.heroImageUrl}
                onChange={(e) => update("heroImageUrl", e.target.value)}
                placeholder="/uploads/cms/..."
              />
            </div>
            <label className="inline-flex cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadFile(file, "hero");
                }}
              />
              <span className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium hover:bg-muted">
                {uploading === "hero" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Upload image
              </span>
            </label>
          </div>
        </section>
      )}

      {template?.fields.attachment && (
        <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold">Downloadable file</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="attachmentUrl">File URL</Label>
              <Input
                id="attachmentUrl"
                value={form.attachmentUrl}
                onChange={(e) => update("attachmentUrl", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachmentName">Display name</Label>
              <Input
                id="attachmentName"
                value={form.attachmentName}
                onChange={(e) => update("attachmentName", e.target.value)}
              />
            </div>
          </div>
          <label className="mt-4 inline-flex cursor-pointer">
            <input
              type="file"
              accept=".pdf,.zip,.docx,.txt,image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadFile(file, "attachment");
              }}
            />
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium hover:bg-muted">
              {uploading === "attachment" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Upload file
            </span>
          </label>
        </section>
      )}

      {template?.fields.metrics && (
        <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold">Case study details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input id="client" value={form.client} onChange={(e) => update("client", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={form.industry}
                onChange={(e) => update("industry", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="challenge">Challenge</Label>
            <Textarea
              id="challenge"
              value={form.challenge}
              onChange={(e) => update("challenge", e.target.value)}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="solution">Solution</Label>
            <Textarea
              id="solution"
              value={form.solution}
              onChange={(e) => update("solution", e.target.value)}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="metricsJson">Results metrics (JSON)</Label>
            <Textarea
              id="metricsJson"
              className="min-h-32 font-mono text-xs"
              value={form.metricsJson}
              onChange={(e) => update("metricsJson", e.target.value)}
            />
          </div>
        </section>
      )}

      {template?.fields.takeaways && (
        <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold">Key takeaways</h2>
          <p className="mt-1 text-xs text-muted-foreground">One takeaway per line</p>
          <Textarea
            className="mt-3 min-h-32"
            value={form.takeaways}
            onChange={(e) => update("takeaways", e.target.value)}
          />
        </section>
      )}

      <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold">Body content</h2>
        <div className="mt-4 space-y-4">
          {template?.fields.pullQuote && (
            <div className="space-y-2">
              <Label htmlFor="pullQuote">Pull quote (optional)</Label>
              <Input
                id="pullQuote"
                value={form.pullQuote}
                onChange={(e) => update("pullQuote", e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="sectionsJson">Sections (JSON)</Label>
            <Textarea
              id="sectionsJson"
              className="min-h-48 font-mono text-xs"
              value={form.sectionsJson}
              onChange={(e) => update("sectionsJson", e.target.value)}
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant={form.status === "published" ? "success" : "warning"}>
            {form.status}
          </Badge>
          <Badge variant="secondary">{template?.label}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "edit" && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={saving}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {mode === "create" ? "Create article" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
