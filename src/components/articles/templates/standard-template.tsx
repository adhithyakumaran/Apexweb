import type { Article } from "@/config/articles";

type ArticleBodyProps = {
  article: Article;
};

function ProseSection({ heading, body }: { heading?: string; body: string[] }) {
  return (
    <section className="mt-10">
      {heading && (
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {heading}
        </h2>
      )}
      <div className={heading ? "mt-4 space-y-4" : "space-y-4"}>
        {body.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-base leading-relaxed text-muted-foreground">
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
    <div>
      <p className="text-lg leading-relaxed text-foreground sm:text-xl">{content.intro}</p>
      {content.sections.map((section) => (
        <ProseSection key={section.heading} heading={section.heading} body={section.body} />
      ))}
      {content.pullQuote && (
        <blockquote className="mt-12 border-l-4 border-brand-orange pl-6 text-xl font-medium leading-relaxed text-foreground italic">
          &ldquo;{content.pullQuote}&rdquo;
        </blockquote>
      )}
    </div>
  );
}
