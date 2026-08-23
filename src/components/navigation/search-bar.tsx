"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.form
            key="search-input"
            initial={{ width: 36, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 36, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex h-10 items-center gap-2 rounded-full border border-border/80 bg-surface/90 px-3.5 shadow-sm backdrop-blur-sm">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search site..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            key="search-icon"
            type="button"
            aria-label="Open search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface/80 text-muted-foreground shadow-sm transition-all duration-200 hover:border-border hover:bg-muted hover:text-foreground"
          >
            <Search className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
