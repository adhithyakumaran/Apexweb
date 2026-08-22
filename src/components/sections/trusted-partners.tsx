"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { smoothEase } from "@/components/animations/motion-presets";

const partners = [
  "Geetham Enterprises",
  "SwayUp Software Agency",
  "Prowess IQ Pvt Ltd",
  "BorrowBox",
  "Grewbie Technologies",
];

const marqueeItems = [...partners, ...partners];

export function TrustedPartners() {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (prefersReducedMotion) return;

    let x = 0;
    let raf = 0;
    const speed = 0.5;

    function loop() {
      const halfWidth = track!.scrollWidth / 2;
      x -= speed;
      if (Math.abs(x) >= halfWidth) {
        x = 0;
      }
      track!.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  return (
    <section className="w-full overflow-hidden pb-32 pt-24">
      <div className="mx-auto max-w-350 px-4 text-center sm:px-6 lg:px-10">
        <motion.p
          className="mx-auto max-w-2xl text-2xl font-normal leading-snug tracking-tight text-foreground sm:text-3xl sm:leading-snug lg:text-4xl lg:leading-normal"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          Built for modern, client-obsessed, <br className="hidden sm:block" />
          revenue-responsible delivery teams
        </motion.p>
      </div>

      <motion.div
        className="relative mt-20 w-full overflow-hidden pb-4"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />

        <div ref={trackRef} className="flex w-max items-center gap-16 will-change-transform">
          {marqueeItems.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 text-2xl font-semibold tracking-tight text-foreground/70 transition-colors duration-300 hover:text-foreground sm:text-3xl"
            >
              {name}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
