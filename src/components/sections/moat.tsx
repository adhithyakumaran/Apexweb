"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { moatPillars } from "@/config/moat";
import { SectionHeader } from "@/components/animations/section-header";

const CENTER = 50;
const OUTER_RADIUS = 44;
const INNER_RADIUS = 16;
const SPIRAL_DEG = 48;
const STAGGER = 0.11;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}
function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const a = toRad(60 * i - 30);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    })
    .join(" ");
}

function useStaggeredT(lock: MotionValue<number>, index: number) {
  return useTransform(lock, (t) => clamp01((t - index * STAGGER) / (1 - index * STAGGER)));
}

function useNodePosition(baseAngle: number, localT: MotionValue<number>) {
  const x = useTransform(localT, (t) => {
    const radius = lerp(OUTER_RADIUS, INNER_RADIUS, t);
    const angle = toRad(baseAngle + lerp(0, SPIRAL_DEG, t));
    return CENTER + radius * Math.cos(angle);
  });
  const y = useTransform(localT, (t) => {
    const radius = lerp(OUTER_RADIUS, INNER_RADIUS, t);
    const angle = toRad(baseAngle + lerp(0, SPIRAL_DEG, t));
    return CENTER + radius * Math.sin(angle);
  });
  return { x, y };
}

function ConnectingLine({
  angle,
  localT,
}: {
  angle: number;
  localT: MotionValue<number>;
}) {
  const { x, y } = useNodePosition(angle, localT);
  const pathLength = useTransform(localT, [0, 0.4], [0, 1], { clamp: true });
  const opacity = useTransform(localT, [0, 0.1, 1], [0, 0.5, 0.8]);

  return (
    <motion.line
      x1={x}
      y1={y}
      x2={CENTER}
      y2={CENTER}
      stroke="var(--primary)"
      strokeWidth={0.45}
      strokeLinecap="round"
      style={{ opacity, pathLength }}
    />
  );
}

function Node({
  pillar,
  localT,
  lock,
}: {
  pillar: (typeof moatPillars)[number];
  localT: MotionValue<number>;
  lock: MotionValue<number>;
}) {
  const { x, y } = useNodePosition(pillar.angle, localT);
  const Icon = pillar.icon;
  const left = useTransform(x, (v) => `${v}%`);
  const top = useTransform(y, (v) => `${v}%`);
  const labelOpacity = useTransform(localT, [0, 0.25, 1], [0.3, 0.75, 1]);

  const ringGlow = useTransform(localT, [0.6, 0.95], [0, 1]);
  const lockFlash = useTransform(localT, [0.88, 1], [0, 1]);
  const boxShadow = useTransform([ringGlow, lockFlash] as MotionValue<number>[], ([g, f]: number[]) => {
    const blue = `0 0 ${6 + g * 16}px ${g * 2}px color-mix(in oklab, var(--primary) 50%, transparent)`;
    const orange = `0 0 ${f * 22}px ${f * 4}px color-mix(in oklab, var(--brand-orange) 65%, transparent)`;
    return `${blue}, ${orange}`;
  });
  const borderColor = useTransform(lockFlash, (f) =>
    `color-mix(in oklab, var(--brand-orange) ${f * 75}%, var(--primary))`
  );
  const scale = useTransform(localT, [0, 0.2, 0.85, 1], [0.8, 1.04, 1, 1.06]);
  const floatY = useTransform(lock, [0.95, 1], [0, -4]);

  return (
    <motion.div
      style={{ left, top, scale, y: floatY }}
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
    >
      <motion.div
        style={{ boxShadow, borderColor }}
        className="flex size-14 items-center justify-center rounded-full border bg-linear-to-b from-secondary to-footer text-primary sm:size-16"
      >
        <Icon className="size-6 sm:size-7" />
      </motion.div>
      <motion.p
        style={{ opacity: labelOpacity }}
        className="max-w-[8rem] text-center text-xs font-semibold leading-tight text-footer-muted sm:text-sm"
      >
        {pillar.label}
      </motion.p>
    </motion.div>
  );
}

