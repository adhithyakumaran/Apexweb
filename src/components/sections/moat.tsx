"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { moatPillars } from "@/config/moat";

const CENTER = 50;
const OUTER_RADIUS = 44;
const INNER_RADIUS = 16;
const SPIRAL_DEG = 55;
const STAGGER = 0.09;
const BRAND_ORANGE = "#f97316";

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
  return useTransform(lock, (t) =>
    clamp01((t - index * STAGGER) / (1 - index * STAGGER))
  );
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
  const pathLength = useTransform(localT, [0, 0.35], [0, 1], { clamp: true });
  const opacity = useTransform(localT, [0, 0.08, 1], [0, 0.45, 0.65]);

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
}: {
  pillar: (typeof moatPillars)[number];
  localT: MotionValue<number>;
}) {
  const { x, y } = useNodePosition(pillar.angle, localT);
  const Icon = pillar.icon;
  const left = useTransform(x, (v) => `${v}%`);
  const top = useTransform(y, (v) => `${v}%`);
  const labelOpacity = useTransform(localT, [0, 0.2, 1], [0.5, 0.85, 1]);
  const ringGlow = useTransform(localT, [0.65, 0.9], [0, 1]);
  const lockFlash = useTransform(localT, [0.9, 1], [0, 1]);
  const boxShadow = useTransform(
    [ringGlow, lockFlash] as MotionValue<number>[],
    ([g, f]: number[]) => {
      const blue = `0 0 ${8 + g * 14}px ${g * 2}px color-mix(in oklab, var(--primary) 45%, transparent)`;
      const orange = `0 0 ${f * 22}px ${f * 4}px color-mix(in oklab, ${BRAND_ORANGE} 55%, transparent)`;
      return `${blue}, ${orange}`;
    }
  );
  const borderColor = useTransform(lockFlash, (f) =>
    `color-mix(in oklab, ${BRAND_ORANGE} ${f * 70}%, var(--primary))`
  );
  const scale = useTransform(localT, [0, 0.15, 0.9, 1], [0.85, 1.04, 1, 1.05]);

  return (
    <motion.div
      style={{ left, top, scale }}
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
    >
      <motion.div
        style={{ boxShadow, borderColor }}
        className="flex size-14 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm sm:size-16"
      >
        <Icon className="size-6 sm:size-7" />
      </motion.div>
      <motion.p
        style={{ opacity: labelOpacity }}
        className="max-w-[8.5rem] text-center text-xs font-semibold leading-tight text-foreground sm:text-sm"
      >
        {pillar.label}
      </motion.p>
    </motion.div>
  );
}

function MoatLineLayer({
  lock,
  index,
  pillar,
}: {
  lock: MotionValue<number>;
  index: number;
  pillar: (typeof moatPillars)[number];
}) {
  const localT = useStaggeredT(lock, index);
  return <ConnectingLine angle={pillar.angle} localT={localT} />;
}

function MoatNodeLayer({
  lock,
  index,
  pillar,
}: {
  lock: MotionValue<number>;
  index: number;
  pillar: (typeof moatPillars)[number];
}) {
  const localT = useStaggeredT(lock, index);
  return <Node pillar={pillar} localT={localT} />;
}

export function Moat() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });
  const lock = useMotionValue(0);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!inView) return;
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    if (prefersReducedMotion) {
      lock.set(1);
      return;
    }
    void animate(lock, 1, { duration: 2.8, ease: [0.22, 1, 0.36, 1] });
  }, [inView, lock, prefersReducedMotion]);

  const sealScale = useTransform(lock, [0.5, 0.85, 1], [0.4, 0.92, 1]);
  const sealOpacity = useTransform(lock, [0.4, 0.75, 1], [0, 0.55, 1]);
  const sealRotate = useTransform(lock, [0, 1], [-24, 0]);
  const innerFill = useTransform(lock, [0.75, 1], [0.08, 0.2]);
  const glowOpacity = useTransform(lock, [0.75, 1], [0, 0.5]);
  const captionOpacity = useTransform(lock, [0.92, 1], [0, 1]);
  const captionY = useTransform(lock, [0.92, 1], [8, 0]);
  const gridOpacity = useTransform(lock, [0, 1], [0.08, 0.22]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-sm font-medium uppercase tracking-[0.2em]"
            style={{ color: BRAND_ORANGE }}
          >
            The Apex Moat
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Four defenses. One core.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every layer of Apex Node closes a different gap in enterprise QA —
            and they only work because they work together.
          </p>
        </div>

        <div className="relative mx-auto mt-16 aspect-square w-full max-w-[600px]">
          <div
            className="pointer-events-none absolute inset-0 animate-[spin_40s_linear_infinite] motion-reduce:animate-none"
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-primary/20" />
            <span
              style={{
                background: BRAND_ORANGE,
                boxShadow: `0 0 12px 3px color-mix(in oklab, ${BRAND_ORANGE} 65%, transparent)`,
              }}
              className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />
          </div>

          <motion.div
            style={{ opacity: gridOpacity }}
            className="absolute inset-[8%] rounded-full [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--border)_80%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_80%,transparent)_1px,transparent_1px)] [background-size:14%_14%]"
          />

          <svg
            viewBox="0 0 100 100"
            className="absolute inset-[8%] left-[8%] h-[84%] w-[84%] overflow-visible"
          >
            {moatPillars.map((pillar, i) => (
              <MoatLineLayer
                key={pillar.id}
                lock={lock}
                index={i}
                pillar={pillar}
              />
            ))}
            <motion.g
              style={{ scale: sealScale, opacity: sealOpacity, rotate: sealRotate }}
            >
              <polygon
                points={hexPoints(CENTER, CENTER, 11)}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={0.55}
              />
              <motion.polygon
                points={hexPoints(CENTER, CENTER, 7)}
                fill={BRAND_ORANGE}
                style={{ fillOpacity: innerFill }}
                stroke={BRAND_ORANGE}
                strokeWidth={0.45}
              />
            </motion.g>
          </svg>

          <motion.div
            style={{ opacity: glowOpacity }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
          />

          <div className="absolute inset-[8%]">
            {moatPillars.map((pillar, i) => (
              <MoatNodeLayer
                key={`node-${pillar.id}`}
                lock={lock}
                index={i}
                pillar={pillar}
              />
            ))}
          </div>
        </div>

        <motion.p
          style={{ opacity: captionOpacity, y: captionY, color: BRAND_ORANGE }}
          className="mt-10 text-center text-sm font-medium uppercase tracking-[0.2em]"
        >
          One integrated defense system
        </motion.p>
      </div>
    </section>
  );
}
