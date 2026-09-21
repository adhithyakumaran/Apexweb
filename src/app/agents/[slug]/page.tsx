import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentDetailContent } from "@/components/pages/agent-detail-content";
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

  return {
    title: `${agent.codename} — ${agent.role}`,
    description: agent.tagline,
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = agents.find((item) => item.slug === slug);

  if (!agent) {
    notFound();
  }

  return <AgentDetailContent agent={agent} />;
}
