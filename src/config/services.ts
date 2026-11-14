import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Layers,
  AppWindow,
  Cloud,
  TestTube2,
  Smartphone,
  ShieldCheck,
  Headphones,
  ShoppingBag,
  HeartPulse,
  Code2,
  Shield,
  Bug,
  Gauge,
  BarChart3,
  Compass,
} from "lucide-react";
import { agents } from "@/config/agents";

export type ServiceItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export type ServiceSection = {
  id: string;
  label: string;
  items: ServiceItem[];
};

const agentIcons: Record<string, LucideIcon> = {
  sentinel: Shield,
  testbuddy: Bug,
  hermes: Gauge,
  prism: BarChart3,
  atlas: Compass,
};

export const coreServices: ServiceItem[] = [
  {
    title: "Enterprise AI & Tech Modernization",
    description:
      "Upgrade legacy systems, infrastructure, data ecosystems, and UI/UX.",
    href: "/what-we-do#enterprise-ai",
    icon: Sparkles,
  },
  {
    title: "AI-Native Product Engineering",
    description:
      "Design intelligent platforms and corporate systems from concept to rollout.",
    href: "/what-we-do#product-engineering",
    icon: Layers,
  },
  {
    title: "Enterprise Application Suites",
    description:
      "Custom software, gap analysis, evaluation, and API integrations.",
    href: "/what-we-do#enterprise-apps",
    icon: AppWindow,
  },
  {
    title: "Cloud & DevOps Services",
    description:
      "Scalable pipelines, automation, and zero-trust on AWS, Azure, and GCP.",
    href: "/what-we-do#cloud-devops",
    icon: Cloud,
  },
  {
    title: "Quality Assurance & Testing",
    description:
      "Automated functional, validation, and specialized performance testing.",
    href: "/what-we-do#qa-testing",
    icon: TestTube2,
  },
  {
    title: "Fintech & Mobile App Development",
    description:
      "Financial software architectures, payment flows, and mobile apps.",
    href: "/what-we-do#fintech-mobile",
    icon: Smartphone,
  },
];

export const aiPlatforms: ServiceItem[] = [
  {
    title: "TestBuddy Omni",
    description: "AI-powered end-to-end test automation and quality assurance.",
    href: "/what-we-do#testbuddy-omni",
    icon: TestTube2,
  },
];

export const industryAgents: ServiceItem[] = [
  {
    title: "Financial & Compliance Agents",
    description: "Risk monitoring, legal workflows, and regulatory checks.",
    href: "/what-we-do#financial-agents",
    icon: ShieldCheck,
  },
  {
    title: "Customer Service & Voice Agents",
    description: "Verification, routing, and intelligent reporting at scale.",
    href: "/what-we-do#voice-agents",
    icon: Headphones,
  },
  {
    title: "Retail Intelligence Agents",
    description: "Forecasting, recommendations, and customer intelligence.",
    href: "/what-we-do#retail-agents",
    icon: ShoppingBag,
  },
  {
    title: "Healthcare Knowledge Agents",
    description: "Clinical data processing and administrative workflows.",
    href: "/what-we-do#healthcare-agents",
    icon: HeartPulse,
  },
  {
    title: "Autonomous Engineering Workflows",
    description: "Code copilots for generation, refactoring, and architecture.",
    href: "/what-we-do#engineering-agents",
    icon: Code2,
  },
];

export const testingAgents: ServiceItem[] = agents.map((agent) => ({
  title: agent.codename,
  description: agent.tagline,
  href: `/agents/${agent.slug}`,
  icon: agentIcons[agent.slug] ?? Bug,
}));

export const serviceQuickLinks = [
  { label: "Request a Proof of Concept", href: "/book-demo" },
  { label: "Azure & Microsoft Partnership", href: "/what-we-do#partnerships" },
  { label: "Explore TestBuddy Omni", href: "/what-we-do#testbuddy-omni" },
];

export const agentQuickLinks = [
  { label: "Meet all testing agents", href: "/agents" },
  { label: "Book a demo", href: "/book-demo" },
  { label: "Quality assurance services", href: "/what-we-do#qa-testing" },
];
