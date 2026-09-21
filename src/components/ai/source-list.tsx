import Link from "next/link";
import type { CitationSource } from "@/lib/ai/types";
import { FileText, Globe } from "lucide-react";

export function SourceList({ sources }: { sources: CitationSource[] }) {
  if (!sources.length) return null;

  return (
    <div className="mt-6 border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Sources
      </p>
      <ul className="mt-2 space-y-2">
        {sources.map((s) => (
          <li key={s.id} className="flex items-start gap-2 text-sm">
            {s.type === "document" ? (
              <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            {s.href ? (
              <Link href={s.href} className="text-primary hover:underline">
                {s.title}
              </Link>
            ) : (
              <span className="text-foreground/90">{s.title}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
