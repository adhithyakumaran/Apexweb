"use client";

import { motion, useReducedMotion } from "motion/react";
import { Bot, LineChart, Sparkles } from "lucide-react";

const orbitIcons = [
  { Icon: Bot, className: "bg-zinc-900/90 text-white" },
  { Icon: LineChart, className: "bg-primary text-white" },
  { Icon: Sparkles, className: "bg-cyan-400 text-zinc-900" },
] as const;

export function Hero3DVisual() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto flex h-full w-full max-w-lg items-center justify-center py-8 lg:max-w-none lg:py-0"
      aria-hidden="true"
    >
      <div className="relative aspect-square w-full max-w-[min(100%,380px)] [perspective:1400px]">
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          animate={
            prefersReducedMotion
              ? undefined
              : { rotateY: [ -18, 18, -18 ], rotateX: [ 6, -4, 6 ] }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-white/10 p-5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl [transform:translateZ(48px)]"
            animate={
              prefersReducedMotion ? undefined : { y: [0, -10, 0], rotateZ: [-1.5, 1.5, -1.5] }
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mb-4 flex items-center justify-between text-xs text-white/70">
              <span>Test coverage</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-200">
                +24%
              </span>
            </div>
            <div className="mb-2 text-3xl font-semibold tracking-tight text-white">
              98.4%
            </div>
            <div className="h-16 rounded-xl bg-linear-to-r from-cyan-400/30 via-primary/40 to-blue-300/20 p-3">
              <svg
                viewBox="0 0 200 40"
                className="h-full w-full"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M0 32 L40 28 L80 22 L120 18 L160 10 L200 4"
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={prefersReducedMotion ? undefined : { pathLength: 0 }}
                  animate={prefersReducedMotion ? undefined : { pathLength: 1 }}
                  transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
                />
              </svg>
            </div>
          </motion.div>

          <motion.div
            className="absolute left-[8%] top-[18%] rounded-2xl border border-white/15 bg-white/95 px-4 py-3 shadow-xl [transform:translateZ(96px)_rotateY(-12deg)]"
            animate={prefersReducedMotion ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              Runs today
            </p>
            <p className="text-lg font-semibold text-zinc-900">12,480</p>
          </motion.div>

          <motion.div
            className="absolute bottom-[16%] right-[6%] flex flex-col gap-3 [transform:translateZ(72px)_rotateY(14deg)]"
            animate={
              prefersReducedMotion
                ? undefined
                : { rotateY: [14, -14, 14], rotateX: [0, 8, 0] }
            }
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            {orbitIcons.map(({ Icon, className }, index) => (
              <motion.div
                key={index}
                className={`flex size-11 items-center justify-center rounded-full border border-white/20 shadow-lg ${className}`}
                animate={
                  prefersReducedMotion ? undefined : { scale: [1, 1.06, 1], y: [0, -4, 0] }
                }
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.35,
                }}
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 size-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[40%] border border-cyan-300/25 [transform:translateZ(-40px)_rotateX(72deg)]"
            animate={prefersReducedMotion ? undefined : { rotateZ: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 [transform:translateZ(-20px)_rotateX(72deg)]"
            animate={prefersReducedMotion ? undefined : { rotateZ: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="absolute -right-2 top-1/2 size-24 -translate-y-1/2 rounded-full bg-cyan-400/25 blur-2xl [transform:translateZ(20px)]"
            animate={
              prefersReducedMotion
                ? undefined
                : { scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }
            }
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
