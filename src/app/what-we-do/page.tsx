import { pageMetadata } from "@/lib/seo";
import { ServicesPageContent } from "@/components/pages/services-page-content";

export const metadata = pageMetadata(
  "AI Agents, Business Automation & Custom Software",
  "AI agent development, business workflow automation, custom software engineering, cloud DevOps, and TestBuddy Omni QA automation for businesses.",
  "/what-we-do",
);

export default function WhatWeDoPage() {
  return <ServicesPageContent />;
}
