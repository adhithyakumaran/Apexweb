import type { Article } from "@/config/articles";

type ArticleBodyProps = {
  article: Article;
};

export function CaseStudyTemplate({ article }: ArticleBodyProps) {
  const { content } = article;

  return (
    <div>
      <p className="text-lg leading-relaxed text-foreground sm:text-xl">{content.intro}</p>

      <div className="mt-10 grid gap-4 rounded-[1.25rem] border border-border bg-surface/60 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Client
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">{content.client}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Industry
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">{content.industry}</p>
        </div>
      </div>

      {content.results && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.results.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm"
            >
              <p className="text-3xl font-semibold tracking-tight text-brand-orange">
                {metric.value}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {content.challenge && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">The challenge</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{content.challenge}</p>
        </section>
      )}

      {content.solution && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">The solution</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{content.solution}</p>
        </section>
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
        <blockquote className="mt-12 rounded-2xl bg-foreground px-6 py-8 text-lg font-medium leading-relaxed text-background sm:px-8 sm:text-xl">
          &ldquo;{content.pullQuote}&rdquo;
        </blockquote>
      )}
    </div>
  );
}
