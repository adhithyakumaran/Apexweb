"use client";

import { Sparkles } from "lucide-react";
import { useAiAssistant } from "@/components/ai/ai-context";
import { Button } from "@/components/ui/button";

/** Subtle post-hero entry to the answer engine — not a chat bubble overlay. */
export function FloatingAiTrigger() {
  const { openPanel } = useAiAssistant();

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 hidden sm:block">
      <Button
        type="button"
        size="lg"
        className="pointer-events-auto gap-2 shadow-md"
        onClick={() => openPanel()}
      >
        <Sparkles className="size-4" />
        Ask AI
      </Button>
    </div>
  );
}
