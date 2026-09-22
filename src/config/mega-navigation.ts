import {
  aiPlatforms,
  coreServices,
  industryAgents,
  testingAgents,
  type ServiceItem,
} from "@/config/services";
import { siteConfig } from "@/config/site";

export type MegaNavLink = {
  label: string;
  href: string;
  description?: string;
};

export type MegaNavCategory = {
  id: string;
  label: string;
  links: MegaNavLink[];
};

export type MegaNavPanel = {
  id: string;
  label: string;
  context: {
    title: string;
    description: string;
    cta?: { label: string; href: string };
  };
  /** TCS-style vertical tabs + right content */
  categories?: MegaNavCategory[];
  /** Simple fallback when categories are not used */
  columns?: { title?: string; links: MegaNavLink[] }[];
};

function fromService(item: ServiceItem): MegaNavLink {
  return {
    label: item.title,
    href: item.href,
    description: item.description,
  };
}

export const primaryNavPanels: MegaNavPanel[] = [
  {
    id: "what-we-do",
    label: "What We Do",
    context: {
      title: "Infrastructure to intelligence",
      description:
        "Build reliable software quality with intelligent automation—enterprise modernization, agentic QA, and continuous validation from Apex Node.",
      cta: { label: "Explore services", href: "/what-we-do" },
    },
    categories: [
      {
        id: "industries",
        label: "Industries",
        links: industryAgents.map(fromService),
      },
      {
        id: "services",
        label: "Services",
        links: coreServices.map(fromService),
      },
      {
        id: "platforms",
        label: "AI Platforms",
        links: aiPlatforms.map(fromService),
      },
      {
        id: "agents",
        label: "Testing Agents",
        links: testingAgents.map(fromService),
      },
    ],
  },
  {
    id: "who-we-are",
    label: "Who We Are",
    context: {
      title: "About Apex Node",
      description: siteConfig.description,
      cta: { label: "Meet our agents", href: "/agents" },
    },
    categories: [
      {
        id: "company",
        label: "Company",
        links: [
          {
            label: "About Apex Node",
            href: "/",
            description: "Enterprise agentic QA and AI-powered test automation.",
          },
          {
            label: "Our approach",
            href: "/what-we-do",
            description: "Modernization, cloud, and quality engineering services.",
          },
          {
            label: "Why Apex Node",
            href: "/what-we-do#qa-testing",
            description: "Continuous agentic coverage and self-healing tests.",
          },
        ],
      },
      {
        id: "connect",
        label: "Connect",
        links: [
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
      title: "Ideas for modern QA",
      description:
        "Perspectives on QA engineering, agentic AI, and enterprise quality from the Apex Node team.",
      cta: { label: "View articles", href: "/articles" },
    },
    categories: [
      {
        id: "articles",
        label: "Articles",
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
