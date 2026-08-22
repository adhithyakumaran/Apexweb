export type Agent = {
  slug: string;
  codename: string;
  role: string;
  tagline: string;
  bg: string;
  accent: string;
  font: string;
};

export const agents: Agent[] = [
  {
    slug: "sentinel",
    codename: "Sentinel",
    role: "Security Agent",
    tagline: "Continuously probes your application for vulnerabilities before they ship.",
    bg: "bg-slate-100 dark:bg-slate-800",
    accent: "text-slate-900 dark:text-slate-50",
    font: "font-mono",
  },
  {
    slug: "testbuddy",
    codename: "TestBuddy",
    role: "Testing Agent",
    tagline: "Plans, writes, and runs end-to-end test coverage across your app.",
    bg: "bg-sky-100 dark:bg-sky-900",
    accent: "text-sky-900 dark:text-sky-50",
    font: "font-sans",
  },
  {
    slug: "hermes",
    codename: "Hermes",
    role: "Performance Agent",
    tagline: "Benchmarks and flags regressions before they reach production.",
    bg: "bg-amber-100 dark:bg-amber-900",
    accent: "text-amber-900 dark:text-amber-50",
    font: "font-serif",
  },
  {
    slug: "prism",
    codename: "Prism",
    role: "Analyst Agent",
    tagline: "Turns raw test signals into clear, actionable quality insights.",
    bg: "bg-violet-100 dark:bg-violet-900",
    accent: "text-violet-900 dark:text-violet-50",
    font: "font-sans italic",
  },
  {
    slug: "atlas",
    codename: "Atlas",
    role: "Blueprint Agent",
    tagline: "Maps your architecture and plans coverage across every workflow.",
    bg: "bg-emerald-100 dark:bg-emerald-900",
    accent: "text-emerald-900 dark:text-emerald-50",
    font: "font-mono",
  },
];