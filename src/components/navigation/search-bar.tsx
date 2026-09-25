"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SearchResult, SearchResultCategory } from "@/lib/search";
import { cn } from "@/lib/utils";

const categoryOrder: SearchResultCategory[] = [
  "Pages",
  "Services",
  "Agents",
  "Articles",
  "Contact",
];

const categoryAccent: Record<SearchResultCategory, string> = {
  Pages: "bg-primary/10 text-primary",
  Services: "bg-brand-orange/10 text-brand-orange",
  Agents: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Articles: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Contact: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

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
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 380 });
  const [mounted, setMounted] = useState(false);

  const grouped = useMemo(() => groupResults(results), [results]);
  const flatResults = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);
  const showResults = open && query.trim().length >= 2;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      close();
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        window.open(href, href.startsWith("http") ? "_blank" : "_self");
        return;
      }
      router.push(href);
    },
    [close, router]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setFetchError(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!response.ok) {
          setFetchError(true);
          setResults([]);
          return;
        }
        const data = (await response.json()) as { results?: SearchResult[] };
        setResults(data.results ?? []);
      } catch {
        setFetchError(true);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!showResults || !containerRef.current) return;

    function updatePosition() {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const width = Math.min(380, window.innerWidth - 32);
      setDropdownStyle({
        top: rect.bottom + 8,
        left: Math.max(16, rect.right - width),
        width,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [showResults, query, open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        close();
      }
    }
    if (open) {
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }
  }, [open, close]);

  function handleFormKeyDown(e: React.KeyboardEvent) {
    if (!showResults || flatResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === "Enter" && flatResults[activeIndex]) {
      e.preventDefault();
      handleSelect(flatResults[activeIndex].href);
    }
  }

  const dropdown =
    showResults && mounted ? (
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.98 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: dropdownStyle.top,
          left: dropdownStyle.left,
          width: dropdownStyle.width,
        }}
        className="z-[200] overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
        role="listbox"
      >
        <div className="border-b border-border/60 bg-surface/50 px-4 py-2.5">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {loading
              ? "Searching…"
              : fetchError
                ? "Search unavailable"
                : results.length > 0
                  ? `${results.length} result${results.length === 1 ? "" : "s"}`
                  : "No matches"}
          </p>
        </div>

        <div className="max-h-[min(68vh,400px)] overflow-y-auto overscroll-contain">
          {fetchError ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-foreground">Search is temporarily unavailable</p>
              <p className="mt-1 text-xs text-muted-foreground">Please try again in a moment</p>
            </div>
          ) : grouped.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-foreground">Nothing found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try services, agents, or article topics
              </p>
            </div>
          ) : (
            grouped.map(({ category, items }) => (
              <div key={category} className="border-b border-border/50 last:border-0">
                <p className="sticky top-0 z-10 bg-card/95 px-4 pb-1.5 pt-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm">
                  {category}
                </p>
                <ul>
                  {items.map((result) => {
                    const index = flatResults.indexOf(result);
                    const isActive = index === activeIndex;
                    return (
                      <li key={result.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() => handleSelect(result.href)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            "group flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors",
                            isActive ? "bg-muted/70" : "hover:bg-muted/50"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide",
                              categoryAccent[category]
                            )}
                          >
                            {category.slice(0, 3)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                              {result.title}
                              <ArrowRight
                                className={cn(
                                  "size-3 shrink-0 text-muted-foreground transition-all",
                                  isActive
                                    ? "translate-x-0 opacity-100"
                                    : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                                )}
                              />
                            </span>
                            <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {result.description}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        {flatResults.length > 0 && (
          <div className="border-t border-border/60 bg-surface/40 px-4 py-2 text-[0.65rem] text-muted-foreground">
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[0.6rem]">
              ↑↓
            </kbd>{" "}
            navigate ·{" "}
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[0.6rem]">
              ↵
            </kbd>{" "}
            open
          </div>
        )}
      </motion.div>
    ) : null;

  return (
    <div ref={containerRef} className="relative flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="search-input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="relative overflow-visible"
          >
            <form
              className="flex h-10 items-center gap-2 rounded-full border border-border/80 bg-card px-3 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.04]"
              onSubmit={(e) => {
                e.preventDefault();
                const target = flatResults[activeIndex] ?? results[0];
                if (target) handleSelect(target.href);
              }}
              onKeyDown={handleFormKeyDown}
            >
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                autoFocus
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services, agents, articles…"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search site"
                aria-expanded={showResults}
                aria-autocomplete="list"
                role="combobox"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                aria-label="Close search"
                onClick={close}
                className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span className="text-[10px] font-semibold tracking-tight">Esc</span>
              </button>
            </form>
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
              aria-label="Open search (Ctrl+K)"
              onClick={() => setOpen(true)}
              className="relative"
            >
              <Search className="size-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted && dropdown ? createPortal(<AnimatePresence>{dropdown}</AnimatePresence>, document.body) : null}
    </div>
  );
}
