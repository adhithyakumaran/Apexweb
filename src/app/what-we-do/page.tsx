import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/content-page";

export const metadata: Metadata = {
  title: "What We Do",
  description: "AI-powered QA, agentic testing, and enterprise automation from Apex Node.",
};

export default function WhatWeDoPage() {
  return (
    <ContentPage
      title="What we do"
      intro="Apex Node delivers agentic QA—from autonomous test agents to enterprise governance—so your team ships with confidence."
      sections={[
        {
          id: "ai-powered-qa",
          title: "AI-Powered QA",
          body:
            "Our platform uses specialized agents to plan, execute, and maintain end-to-end coverage across your applications.",
        },
        {
          id: "enterprise-qa",
          title: "Enterprise QA",
          body:
            "Audit trails, access control, and compliance-ready workflows designed for regulated and high-scale environments.",
        },
        {
          id: "automation",
          title: "Automation",
          body:
            "Self-healing tests, CI/CD integration, and continuous validation that adapts when your UI changes.",
        },
      ]}
    />
  );
}
