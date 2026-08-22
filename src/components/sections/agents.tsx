"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Shield, Bug, Gauge, BarChart3, Compass } from "lucide-react";
import { agents } from "@/config/agents";
import {
  StaggerItem,
  StaggerReveal,
} from "@/components/animations/scroll-reveal";
import { smoothEase } from "@/components/animations/motion-presets";

const icons = {
  sentinel: Shield,
  testbuddy: Bug,
  hermes: Gauge,
  prism: BarChart3,
  atlas: Compass,
};

export function Agents() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="w-full px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-350">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: smoothEase }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Your AI-powered QA team
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            We&apos;ve built the complete suite to get you there
          </h2>
        </motion.div>

        <StaggerReveal className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {agents.map((agent) => {
            const Icon = icons[agent.slug as keyof typeof icons];
            return (
              <StaggerItem key={agent.slug}>
                <Link
                  href={`/agents/${agent.slug}`}
                  className={`group flex h-80 flex-col justify-between rounded-2xl border-2 border-foreground p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${agent.bg}`}
                >
                  <div className="flex items-start justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-[0.15em] ${agent.accent} opacity-70`}>
                      {agent.role}
                    </p>
                    <Icon
                      className={`size-6 ${agent.accent} opacity-80 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    />
                  </div>

                  <div>
                    <h3 className={`text-3xl tracking-tight ${agent.accent} ${agent.font}`}>
                      {agent.codename}
                    </h3>
                    <p className={`mt-2 text-sm leading-relaxed ${agent.accent} opacity-80`}>
                      {agent.tagline}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}

          <StaggerItem>
            <Link
              href="/agents"
              className="group relative flex h-80 flex-col justify-between overflow-hidden rounded-2xl border-2 border-foreground bg-primary p-6 text-primary-foreground transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-80">
                Full Platform
              </p>

              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-normal tracking-tight">
                  Explore All Agents
                </h3>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="size-5" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
