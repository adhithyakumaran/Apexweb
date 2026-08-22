import type { LucideIcon } from "lucide-react";
import { Radar, RefreshCcw, ShieldCheck, Fingerprint } from "lucide-react";

export type MoatPillar = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  angle: number; // degrees, 0 = right, clockwise
};

// PLACEHOLDER COPY — swap for client-approved differentiator content (handover Section 15)
export const moatPillars: MoatPillar[] = [
  {
    id: "coverage",
    label: "Continuous Agentic Coverage",
    description: "Agents run end-to-end regression around the clock, not just at release time.",
    icon: Radar,
    angle: -45,
  },
  {
    id: "healing",
    label: "Self-Healing Test Intelligence",
    description: "Tests adapt automatically when the UI changes, without manual re-authoring.",
    icon: RefreshCcw,
    angle: 45,
  },
  {
    id: "verification",
    label: "Zero-Drift Verification",
    description: "Every release is checked against the same source of truth, every time.",
    icon: ShieldCheck,
    angle: 135,
  },
  {
    id: "assurance",
    label: "Enterprise-Grade Assurance",
    description: "Audit trails, access control, and compliance built into every run.",
    icon: Fingerprint,
    angle: 225,
  },
];