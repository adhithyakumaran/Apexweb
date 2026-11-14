import { pageMetadata } from "@/lib/seo";
import { AgentsPageContent } from "@/components/pages/agents-page-content";

export const metadata = pageMetadata(
  "AI Testing Agents & QA Automation",
  "Explore Apex Node AI testing agents for end-to-end testing, security, performance, quality insights, and software test planning.",
  "/agents",
);

export default function AgentsPage() {
  return <AgentsPageContent />;
}
