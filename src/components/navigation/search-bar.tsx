"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.form
            key="search-input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search the site..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                onBlur={() => setOpen(false)}
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setOpen(false)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.form>
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
