"use client";

import { Plus } from "lucide-react";

export function RelatedQuestions({
  questions,
  onSelect,
}: {
  questions: string[];
  onSelect: (q: string) => void;
}) {
  if (!questions.length) return null;

  return (
    <div className="mt-8">
      <p className="text-sm font-semibold text-foreground">
        What would you like to ask next?
      </p>
      <ul className="mt-3 space-y-2">
        {questions.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => onSelect(q)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted/70"
            >
              <span>{q}</span>
              <Plus className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
