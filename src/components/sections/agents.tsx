import Link from "next/link";
import { Shield, Bug, Gauge, BarChart3, Compass } from "lucide-react";
import { agents } from "@/config/agents";

const icons = {
  sentinel: Shield,
  testbuddy: Bug,
  hermes: Gauge,
  prism: BarChart3,
  atlas: Compass,
};

export function Agents() {
  return (
    <section className="w-full px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-350">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Your AI-powered QA team
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            We&apos;ve built the complete suite to get you there
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => {
            const Icon = icons[agent.slug as keyof typeof icons];
            return (
              <Link
                key={agent.slug}
                href={`/agents/${agent.slug}`}
                className={`group flex h-80 flex-col justify-between border-2 border-foreground p-6 transition-transform duration-300 hover:-translate-y-1 ${agent.bg}`}
              >
                <div className="flex items-start justify-between">
                  <p className={`text-xs font-semibold uppercase tracking-[0.15em] ${agent.accent} opacity-70`}>
                    {agent.role}
                  </p>
                  <Icon className={`size-6 ${agent.accent} opacity-80 transition-transform duration-300 group-hover:scale-110`} />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}