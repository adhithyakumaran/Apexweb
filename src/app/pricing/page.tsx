import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Flexible plans for growing teams and enterprise QA programs. Every tier includes
        access to our agent suite and platform governance features.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Team</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For squads adopting agentic automation on core applications.
          </p>
          <p className="mt-6 text-3xl font-semibold">Custom</p>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/contact">Contact sales</Link>
          </Button>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-card p-8 shadow-md">
          <h2 className="text-xl font-semibold">Enterprise QA</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Governance, dedicated support, custom integrations, and enterprise SLAs.
          </p>
          <p className="mt-6 text-3xl font-semibold">Custom</p>
          <Button asChild className="mt-6">
            <Link href="/book-demo">Book a demo</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
