"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Logo } from "@/components/navigation/logo";
import { smoothEase } from "@/components/animations/motion-presets";

const LOADING_MESSAGES = [
  "Automate the work",
  "Test smarter, ship faster",
  "Agentic QA, end to end",
  "Quality without compromise",
];

const SESSION_KEY = "apex-splash-seen";
const MIN_DURATION_MS = 2800;

export function LoadingScreen() {
  const [phase, setPhase] = useState<"init" | "show" | "hide" | "done">("init");
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen === "true") {
      setPhase("done");
      return;
    }

    setPhase("show");
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const eased = 1 - Math.pow(1 - Math.min(elapsed / MIN_DURATION_MS, 1), 2);
      setProgress(eased * 100);

      if (elapsed < MIN_DURATION_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        sessionStorage.setItem(SESSION_KEY, "true");
        setPhase("hide");
        window.setTimeout(() => {
          document.body.style.overflow = "";
          setPhase("done");
        }, 600);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase !== "show" || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1100);

    return () => window.clearInterval(interval);
  }, [phase, prefersReducedMotion]);

  if (phase === "init" || phase === "done") return null;

  return (
    <AnimatePresence>
      {phase === "show" || phase === "hide" ? (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background px-6"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "hide" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: smoothEase }}
          aria-live="polite"
          aria-busy={phase === "show"}
          role="status"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_65%)]" />

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="relative flex flex-col items-center"
          >
            <Logo className="scale-125" />
            <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Apex Node Technologies
            </p>
          </motion.div>

          <div className="absolute bottom-20 left-1/2 w-full max-w-sm -translate-x-1/2 px-6">
            <div className="h-px w-full overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-primary via-brand-orange to-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-6 h-5 overflow-hidden text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={LOADING_MESSAGES[messageIndex]}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: smoothEase }}
                  className="text-sm font-medium tracking-wide text-muted-foreground"
                >
                  {LOADING_MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
