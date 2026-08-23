import type { Article } from "@/config/articles";

type ArticleBodyProps = {
  article: Article;
};

export function InsightTemplate({ article }: ArticleBodyProps) {
  const { content } = article;

  return (
    <div className="text-[0.95rem] leading-relaxed sm:text-base">
      <p className="text-foreground/90">{content.intro}</p>

      {content.keyTakeaways && (
        <div className="mt-8 rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-orange">
            Key takeaways
          </p>
          <ol className="mt-3 space-y-2">
            {content.keyTakeaways.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm text-foreground/85">
                <span className="text-muted-foreground">{index + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
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
          {content.pullQuote}
        </blockquote>
      )}
    </div>
  );
}
