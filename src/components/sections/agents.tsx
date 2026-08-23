"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Shield, Bug, Gauge, BarChart3, Compass } from "lucide-react";
import { agents } from "@/config/agents";
import { SectionHeader } from "@/components/animations/section-header";
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
        <SectionHeader
          eyebrow="Your AI-powered QA team"
          title="We've built the complete suite to get you there"
          delay={0.15}
        />

        <StaggerReveal className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1} delay={0.25}>
          {agents.map((agent) => {
            const Icon = icons[agent.slug as keyof typeof icons];
            return (
              <StaggerItem key={agent.slug}>
                <motion.div
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { y: -6, transition: { duration: 0.3, ease: smoothEase } }
                  }
                >
                  <Link
                    href={`/agents/${agent.slug}`}
                    className={`group flex h-80 flex-col justify-between rounded-2xl border-2 border-foreground p-6 shadow-sm transition-shadow duration-500 hover:shadow-xl ${agent.bg}`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`text-xs font-semibold uppercase tracking-[0.15em] ${agent.accent} opacity-70`}>
                        {agent.role}
                      </p>
                      <Icon
                        className={`size-6 ${agent.accent} opacity-80 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
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
                </motion.div>
              </StaggerItem>
            );
          })}

          <StaggerItem>
            <motion.div
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: -6, transition: { duration: 0.3, ease: smoothEase } }
              }
            >
              <Link
                href="/agents"
                className="group relative flex h-80 flex-col justify-between overflow-hidden rounded-2xl border-2 border-foreground bg-primary p-6 text-primary-foreground shadow-sm transition-shadow duration-500 hover:shadow-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-80">
                  Full Platform
                </p>

                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-normal tracking-tight">
                    Explore All Agents
                  </h3>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-500 group-hover:translate-x-1">
                    <ArrowRight className="size-5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </StaggerItem>
        </StaggerReveal>
      </div>
    </section>
  );
}
