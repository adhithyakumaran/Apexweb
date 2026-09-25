import type { Article } from "@/config/articles";

type ArticleBodyProps = {
  article: Article;
};

function ProseSection({ heading, body }: { heading?: string; body: string[] }) {
  return (
    <section className="mt-8">
      {heading && <h2 className="text-lg font-medium text-foreground">{heading}</h2>}
      <div className={heading ? "mt-3 space-y-3" : "space-y-3"}>
        {body.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export function StandardTemplate({ article }: ArticleBodyProps) {
  const { content } = article;

  return (
    <div className="text-[0.95rem] leading-relaxed sm:text-base">
      <p className="text-foreground/90">{content.intro}</p>
      {content.sections.map((section) => (
        <ProseSection key={section.heading} heading={section.heading} body={section.body} />
      ))}
      {content.pullQuote && (
        <blockquote className="mt-10 border-l-2 border-brand-orange pl-4 text-base italic text-foreground/90">
          &ldquo;{content.pullQuote}&rdquo;
        </blockquote>
      )}
    </div>
  );
}
