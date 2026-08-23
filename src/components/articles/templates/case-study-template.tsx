import type { Article } from "@/config/articles";

type ArticleBodyProps = {
  article: Article;
};

export function CaseStudyTemplate({ article }: ArticleBodyProps) {
  const { content } = article;

  return (
    <div className="text-[0.95rem] leading-relaxed sm:text-base">
      <p className="text-foreground/90">{content.intro}</p>

      <div className="mt-8 grid gap-4 rounded-xl border border-border/80 bg-card p-5 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Client</p>
          <p className="mt-1.5 text-sm text-foreground">{content.client}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Industry
          </p>
          <p className="mt-1.5 text-sm text-foreground">{content.industry}</p>
        </div>
      </div>

      {content.results && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {content.results.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-border/80 bg-surface/50 p-4">
              <p className="text-xl font-semibold text-brand-orange">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      )}

      {content.challenge && (
        <section className="mt-10">
          <h2 className="text-lg font-medium text-foreground">The challenge</h2>
          <p className="mt-3 text-muted-foreground">{content.challenge}</p>
        </section>
      )}

      {content.solution && (
        <section className="mt-8">
          <h2 className="text-lg font-medium text-foreground">The solution</h2>
          <p className="mt-3 text-muted-foreground">{content.solution}</p>
        </section>
      )}

      {content.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-lg font-medium text-foreground">{section.heading}</h2>
          <div className="mt-3 space-y-3">
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      {content.pullQuote && (
        <blockquote className="mt-10 border-l-2 border-brand-orange pl-4 text-base italic text-foreground/90">
          &ldquo;{content.pullQuote}&rdquo;
        </blockquote>
      )}
    </div>
  );
}
