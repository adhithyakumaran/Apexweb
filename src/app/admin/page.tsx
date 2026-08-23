import type { Metadata } from "next";
import Link from "next/link";
import { getContentProvider, listAllContent } from "@/cms";
import { FileText, Layers, Bot, Layout } from "lucide-react";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const provider = getContentProvider();
  const [stats, content] = await Promise.all([provider.getStats(), listAllContent()]);

  const articleContent = content.filter((item) => item.type === "article");

  return (
    <main className="min-h-screen bg-surface px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">
          CMS · Local provider
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">Content Studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage articles, services, and agents. Swap the local provider for a headless CMS API when
          you are ready to publish from a dashboard.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Articles", value: stats.articles, icon: FileText },
            { label: "Services", value: stats.services, icon: Layers },
            { label: "Agents", value: stats.agents, icon: Bot },
            { label: "Pages", value: stats.pages, icon: Layout },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-medium text-foreground">Published articles</h2>
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
            {articleContent.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.template} · {item.updatedAt}
                  </p>
                </div>
                <Link
                  href={`/articles/${item.slug}`}
                  className="shrink-0 text-xs font-medium text-brand-orange hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-xs text-muted-foreground">
          Next step: connect a headless CMS (Sanity, Contentful, or Strapi) via{" "}
          <code className="rounded bg-muted px-1 py-0.5">CMS_PROVIDER</code> env and implement the
          same <code className="rounded bg-muted px-1 py-0.5">ContentProvider</code> interface.
        </p>
      </div>
    </main>
  );
}
