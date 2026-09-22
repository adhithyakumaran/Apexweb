import {
  coreServices,
  testingAgents,
  type ServiceItem,
} from "@/config/services";
import { siteConfig } from "@/config/site";

export type MegaNavLink = {
  label: string;
  href: string;
  description?: string;
};

export type MegaNavPanel = {
  id: string;
  label: string;
  context: {
    title: string;
    description: string;
    cta?: { label: string; href: string };
  };
  columns: { title?: string; links: MegaNavLink[] }[];
};

function fromService(item: ServiceItem): MegaNavLink {
  return {
    label: item.title,
    href: item.href,
    description: item.description,
  };
}

/** Desktop/mobile primary navbar (mega menus + direct links). */
export const primaryNavPanels: MegaNavPanel[] = [
  {
    id: "what-we-do",
    label: "What We Do",
    context: {
      title: "What We Do",
      description:
        "Build reliable software quality with intelligent automation—enterprise modernization, QA, and agentic testing from Apex Node.",
      cta: { label: "Explore services", href: "/what-we-do" },
    },
    columns: [
      {
        title: "AI & QA",
        links: [
          fromService(coreServices[0]),
          fromService(coreServices[4]),
          ...testingAgents.slice(0, 3).map(fromService),
        ],
      },
      {
        title: "Engineering & platforms",
        links: [
          fromService(coreServices[1]),
          fromService(coreServices[2]),
          fromService(coreServices[3]),
          fromService(coreServices[5]),
        ],
      },
    ],
  },
  {
    id: "who-we-are",
    label: "Who We Are",
    context: {
      title: "Who We Are",
      description: siteConfig.description,
      cta: { label: "Meet our agents", href: "/agents" },
    },
    columns: [
      {
        links: [
          {
            label: "About Apex Node",
            href: "/",
            description: "Enterprise agentic QA and AI-powered test automation.",
          },
          {
            label: "Our approach",
            href: "/what-we-do",
            description: "Services spanning modernization, cloud, and quality engineering.",
          },
          {
            label: "Why Apex Node",
            href: "/what-we-do#qa-testing",
            description: "Continuous agentic coverage and self-healing test intelligence.",
          },
          {
            label: "Testing agents",
            href: "/agents",
            description: "Sentinel, TestBuddy, Hermes, Prism, and Atlas.",
          },
          {
            label: "Contact",
            href: "/contact",
            description: "Talk to our QA specialists.",
          },
        ],
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    context: {
      title: "Insights",
      description:
        "Articles and perspectives on QA engineering, agentic AI, and enterprise quality from Apex Node.",
      cta: { label: "View articles", href: "/articles" },
    },
    columns: [
      {
        links: [
          {
            label: "All articles",
            href: "/articles",
            description: "Case studies, guides, and product updates.",
          },
        ],
      },
    ],
  },
];

export const primaryNavDirectLinks = [
  { label: "Pricing", href: "/contact" },
  { label: "Contact", href: "/contact" },
] as const;
