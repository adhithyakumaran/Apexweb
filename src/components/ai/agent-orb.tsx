"use client";

import { cn } from "@/lib/utils";

type AgentOrbProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
};

export function AgentOrb({ size = "md", className }: AgentOrbProps) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", sizes[size], className)}
      aria-hidden
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#7c3aed,#a855f7,#6366f1,#c084fc,#7c3aed)] motion-safe:animate-agent-orb-spin",
          sizes[size]
        )}
      />
      <span
        className={cn(
          "absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_30%_25%,#f5f3ff_0%,#a855f7_45%,#5b21b6_100%)] shadow-[inset_-2px_-3px_8px_rgba(91,33,182,0.5)]",
          size === "lg" ? "inset-[16%]" : "inset-[18%]"
        )}
      />
      <span className="absolute inset-0 rounded-full bg-white/20 blur-[1px]" />
    </span>
  );
}
