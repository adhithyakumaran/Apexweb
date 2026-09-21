import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { agents } from "@/config/agents";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return agents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = agents.find((a) => a.slug === slug);
  if (!agent) return { title: "Agent" };
  return { title: agent.codename, description: agent.tagline };
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params;
  const agent = agents.find((a) => a.slug === slug);
  if (!agent) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {agent.role}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{agent.codename}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{agent.tagline}</p>
      <p className="mt-6 text-muted-foreground">
        This agent is part of the Apex Node platform. Ask our AI assistant what {agent.codename}{" "}
        can do on your stack, or book a demo for a tailored walkthrough.
      </p>
      <div className="mt-10 flex gap-4">
        <Button asChild>
          <Link href="/book-demo">Book a demo</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/agents">All agents</Link>
        </Button>
      </div>
    </main>
  );
}
