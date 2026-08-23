"use client";

import Link from "next/link";
import { agentQuickLinks, industryAgents, testingAgents } from "@/config/services";
import {
  MegaMenuFooter,
  MegaMenuLink,
  MegaMenuSectionLabel,
  MegaMenuShell,
  useMegaMenuHover,
} from "@/components/navigation/mega-menu-primitives";

export function AgentsMegaMenu() {
  const { open, handleEnter, handleLeave } = useMegaMenuHover();

  return (
    <MegaMenuShell
      label="Agents"
      href="/agents"
      open={open}
      onEnter={handleEnter}
      onLeave={handleLeave}
      footer={
        <MegaMenuFooter>
          {agentQuickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {link.label} →
            </Link>
          ))}
        </MegaMenuFooter>
      }
    >
      <div className="mx-auto max-w-350 px-8 py-12 lg:px-14 lg:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-primary">Intelligent agents</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
            Purpose-built AI for every industry and quality workflow
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
            Deploy domain-specific agents for operations and compliance, or activate
            testing agents that plan, run, and report on quality across your stack.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6 lg:border-r lg:border-border/50 lg:pr-10">
            <MegaMenuSectionLabel>Industry-Specific Agents</MegaMenuSectionLabel>
            <div className="grid gap-1 sm:grid-cols-2">
              {industryAgents.map((item) => (
                <MegaMenuLink key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-2">
            <MegaMenuSectionLabel>Testing Agents</MegaMenuSectionLabel>
            <div className="grid gap-1 sm:grid-cols-2">
              {testingAgents.map((item) => (
                <MegaMenuLink key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MegaMenuShell>
  );
}
