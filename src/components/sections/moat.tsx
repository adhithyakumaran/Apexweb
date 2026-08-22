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
  const pathLength = useTransform(localT, [0, 0.35], [0, 1], { clamp: true });
  const opacity = useTransform(localT, [0, 0.08, 1], [0, 0.6, 0.75]);

  return (
    <motion.line
      x1={x}
      y1={y}
      x2={CENTER}
      y2={CENTER}
      stroke="var(--primary)"
      strokeWidth={0.4}
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
  const labelOpacity = useTransform(localT, [0, 0.2, 1], [0.4, 0.7, 1]);

  // glow blends blue -> brand orange as each node fully locks in
  const ringGlow = useTransform(localT, [0.65, 0.9], [0, 1]);
  const lockFlash = useTransform(localT, [0.9, 1], [0, 1]);
  const boxShadow = useTransform([ringGlow, lockFlash] as MotionValue<number>[], ([g, f]: number[]) => {
    const blue = `0 0 ${8 + g * 18}px ${g * 3}px color-mix(in oklab, var(--primary) 55%, transparent)`;
    const orange = `0 0 ${f * 26}px ${f * 5}px color-mix(in oklab, ${BRAND_ORANGE} 70%, transparent)`;
    return `${blue}, ${orange}`;
  });
  const borderColor = useTransform(lockFlash, (f) =>
    `color-mix(in oklab, ${BRAND_ORANGE} ${f * 80}%, var(--primary))`
  );
  const scale = useTransform(localT, [0, 0.15, 0.9, 1], [0.85, 1.05, 1, 1.08]);

  return (
    <motion.div
      style={{ left, top, scale }}
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
    >
      <motion.div
        style={{ boxShadow, borderColor }}
        className="flex size-14 items-center justify-center rounded-full border bg-gradient-to-b from-slate-900 to-black text-primary sm:size-16"
      >
        <Icon className="size-6 sm:size-7" />
      </motion.div>
      <motion.p
        style={{ opacity: labelOpacity }}
        className="max-w-[8rem] text-center text-xs font-semibold leading-tight text-slate-200 sm:text-sm"
      >
        {pillar.label}
      </motion.p>
    </motion.div>
  );
}

function RadarPulses({ lock }: { lock: MotionValue<number> }) {
  const opacity = useTransform(lock, [0.9, 1], [0, 1]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {[0, 0.5, 1].map((delay) => (
        <span
          key={delay}
          style={{
            animationDelay: `${delay}s`,
            borderColor: BRAND_ORANGE,
          }}
          className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 opacity-60 sm:size-20"
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
    offset: ["start 0.85", "end 0.35"],
  });

  const rawLock = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });
  const smoothLock = useSpring(rawLock, { stiffness: 140, damping: 26, mass: 0.6 });
  const staticLock = useMotionValue(1);
  const lock = prefersReducedMotion ? staticLock : smoothLock;

  const gridTilt = useTransform(lock, [0, 1], [8, 0]);
  const gridOpacity = useTransform(lock, [0, 1], [0.14, 0.28]);
  const sealScale = useTransform(lock, [0.5, 0.85, 1], [0.4, 0.9, 1]);
  const sealOpacity = useTransform(lock, [0.4, 0.75, 1], [0, 0.5, 1]);
  const sealRotate = useTransform(lock, [0, 1], [-30, 0]);
  const glowOpacity = useTransform(lock, [0.75, 1], [0, 0.85]);
  const glowColor = useTransform(lock, [0.75, 1], ["var(--primary)", BRAND_ORANGE]);
  const captionOpacity = useTransform(lock, [0.92, 1], [0, 1]);
  const captionY = useTransform(lock, [0.92, 1], [8, 0]);

  return (
    <section
      ref={sectionRef}
      className="dark relative w-full overflow-hidden bg-black py-28 sm:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-[#050810] to-black" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: BRAND_ORANGE }}>
            The Apex Moat
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-5xl">
            Four defenses. One core.
          </h2>
          {/* TODO: client-approved moat copy — placeholder, see handover Section 15 */}
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Every layer of Apex Node closes a different gap in enterprise QA —
            and they only work because they work together.
          </p>
        </div>

        <motion.div
          style={{ rotateX: gridTilt }}
          className="relative mx-auto mt-20 aspect-square w-full max-w-[600px]"
        >
          {/* ambient always-on boundary ring, carrying an orbiting orange spark */}
          <div className="absolute inset-0 animate-[spin_38s_linear_infinite] rounded-full border border-dashed border-primary/15">
            <span
              style={{
                background: BRAND_ORANGE,
                boxShadow: `0 0 10px 2px ${BRAND_ORANGE}`,
              }}
              className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            />
          </div>

          <motion.div
            style={{ opacity: gridOpacity }}
            className="absolute inset-0 rounded-full [background-image:linear-gradient(to_right,theme(colors.slate.400)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.slate.400)_1px,transparent_1px)] [background-size:12%_12%]"
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
                strokeWidth={0.6}
              />
              <motion.polygon
                points={hexPoints(CENTER, CENTER, 7)}
                fill={BRAND_ORANGE}
                style={{ fillOpacity: useTransform(lock, [0.75, 1], [0.06, 0.22]) }}
                stroke={BRAND_ORANGE}
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
            return <Node key={pillar.id} pillar={pillar} localT={localT} />;
          })}
        </motion.div>

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