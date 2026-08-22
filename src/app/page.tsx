import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

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
      <div className="flex gap-4">
  <Button size="lg">Book a Demo</Button>
  <Button variant="outline" size="lg">Free Trial</Button>
</div>
    </main>
  );
}