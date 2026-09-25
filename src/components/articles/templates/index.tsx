import type { Article } from "@/config/articles";
import { AgentSpotlightTemplate } from "@/components/articles/templates/agent-spotlight-template";
import { CaseStudyTemplate } from "@/components/articles/templates/case-study-template";
import { InsightTemplate } from "@/components/articles/templates/insight-template";
import { StandardTemplate } from "@/components/articles/templates/standard-template";

type ArticleTemplateRendererProps = {
  article: Article;
};

export function ArticleTemplateRenderer({ article }: ArticleTemplateRendererProps) {
  switch (article.template) {
    case "case-study":
      return <CaseStudyTemplate article={article} />;
    case "insight":
      return <InsightTemplate article={article} />;
    case "agent-spotlight":
      return <AgentSpotlightTemplate article={article} />;
    case "standard":
    default:
      return <StandardTemplate article={article} />;
  }
}
