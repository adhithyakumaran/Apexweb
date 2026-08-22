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
  "Preparing your experience",
];

const SESSION_KEY = "apex-splash-seen";
const MIN_DURATION_MS = 2400;

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen === "true") {
      setVisible(false);
      return;
    }
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const nextProgress = Math.min(100, (elapsed / MIN_DURATION_MS) * 100);
      setProgress(nextProgress);

      if (elapsed < MIN_DURATION_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        sessionStorage.setItem(SESSION_KEY, "true");
        window.setTimeout(() => setVisible(false), 450);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!visible || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 900);

    return () => window.clearInterval(interval);
  }, [visible, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: smoothEase }}
          aria-live="polite"
          aria-busy="true"
          role="status"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className="flex flex-col items-center"
          >
            <Logo className="scale-110" />
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Apex Node Technologies
            </p>
          </motion.div>

          <div className="absolute bottom-16 left-1/2 w-full max-w-md -translate-x-1/2 px-6">
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-primary via-brand-orange to-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>

            <div className="mt-5 h-6 overflow-hidden text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={LOADING_MESSAGES[messageIndex]}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: smoothEase }}
                  className="text-sm font-medium tracking-wide text-muted-foreground"
                >
                  {LOADING_MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="mt-1 text-center text-[0.7rem] tabular-nums text-muted-foreground/70">
              {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
