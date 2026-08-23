"use client";

import { useEffect, useRef, useState } from "react";

export function AgentCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isWide = window.matchMedia("(min-width: 768px)").matches;
    if (!canHover || !isWide) return;

    setEnabled(true);

    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let targetX = -100;
    let targetY = -100;
    let hasMoved = false;
    let raf = 0;

    function applyTransform() {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
    }

    function handleMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        dotX = targetX;
        dotY = targetY;
        ringX = targetX;
        ringY = targetY;
        applyTransform();
        setVisible(true);
      }
    }

    function loop() {
      if (hasMoved) {
        dotX += (targetX - dotX) * 0.35;
        dotY += (targetY - dotY) * 0.35;
        ringX += (targetX - ringX) * 0.12;
        ringY += (targetY - ringY) * 0.12;
        applyTransform();
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] size-10 rounded-full border border-foreground/70 shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-opacity duration-150"
        style={{ opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] size-1.5 rounded-full bg-foreground transition-opacity duration-150"
        style={{ opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
    </>
  );
}
