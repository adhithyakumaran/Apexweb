import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { AgentDetailContent } from "@/components/pages/agent-detail-content";
import { TestBuddyDownloadContent } from "@/components/pages/testbuddy-download-content";
import { agents } from "@/config/agents";

type AgentPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = agents.find((item) => item.slug === slug);
  if (!agent) return { title: "Agent not found" };

  if (slug === "testbuddy") {
    return pageMetadata(
      "TestBuddy Omni Desktop | Downloads & Setup",
      "Meet TestBuddy Omni, the Playwright-powered desktop test automation studio. Explore platform availability, Windows beta setup, and installation guidance.",
      "/agents/testbuddy",
    );
  }

  return pageMetadata(`${agent.codename} - ${agent.role}`, agent.tagline, `/agents/${agent.slug}`);
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = agents.find((item) => item.slug === slug);

  if (!agent) {
    notFound();
  }

  return slug === "testbuddy" ? <TestBuddyDownloadContent /> : <AgentDetailContent agent={agent} />;
}
