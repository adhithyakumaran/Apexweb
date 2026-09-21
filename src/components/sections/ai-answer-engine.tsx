"use client";

import { useState } from "react";
import { Sparkles, Search } from "lucide-react";
import { defaultRelatedQuestions } from "@/config/knowledge";
import { useAiAssistant } from "@/components/ai/ai-context";
import { Button } from "@/components/ui/button";

export function AiAnswerEngineCard({ compact }: { compact?: boolean }) {
  const { openWithQuestion } = useAiAssistant();
  const [value, setValue] = useState("");

  const submit = () => {
    const q = value.trim();
    if (q) openWithQuestion(q);
  };

  const suggestions = defaultRelatedQuestions.slice(0, 3);

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur-sm"
          : "rounded-2xl border border-border bg-card p-6 shadow-md sm:p-8"
      }
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/12">
          <Sparkles className="size-4 text-primary" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Apex Node AI
        </p>
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        Have a <span className="text-primary">QA question?</span>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Our answer engine draws on services, agents, and company knowledge to help
        you explore agentic QA—without leaving this page.
      </p>

      <div className="mt-5 flex rounded-full border border-border bg-background px-3 py-2 shadow-inner">
        <Sparkles className="mt-2.5 size-4 shrink-0 text-primary/80" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Please ask a question or initiate a search"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Ask a QA question"
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Search"
          onClick={submit}
        >
          <Search className="size-4" />
        </Button>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {suggestions.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => openWithQuestion(s)}
              className="w-full rounded-lg border border-transparent px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
