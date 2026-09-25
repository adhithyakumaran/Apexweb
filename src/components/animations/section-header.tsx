"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { smoothEase } from "@/components/animations/motion-presets";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
  delay?: number;
  variant?: "light" | "dark";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  delay = 0.15,
  variant = "light",
}: SectionHeaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const eyebrowClass =
    variant === "dark" ? "text-brand-orange" : "text-muted-foreground";
  const titleClass = variant === "dark" ? "text-footer-foreground" : "text-foreground";
  const descClass = variant === "dark" ? "text-footer-muted" : "text-muted-foreground";

  return (
    <motion.div
      className={`max-w-3xl ${alignClass} ${className}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.8, delay, ease: smoothEase }}
    >
      {eyebrow && (
        <p className={`text-sm font-medium uppercase tracking-[0.2em] ${eyebrowClass}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`${eyebrow ? "mt-4" : ""} text-3xl font-normal tracking-tight ${titleClass} sm:text-4xl lg:text-5xl`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${descClass} sm:text-lg`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
