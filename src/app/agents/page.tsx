import type { Metadata } from "next";
import Link from "next/link";
import { agents } from "@/config/agents";

export const metadata: Metadata = {
  title: "Agents",
};

export default function AgentsIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <h1 className="text-4xl font-semibold tracking-tight">QA agents</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Specialized agents that work together as your AI-powered QA team.
      </p>
      <ul className="mt-12 space-y-4">
        {agents.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/agents/${a.slug}`}
              className="block rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {a.role}
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{a.codename}</h2>
              <p className="mt-2 text-muted-foreground">{a.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
