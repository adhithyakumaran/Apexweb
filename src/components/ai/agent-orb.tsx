"use client";

import { cn } from "@/lib/utils";

type AgentOrbProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const shell = {
  sm: "size-8",
  md: "size-11",
  lg: "size-14",
};

const coreInset = {
  sm: "inset-[2px]",
  md: "inset-[3px]",
  lg: "inset-[3.5px]",
};

export function AgentOrb({ size = "md", className }: AgentOrbProps) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", shell[size], className)}
      aria-hidden
    >
      <span
        className={cn(
          "absolute -inset-[30%] rounded-full bg-violet-500/35 blur-md motion-safe:animate-agent-orb-pulse",
          size === "lg" && "-inset-[25%]"
        )}
      />
      <span
        className={cn(
          "absolute inset-0 rounded-full motion-safe:animate-agent-orb-spin",
          "bg-[conic-gradient(from_0deg,transparent_0deg,#c4b5fd_70deg,transparent_140deg,#818cf8_210deg,transparent_280deg,#a78bfa_330deg,transparent_360deg)]"
        )}
      />
      <span
        className={cn(
          "absolute overflow-hidden rounded-full",
          coreInset[size],
          "bg-[radial-gradient(circle_at_32%_26%,#ffffff_0%,#ede9fe_16%,#a78bfa_48%,#6d28d9_78%,#4c1d95_100%)]",
          "shadow-[inset_0_-5px_12px_rgba(76,29,149,0.5),0_3px_10px_rgba(91,33,182,0.35)]"
        )}
      >
        <span className="absolute left-[20%] top-[16%] size-[32%] rounded-full bg-white/75 blur-[0.5px]" />
        <span
          className={cn(
            "absolute inset-0 rounded-full opacity-70",
            "bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.55)_48%,transparent_62%)]",
            "motion-safe:animate-agent-orb-shimmer"
          )}
        />
      </span>
    </span>
  );
}
