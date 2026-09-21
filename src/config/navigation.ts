export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type MegaMenuPanel = {
  id: string;
  label: string;
  href?: string;
  /** Direct link items skip mega menu */
  directLink?: boolean;
  context: {
    title: string;
    description: string;
    cta?: { label: string; href: string };
  };
  columns: {
    title?: string;
    links: NavLink[];
  }[];
};

export const megaNav: MegaMenuPanel[] = [
  {
    id: "what-we-do",
    label: "What We Do",
    context: {
      title: "Infrastructure to intelligence",
      description:
        "Agentic QA, enterprise automation, and continuous validation built for modern delivery teams.",
      cta: { label: "Explore services", href: "/what-we-do" },
    },
    columns: [
      {
        links: [
          {
            label: "AI-Powered QA",
            href: "/what-we-do#ai-powered-qa",
            description: "Autonomous agents for end-to-end coverage",
          },
          {
            label: "Agentic Testing",
            href: "/agents",
            description: "Specialized agents for security, performance, and more",
          },
          {
            label: "Enterprise QA",
            href: "/what-we-do#enterprise-qa",
            description: "Governance, audit trails, and scale",
          },
          {
            label: "Automation",
            href: "/what-we-do#automation",
            description: "Self-healing tests and CI/CD integration",
          },
          {
            label: "Security",
            href: "/agents/sentinel",
            description: "Continuous vulnerability probing",
          },
          {
            label: "Analytics",
            href: "/agents/prism",
            description: "Quality insights from test signals",
          },
        ],
      },
    ],
  },
  {
    id: "who-we-are",
    label: "Who We Are",
    context: {
      title: "About Apex Node",
      description:
        "We help enterprises ship with confidence through agentic QA that moves at the pace of your releases.",
      cta: { label: "Discover the difference", href: "/who-we-are" },
    },
    columns: [
      {
        links: [
          {
            label: "About Apex Node",
            href: "/who-we-are",
            description: "Our mission and story",
          },
          {
            label: "Our Approach",
            href: "/who-we-are#approach",
            description: "How we partner with delivery teams",
          },
          {
            label: "Leadership",
            href: "/who-we-are#leadership",
            description: "The team behind the platform",
          },
          {
            label: "Careers",
            href: "/who-we-are#careers",
            description: "Join us in redefining QA",
          },
          {
            label: "Contact",
            href: "/contact",
            description: "Talk to our specialists",
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
        "Perspectives on agentic AI, enterprise testing, and trends shaping quality engineering.",
      cta: { label: "View all insights", href: "/insights" },
    },
    columns: [
      {
        links: [
          {
            label: "QA Engineering",
            href: "/insights#qa-engineering",
            description: "Practices for high-velocity teams",
          },
          {
            label: "Agentic AI",
            href: "/insights#agentic-ai",
            description: "Autonomous testing in production",
          },
          {
            label: "Enterprise AI",
            href: "/insights#enterprise-ai",
            description: "Governance and safe adoption",
          },
          {
            label: "Testing Trends",
            href: "/insights#trends",
            description: "What leaders are watching",
          },
          {
            label: "Case Studies",
            href: "/insights#case-studies",
            description: "Outcomes from the field",
          },
          {
            label: "Resources",
            href: "/insights#resources",
            description: "Guides and reference material",
          },
        ],
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    href: "/pricing",
    directLink: true,
    context: { title: "", description: "" },
    columns: [],
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    directLink: true,
    context: { title: "", description: "" },
    columns: [],
  },
];

/** Flat list for footer and legacy consumers */
export const mainNav = megaNav.map((item) => ({
  label: item.label,
  href: item.href ?? `/${item.id}`,
}));

export const whatsappCta = {
  label: "Let's Talk",
};

export const tryItCta = {
  label: "Try it Free",
  href: "/book-demo",
};
