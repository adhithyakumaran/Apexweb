"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchSite } from "@/lib/search";

type MobileSearchProps = {
  onNavigate: () => void;
};

export function MobileSearch({ onNavigate }: MobileSearchProps) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchSite(query, 6), [query]);

  return (
    <div className="px-2 pb-4">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {query.length >= 2 && results.length > 0 && (
        <ul className="mt-2 space-y-1 rounded-lg border border-border bg-card p-1">
          {results.map((result) => (
            <li key={result.id}>
              <Link
                href={result.href}
                onClick={onNavigate}
                className="block rounded-md px-2 py-2 text-sm hover:bg-muted"
              >
                <span className="font-medium text-foreground">{result.title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{result.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
