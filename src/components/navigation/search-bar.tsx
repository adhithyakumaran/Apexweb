"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchSite, type SearchResult, type SearchResultCategory } from "@/lib/search";

const categoryOrder: SearchResultCategory[] = [
  "Pages",
  "Services",
  "Agents",
  "Articles",
  "Contact",
];

function groupResults(results: SearchResult[]) {
  const groups = new Map<SearchResultCategory, SearchResult[]>();
  for (const result of results) {
    const list = groups.get(result.category) ?? [];
    list.push(result);
    groups.set(result.category, list);
  }
  return categoryOrder
    .filter((cat) => groups.has(cat))
    .map((cat) => ({ category: cat, items: groups.get(cat)! }));
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchSite(query), [query]);
  const grouped = useMemo(() => groupResults(results), [results]);
  const showResults = open && query.trim().length >= 2;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        close();
      }
    }
    if (open) {
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }
  }, [open, close]);

  function handleSelect(href: string) {
    close();
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      window.open(href, href.startsWith("http") ? "_blank" : "_self");
      return;
    }
    router.push(href);
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="search-input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="relative overflow-visible"
          >
            <form
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                if (results[0]) handleSelect(results[0].href);
              }}
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services, agents, articles..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search site"
                aria-expanded={showResults}
                aria-autocomplete="list"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={close}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </form>

            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-[70] mt-2 max-h-[min(70vh,420px)] w-[min(100vw-2rem,360px)] overflow-y-auto rounded-xl border border-border bg-card shadow-xl"
                >
                  {grouped.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                  ) : (
                    grouped.map(({ category, items }) => (
                      <div key={category} className="border-b border-border/60 last:border-0">
                        <p className="px-4 pb-1 pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {category}
                        </p>
                        <ul>
                          {items.map((result) => (
                            <li key={result.id}>
                              <button
                                type="button"
                                onClick={() => handleSelect(result.href)}
                                className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-muted/60"
                              >
                                <span className="text-sm font-medium text-foreground">
                                  {result.title}
                                </span>
                                <span className="line-clamp-1 text-xs text-muted-foreground">
                                  {result.description}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="search-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open search"
              onClick={() => setOpen(true)}
            >
              <Search className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
