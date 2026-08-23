"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { agents, type Agent } from "@/config/agents";
import { tryItCta } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Shield, Bug, Gauge, BarChart3, Compass } from "lucide-react";

const icons = {
  sentinel: Shield,
  testbuddy: Bug,
  hermes: Gauge,
  prism: BarChart3,
  atlas: Compass,
};

type AgentDetailContentProps = {
  agent: Agent;
};

export function AgentDetailContent({ agent }: AgentDetailContentProps) {
  const Icon = icons[agent.slug as keyof typeof icons];

  return (
    <main className="bg-background">
      <section className={`border-b border-border/70 px-4 py-12 sm:px-6 lg:px-10 lg:py-16 ${agent.bg}`}>
        <div className="mx-auto max-w-350">
          <Link
            href="/agents"
            className={`inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80 ${agent.accent}`}
          >
            <ArrowLeft className="size-4" />
            All agents
          </Link>
          <div className="mt-8 flex items-start justify-between gap-6">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${agent.accent} opacity-70`}>
                {agent.role}
              </p>
              <h1 className={`mt-2 text-4xl font-semibold tracking-tight sm:text-5xl ${agent.accent} ${agent.font}`}>
                {agent.codename}
              </h1>
              <p className={`mt-4 max-w-xl text-base leading-relaxed ${agent.accent} opacity-85`}>
                {agent.tagline}
              </p>
            </div>
            <Icon className={`size-10 shrink-0 ${agent.accent} opacity-80`} />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {agent.codename} is part of the Apex Node agentic QA platform. It integrates with your
            CI/CD pipeline and works alongside other agents to give you continuous, intelligent
            coverage — without adding headcount.
          </p>
          <Button asChild className="mt-8 gap-2">
            <Link href={tryItCta.href}>
              See {agent.codename} in action
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