function RadarPulses({ lock }: { lock: MotionValue<number> }) {
  const opacity = useTransform(lock, [0.88, 1], [0, 1]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {[0, 0.6, 1.2].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: `${delay}s` }}
          className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-brand-orange opacity-50 sm:size-20"
        />
      ))}
    </motion.div>
  );
}

export function Moat() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.4"],
  });

  const rawLock = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
  const smoothLock = useSpring(rawLock, { stiffness: 80, damping: 22, mass: 0.8 });
  const staticLock = useMotionValue(1);
  const lock = prefersReducedMotion ? staticLock : smoothLock;

  const gridTilt = useTransform(lock, [0, 1], [6, 0]);
  const gridOpacity = useTransform(lock, [0, 1], [0.1, 0.24]);
  const sealScale = useTransform(lock, [0.45, 0.8, 1], [0.35, 0.92, 1]);
  const sealOpacity = useTransform(lock, [0.35, 0.7, 1], [0, 0.55, 1]);
  const sealRotate = useTransform(lock, [0, 1], [-24, 0]);
  const glowOpacity = useTransform(lock, [0.7, 1], [0, 0.75]);
  const glowColor = useTransform(lock, [0.7, 1], ["var(--primary)", "var(--brand-orange)"]);
  const captionOpacity = useTransform(lock, [0.9, 1], [0, 1]);
  const captionY = useTransform(lock, [0.9, 1], [10, 0]);
  const ringRotate = useTransform(lock, [0, 1], [0, 120]);

  return (
    <section
      ref={sectionRef}
      className="dark relative w-full overflow-hidden bg-footer py-16 sm:py-28 lg:py-36"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[min(100vw,600px)] w-[min(100vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <SectionHeader
          variant="dark"
          eyebrow="The Apex Moat"
          title="Four defenses. One core."
          description="Every layer of Apex Node closes a different gap in enterprise QA — and they only work because they work together."
          delay={0.2}
        />

        <motion.div
          style={{ rotateX: gridTilt, perspective: 1000 }}
          className="relative mx-auto mt-12 w-full max-w-[min(100%,600px)] aspect-square sm:mt-20"
        >
          <motion.div
            style={{ rotate: ringRotate }}
            className="absolute inset-0 rounded-full border border-dashed border-primary/20"
          >
            <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange shadow-[0_0_10px_2px_var(--brand-orange)]" />
          </motion.div>

          <motion.div
            style={{ opacity: gridOpacity }}
            className="absolute inset-0 rounded-full [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_60%,transparent)_1px,transparent_1px)] [background-size:12%_12%]"
          />

          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            {moatPillars.map((pillar, i) => {
              const localT = useStaggeredT(lock, i);
              return <ConnectingLine key={pillar.id} angle={pillar.angle} localT={localT} />;
            })}
            <motion.g style={{ scale: sealScale, opacity: sealOpacity, rotate: sealRotate }}>
              <polygon
                points={hexPoints(CENTER, CENTER, 11)}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={0.55}
              />
              <motion.polygon
                points={hexPoints(CENTER, CENTER, 7)}
                fill="var(--brand-orange)"
                style={{ fillOpacity: useTransform(lock, [0.7, 1], [0.05, 0.2]) }}
                stroke="var(--brand-orange)"
                strokeWidth={0.45}
              />
            </motion.g>
          </svg>

          <motion.div
            style={{ opacity: glowOpacity, background: glowColor }}
            className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          />

          <RadarPulses lock={lock} />

          {moatPillars.map((pillar, i) => {
            const localT = useStaggeredT(lock, i);
            return <Node key={pillar.id} pillar={pillar} localT={localT} lock={lock} />;
          })}
        </motion.div>

        <motion.p
          style={{ opacity: captionOpacity, y: captionY }}
          className="mt-10 text-center text-sm font-medium uppercase tracking-[0.2em] text-brand-orange"
        >
          One integrated defense system
        </motion.p>
      </div>
    </section>
  );
}
