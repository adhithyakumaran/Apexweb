import type { ArticleTemplate } from "@/config/articles";

export type CmsTemplateId =
  | "text-only"
  | "image-text"
  | "media-rich"
  | "case-study"
  | "insight-brief";

export type CmsTemplateDefinition = {
  id: CmsTemplateId;
  label: string;
  description: string;
  displayTemplate: ArticleTemplate;
  fields: {
    heroImage: boolean;
    attachment: boolean;
    metrics: boolean;
    takeaways: boolean;
    pullQuote: boolean;
  };
};

export const cmsTemplates: CmsTemplateDefinition[] = [
  {
    id: "text-only",
    label: "Text only",
    description: "Clean long-form article with headings and body text.",
    displayTemplate: "standard",
    fields: { heroImage: false, attachment: false, metrics: false, takeaways: false, pullQuote: true },
  },
  {
    id: "image-text",
    label: "Image + text",
    description: "Hero image with structured article sections.",
    displayTemplate: "standard",
    fields: { heroImage: true, attachment: false, metrics: false, takeaways: false, pullQuote: true },
  },
  {
    id: "media-rich",
    label: "Media kit",
    description: "Hero image, downloadable file, and rich body content.",
    displayTemplate: "standard",
    fields: { heroImage: true, attachment: true, metrics: false, takeaways: false, pullQuote: true },
  },
  {
    id: "case-study",
    label: "Case study",
    description: "Client story with challenge, solution, and metrics.",
    displayTemplate: "case-study",
    fields: { heroImage: true, attachment: false, metrics: true, takeaways: false, pullQuote: true },
  },
  {
    id: "insight-brief",
    label: "Insight brief",
    description: "Short numbered takeaways with supporting copy.",
    displayTemplate: "insight",
    fields: { heroImage: false, attachment: false, metrics: false, takeaways: true, pullQuote: true },
  },
];

export function getCmsTemplate(id: CmsTemplateId) {
  return cmsTemplates.find((template) => template.id === id);
}
