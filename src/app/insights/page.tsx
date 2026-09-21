import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";

export const metadata: Metadata = {
  title: "Insights",
};

export default function InsightsPage() {
  return (
    <ContentPage
      title="Insights"
      intro="Perspectives on QA engineering, agentic AI, and enterprise quality from the Apex Node team."
      sections={[
        {
          id: "qa-engineering",
          title: "QA engineering",
          body: "Practices for high-velocity teams balancing speed, coverage, and risk.",
        },
        {
          id: "agentic-ai",
          title: "Agentic AI",
          body: "How autonomous agents change test design, execution, and maintenance.",
        },
        {
          id: "enterprise-ai",
          title: "Enterprise AI",
          body: "Governance, safety, and adoption patterns for AI in quality workflows.",
        },
        {
          id: "trends",
          title: "Testing trends",
          body: "What enterprise buyers are prioritizing in 2025 and beyond.",
        },
        {
          id: "case-studies",
          title: "Case studies",
          body: "Selected outcomes from teams using agentic automation—contact us for detailed references.",
        },
        {
          id: "resources",
          title: "Resources",
          body: "Guides and FAQs are available through our team and the on-site AI answer engine.",
        },
      ]}
    />
  );
}
