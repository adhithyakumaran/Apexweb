import { agents } from "@/config/agents";
import { siteConfig } from "@/config/site";
import { moatPillars } from "@/config/moat";

export type StructuredFaq = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

export const structuredFaqs: StructuredFaq[] = [
  {
    id: "what-is-apex",
    question: "What is Apex Node?",
    answer:
      "Apex Node is an enterprise AI-powered QA automation platform that uses specialized agents for agentic, end-to-end test coverage across your applications.",
    tags: ["platform", "overview"],
  },
  {
    id: "agentic-qa",
    question: "How does agentic QA work?",
    answer:
      "Agentic QA uses autonomous agents that plan, execute, and adapt tests—continuously probing workflows, healing when UIs change, and reporting actionable quality signals.",
    tags: ["agentic", "automation"],
  },
  {
    id: "oracle-apex",
    question: "Can Apex Node test Oracle APEX?",
    answer:
      "Apex Node is designed for modern web and enterprise application stacks. Contact us to discuss Oracle APEX and your specific testing requirements—we can outline supported integrations for your environment.",
    tags: ["integrations", "oracle"],
  },
  {
    id: "integrations",
    question: "What integrations are supported?",
    answer:
      "Apex Node integrates with CI/CD pipelines, issue trackers, and cloud environments. Enterprise deployments support custom connectors—book a demo to review your stack.",
    tags: ["integrations"],
  },
  {
    id: "pricing-enterprise",
    question: "Which plan supports enterprise QA?",
    answer:
      "Enterprise QA includes governance, audit trails, access control, and dedicated support. See our Pricing page or contact sales for a tailored quote.",
    tags: ["pricing", "enterprise"],
  },
];

export function getStructuredKnowledgeText(): string {
  const agentLines = agents.map(
    (a) => `${a.codename} (${a.role}): ${a.tagline}`
  );
  const moatLines = moatPillars.map((p) => `${p.label}: ${p.description}`);
  const faqLines = structuredFaqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`);

  return [
    `Company: ${siteConfig.name}`,
    siteConfig.description,
    `Contact email: ${siteConfig.contact.email}`,
    `Contact phone: ${siteConfig.contact.phone}`,
    "",
    "Agents:",
    ...agentLines,
    "",
    "Platform differentiators:",
    ...moatLines,
    "",
    "FAQs:",
    ...faqLines,
  ].join("\n");
}

export const defaultRelatedQuestions = [
  "What does Apex Node automate?",
  "How does agentic QA work?",
  "Can Apex Node test Oracle APEX?",
  "What integrations are supported?",
];
