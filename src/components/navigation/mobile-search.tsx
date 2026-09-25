"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { SearchResult } from "@/lib/search";
import { cn } from "@/lib/utils";

type MobileSearchProps = {
  onNavigate: () => void;
};

export function MobileSearch({ onNavigate }: MobileSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const showResults = query.trim().length >= 2;

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
        const data = (await response.json()) as { results?: SearchResult[] };
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  const empty = useMemo(() => !loading && results.length === 0, [loading, results.length]);

  return (
    <div className="px-2 pb-4">
      <div className="flex h-11 items-center gap-2 rounded-xl border border-border/80 bg-card px-3 shadow-sm">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, agents, articles…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Search site"
        />
        {query.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="mt-2 overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
          {loading ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Searching…</p>
          ) : empty ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={result.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex flex-col gap-0.5 px-3 py-3 transition-colors hover:bg-muted/60"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{result.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {result.category} · {result.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
