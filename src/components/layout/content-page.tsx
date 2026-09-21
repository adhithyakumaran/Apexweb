import Link from "next/link";
import { Button } from "@/components/ui/button";
import { tryItCta } from "@/config/navigation";

type Section = {
  id?: string;
  title: string;
  body: string;
};

export function ContentPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections?: Section[];
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>
      {sections?.map((s) => (
        <section key={s.id ?? s.title} id={s.id} className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-foreground">{s.title}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
        </section>
      ))}
      <div className="mt-14">
        <Button asChild size="lg">
          <Link href={tryItCta.href}>Book a demo</Link>
        </Button>
      </div>
    </main>
  );
}
