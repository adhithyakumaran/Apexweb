import type { LucideIcon } from "lucide-react";
import { Radar, RefreshCcw, ShieldCheck, Fingerprint } from "lucide-react";

export type MoatPillar = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  angle: number;
};

export const moatPillars: MoatPillar[] = [
  {
    id: "coverage",
    label: "Continuous Agentic Coverage",
    description:
      "Turn critical user journeys into repeatable end-to-end coverage that can run throughout the delivery cycle.",
    icon: Radar,
    angle: -45,
  },
  {
    id: "healing",
    label: "Adaptive Test Intelligence",
    description:
      "Reduce maintenance overhead with agents that can respond to changing interfaces and workflows.",
    icon: RefreshCcw,
    angle: 45,
  },
  {
    id: "verification",
    label: "Consistent Release Verification",
    description:
      "Validate important paths against defined expectations so every release gets a consistent quality check.",
    icon: ShieldCheck,
    angle: 135,
  },
  {
    id: "assurance",
    label: "Enterprise-Ready Assurance",
    description:
      "Keep test activity structured and traceable with the controls and evidence teams need to operate with confidence.",
    icon: Fingerprint,
    angle: 225,
  },
];
