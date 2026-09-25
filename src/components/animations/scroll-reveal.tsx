"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import {
  cardReveal,
  cardTransition,
  defaultTransition,
  defaultViewport,
  fadeUp,
  smoothEase,
} from "@/components/animations/motion-presets";

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
};

export function ScrollReveal({
  children,
  delay = 0.15,
  className,
  y = 32,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ ...defaultTransition, delay, ease: smoothEase }}
    >
      {children}
    </motion.div>
  );
}

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
};

export function StaggerReveal({
  children,
  className,
  stagger = 0.12,
  delay = 0.2,
}: StaggerRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={cardReveal}
      transition={cardTransition}
    >
      {children}
    </motion.div>
  );
}

export function CardReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      transition={{ ...cardTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
