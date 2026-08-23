import type { Article } from "@/config/articles";

type ArticleBodyProps = {
  article: Article;
};

export function InsightTemplate({ article }: ArticleBodyProps) {
  const { content } = article;

  return (
    <div>
      <p className="text-lg leading-relaxed text-white/80 sm:text-xl">{content.intro}</p>

      {content.keyTakeaways && (
        <div className="mt-10 rounded-[1.25rem] border border-brand-orange/25 bg-brand-orange/10 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-orange">
            Key takeaways
          </p>
          <ul className="mt-4 space-y-3">
            {content.keyTakeaways.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-white sm:text-base">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-semibold text-black">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-white">{section.heading}</h2>
          <div className="mt-4 space-y-4">
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-base leading-relaxed text-white/65">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      {content.pullQuote && (
        <blockquote className="mt-12 border-l-4 border-white pl-6 text-xl font-semibold leading-relaxed text-white">
          {content.pullQuote}
        </blockquote>
      )}
    </div>
  );
}
