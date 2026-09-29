"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const nodes = [
  {
    id: "execution",
    label: "Execution",
    position: "left-[6%] top-[10%]",
    z: 40,
    delay: 0,
  },
  {
    id: "orchestration",
    label: "Orchestration",
    position: "right-[6%] top-[10%]",
    z: 64,
    delay: 0.35,
  },
  {
    id: "discovery",
    label: "Discovery",
    position: "left-1/2 top-[62%] -translate-x-1/2",
    z: 48,
    delay: 0.7,
  },
] as const;

function FlowNode({
  label,
  position,
  z,
  delay,
  reduced,
}: {
  label: string;
  position: string;
  z: number;
  delay: number;
  reduced: boolean;
}) {
  return (
    <div className={cn("absolute", position)} style={{ transform: `translateZ(${z}px)` }}>
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                y: [0, -8, 0],
                rotateX: [2, -2, 2],
              }
        }
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <div className="rounded-2xl border border-white/25 bg-white/15 px-4 py-3 shadow-[0_20px_40px_-12px_rgba(88,28,135,0.45)] backdrop-blur-md">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-white sm:text-sm">
            {label}
          </p>
          <div className="mx-auto mt-2 size-2 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.9)]" />
        </div>
      </motion.div>
    </div>
  );
}

export function HeroAgentFlow() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto aspect-[4/3] w-full max-w-md [perspective:1200px] lg:max-w-lg"
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        animate={
          prefersReducedMotion
            ? undefined
            : { rotateY: [-14, 14, -14], rotateX: [4, -2, 4] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-[8%] rounded-3xl border border-white/10 bg-white/5 shadow-inner backdrop-blur-sm [transform:translateZ(-20px)]" />

        <svg
          className="absolute inset-0 size-full overflow-visible"
          viewBox="0 0 320 240"
          fill="none"
          aria-hidden
        >
          <motion.path
            d="M 52 52 H 188"
            stroke="url(#hero-flow-line)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={prefersReducedMotion ? undefined : { pathLength: 0, opacity: 0.4 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { pathLength: [0.2, 1, 0.2], opacity: [0.5, 1, 0.5] }
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M 240 52 V 168"
            stroke="url(#hero-flow-line)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={prefersReducedMotion ? undefined : { pathLength: 0 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { pathLength: [0.15, 1, 0.15], opacity: [0.45, 1, 0.45] }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
          <defs>
            <linearGradient id="hero-flow-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="50%" stopColor="rgba(196,181,253,0.95)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
            </linearGradient>
          </defs>
        </svg>

        <FlowNode
          label={nodes[0].label}
          position={nodes[0].position}
          z={nodes[0].z}
          delay={nodes[0].delay}
          reduced={!!prefersReducedMotion}
        />
        <FlowNode
          label={nodes[1].label}
          position={nodes[1].position}
          z={nodes[1].z}
          delay={nodes[1].delay}
          reduced={!!prefersReducedMotion}
        />
        <FlowNode
          label={nodes[2].label}
          position={nodes[2].position}
          z={nodes[2].z}
          delay={nodes[2].delay}
          reduced={!!prefersReducedMotion}
        />

        {!prefersReducedMotion && (
          <>
            <motion.div
              className="pointer-events-none absolute left-[18%] top-[20%] size-2 rounded-full bg-white shadow-[0_0_10px_white]"
              animate={{ x: [0, 136, 136], y: [0, 0, 116], opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute right-[18%] top-[22%] h-[58%] w-px bg-linear-to-b from-violet-200/80 to-white/30"
              animate={{ opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
