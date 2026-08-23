"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2, Upload } from "lucide-react";
import type { ArticleCategory } from "@/config/articles";
import { articleCategoryLabels } from "@/config/articles";
import {
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminStatusDot,
} from "@/components/admin/admin-ui";
import { adminClasses } from "@/components/admin/admin-theme";
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
import { cn } from "@/lib/utils";

const selectClassName = adminClasses.input;

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
    <div className="space-y-6 pb-24">
      <AdminPanel>
        <AdminPanelHeader
          title="Article template"
          description="Choose a layout. The form adapts to the template you select."
        />
        <AdminPanelBody>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {cmsTemplates.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => update("cmsTemplate", item.id)}
                className={cn(
                  "rounded border p-3 text-left transition-colors",
                  form.cmsTemplate === item.id
                    ? "border-[#ededed] bg-[#111]"
                    : "border-[#333] bg-black hover:border-[#666]"
                )}
              >
                <p className="text-[13px] font-medium text-[#ededed]">{item.label}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#666]">{item.description}</p>
              </button>
            ))}
          </div>
        </AdminPanelBody>
      </AdminPanel>

      <AdminPanel>
        <AdminPanelHeader
          title="Article details"
          description="Core metadata shown on the public article page and listings."
        />
        <AdminPanelBody className="grid gap-6 lg:grid-cols-2">
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
                className={selectClassName}
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
                className={selectClassName}
              >
                <option value="draft">Draft (hidden from public site)</option>
                <option value="published">Published (live on /articles)</option>
              </select>
            </div>
          </div>

          {form.status === "draft" && (
            <p className="rounded border border-[#f5a623]/30 px-3 py-2 text-[13px] text-[#f5a623]">
              Draft — not visible on the public site until published.
            </p>
          )}

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
              className="size-4 rounded border-[#333] bg-black accent-[#ededed]"
            />
            Feature on articles hub
          </label>
        </div>
        </AdminPanelBody>
      </AdminPanel>

      {template?.fields.heroImage && (
        <AdminPanel>
          <AdminPanelHeader
            title="Cover image"
            description="Displayed as a compact visual on the article page and in listings."
          />
          <AdminPanelBody>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {form.heroImageUrl ? (
                <div className="shrink-0 overflow-hidden rounded border border-[#333] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.heroImageUrl}
                    alt="Cover preview"
                    className="aspect-[5/3] w-full max-w-[11rem] object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-[8.75rem] shrink-0 items-center justify-center rounded border border-dashed border-[#333] bg-black text-[12px] text-[#666]">
                  No image
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="heroImageUrl">Image URL</Label>
                  <Input
                    id="heroImageUrl"
                    value={form.heroImageUrl}
                    onChange={(e) => update("heroImageUrl", e.target.value)}
                    placeholder="https://..."
                    className="font-mono text-xs"
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
                  <span className={adminClasses.secondaryBtn}>
                    {uploading === "hero" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    Upload cover image
                  </span>
                </label>
              </div>
            </div>
          </AdminPanelBody>
        </AdminPanel>
      )}

      {template?.fields.attachment && (
        <AdminPanel>
          <AdminPanelHeader title="Downloadable file" />
          <AdminPanelBody>
            <div className="grid gap-4 sm:grid-cols-2">
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
              <span className={adminClasses.secondaryBtn}>
                {uploading === "attachment" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Upload file
              </span>
            </label>
          </AdminPanelBody>
        </AdminPanel>
      )}

      {template?.fields.metrics && (
        <AdminPanel>
          <AdminPanelHeader title="Case study details" />
          <AdminPanelBody>
            <div className="grid gap-4 sm:grid-cols-2">
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
          </AdminPanelBody>
        </AdminPanel>
      )}

      {template?.fields.takeaways && (
        <AdminPanel>
          <AdminPanelHeader
            title="Key takeaways"
            description="One takeaway per line."
          />
          <AdminPanelBody>
            <Textarea
              className="min-h-32"
              value={form.takeaways}
              onChange={(e) => update("takeaways", e.target.value)}
            />
          </AdminPanelBody>
        </AdminPanel>
      )}

      <AdminPanel>
        <AdminPanelHeader title="Body content" />
        <AdminPanelBody className="space-y-4">
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
        </AdminPanelBody>
      </AdminPanel>

      {error && (
        <p className="rounded border border-[#e00]/30 px-4 py-3 text-[13px] text-[#ff6666]">
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#333] bg-black lg:left-60">
        <div className="mx-auto flex max-w-[1520px] flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <AdminStatusDot tone={form.status === "published" ? "success" : "warning"}>
              {form.status === "published" ? "Ready" : "Draft"}
            </AdminStatusDot>
            <span className="text-[13px] text-[#666]">{template?.label}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={saving}
                className="h-8 rounded border border-[#e00]/30 bg-transparent px-3 text-[13px] text-[#ff6666] hover:bg-[#111]"
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/articles")}
              className="h-8 rounded border-[#333] bg-black px-3 text-[13px] text-[#ededed] hover:bg-[#111]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-8 gap-1.5 rounded border border-[#ededed] bg-[#ededed] px-3 text-[13px] font-medium text-black hover:bg-white"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              {mode === "create" ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
