import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { agents } from "@/config/agents";
import type { Article } from "@/config/articles";

type ArticleBodyProps = {
  article: Article;
};

export function AgentSpotlightTemplate({ article }: ArticleBodyProps) {
  const { content } = article;
  const agent = agents.find((item) => item.slug === content.agentSlug);

  return (
    <div>
      {agent && (
        <div
          className={`mb-8 flex flex-col gap-4 rounded-xl border border-border bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${agent.bg}`}
        >
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.15em] ${agent.accent} opacity-70`}>
              {agent.role}
            </p>
            <p className={`mt-2 text-3xl font-semibold tracking-tight ${agent.accent} ${agent.font}`}>
              {agent.codename}
            </p>
            <p className={`mt-2 max-w-lg text-sm leading-relaxed ${agent.accent} opacity-80`}>
              {agent.tagline}
            </p>
          </div>
          <Link
            href={`/agents/${agent.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
          >
            Meet {agent.codename}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      <p className="text-lg leading-relaxed text-foreground sm:text-xl">{content.intro}</p>

      {content.capabilities && (
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Core capabilities
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {content.capabilities.map((capability) => (
              <li
                key={capability}
                className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm leading-relaxed text-foreground"
              >
                {capability}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{section.heading}</h2>
          <div className="mt-4 space-y-4">
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      {content.pullQuote && (
        <blockquote className="mt-12 border-l-4 border-brand-orange pl-6 text-xl font-medium leading-relaxed text-foreground italic">
          &ldquo;{content.pullQuote}&rdquo;
        </blockquote>
      )}
    </div>
  );
}
