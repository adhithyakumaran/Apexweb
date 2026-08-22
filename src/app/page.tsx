import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Apex QA — Foundation Setup
        </h1>
        <ThemeToggle />
      </div>
      <p className="max-w-md text-center text-muted-foreground">
        Design tokens, Inter font, and light/dark theming are wired up.
        Homepage build starts in Phase 5.
      </p>
      <button className="rounded-full bg-primary px-6 py-3 text-primary-foreground font-medium">
        Primary Button Preview
      </button>
    </main>
  );
}