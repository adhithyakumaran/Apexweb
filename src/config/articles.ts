export type ArticleTemplate = "standard" | "case-study" | "insight" | "agent-spotlight";

export type ArticleCategory = "articles" | "case-studies" | "insights" | "agents";

export type ArticleAuthor = {
  name: string;
  role: string;
};

export type ArticleSection = {
  heading?: string;
  body: string[];
};

export type CaseStudyMetric = {
  label: string;
  value: string;
};

export type ArticleContent = {
  intro: string;
  sections: ArticleSection[];
  pullQuote?: string;
  // case-study
  client?: string;
  industry?: string;
  challenge?: string;
  solution?: string;
  results?: CaseStudyMetric[];
  // agent-spotlight
  agentSlug?: string;
  capabilities?: string[];
  // insight
  keyTakeaways?: string[];
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  template: ArticleTemplate;
  category: ArticleCategory;
  topic: string;
  readTime: number;
  publishedAt: string;
  author: ArticleAuthor;
  featured?: boolean;
  tags: string[];
  cover: {
    accent: string;
    label: string;
  };
  content: ArticleContent;
};

export const articleTemplateLabels: Record<ArticleTemplate, string> = {
  standard: "Article",
  "case-study": "Case Study",
  insight: "Insight Brief",
  "agent-spotlight": "Agent Spotlight",
};

export const articleCategoryLabels: Record<ArticleCategory, string> = {
  articles: "Articles",
  "case-studies": "Case Studies",
  insights: "Insights",
  agents: "Agents",
};

export const articles: Article[] = [
  {
    slug: "fintech-regression-testing-testbuddy",
    title: "How a fintech team cut regression cycles by 60% with TestBuddy",
    excerpt:
      "A payments platform replaced brittle nightly suites with agentic end-to-end coverage — shipping twice as often with fewer escaped defects.",
    template: "case-study",
    category: "case-studies",
    topic: "TestBuddy",
    readTime: 8,
    publishedAt: "2026-07-14",
    featured: true,
    author: { name: "Priya Natarajan", role: "Head of QA Practice" },
    tags: ["Fintech", "Regression", "E2E Testing"],
    cover: { accent: "from-sky-500/20 via-sky-500/5 to-transparent", label: "Case Study" },
    content: {
      intro:
        "When release cadence outpaced manual regression, this Series B fintech needed coverage that could keep up without hiring an army of testers. TestBuddy became the orchestration layer across their microservices stack.",
      client: "Confidential payments platform (Series B)",
      industry: "Financial Services",
      challenge:
        "Fourteen microservices, twice-weekly releases, and a regression suite that took 36 hours to run. Flaky tests eroded trust; critical payment flows were under-covered.",
      solution:
        "Apex Node deployed TestBuddy to map user journeys, generate targeted E2E specs, and run parallel suites in CI. Sentinel joined the pipeline for security checks on every PR.",
      results: [
        { label: "Regression runtime", value: "−60%" },
        { label: "Escaped defects", value: "−42%" },
        { label: "Release frequency", value: "2×" },
        { label: "Coverage breadth", value: "+85%" },
      ],
      sections: [
        {
          heading: "Mapping the payment graph",
          body: [
            "TestBuddy started by ingesting API contracts and staging traffic patterns. Within a week, it produced a workflow map across checkout, settlement, and reconciliation — surfaces the team had never fully automated.",
            "Human QA leads reviewed and approved generated scenarios before they entered the nightly pipeline, preserving domain expertise while eliminating script maintenance toil.",
          ],
        },
        {
          heading: "CI integration without disruption",
          body: [
            "Rather than a big-bang migration, suites rolled out service-by-service. Failed runs surfaced with Prism-generated summaries so developers could act in minutes, not days.",
          ],
        },
      ],
      pullQuote:
        "We stopped debating whether we could ship — we started debating what to ship next.",
    },
  },
  {
    slug: "enterprise-playbook-agentic-qa",
    title: "The enterprise playbook for agentic QA automation",
    excerpt:
      "A practical framework for moving from fragmented test tooling to governed, agent-driven quality across large engineering orgs.",
    template: "standard",
    category: "articles",
    topic: "QA Strategy",
    readTime: 12,
    publishedAt: "2026-06-28",
    author: { name: "Arjun Mehta", role: "Chief Technology Officer" },
    tags: ["Enterprise", "Strategy", "Automation"],
    cover: { accent: "from-brand-orange/25 via-brand-orange/5 to-transparent", label: "Article" },
    content: {
      intro:
        "Enterprise QA rarely fails for lack of tools — it fails when coverage, ownership, and release velocity pull in different directions. Agentic automation reframes quality as a continuous, intelligent layer rather than a gate at the end of the sprint.",
      sections: [
        {
          heading: "Phase 1 — Baseline your quality surface",
          body: [
            "Inventory critical user journeys, compliance requirements, and existing automation debt. Atlas excels here: it maps architecture and identifies coverage gaps before a single new test is written.",
            "Establish SLAs for defect escape rate, mean time to detect, and suite reliability. These become the north-star metrics agents optimize against.",
          ],
        },
        {
          heading: "Phase 2 — Introduce agents incrementally",
          body: [
            "Start with one high-value workflow — often payments, auth, or onboarding. Deploy TestBuddy for functional coverage and Hermes for performance baselines on the same paths.",
            "Keep humans in the loop for scenario approval. Agents propose; specialists govern. This balance scales trust across security-conscious enterprises.",
          ],
        },
        {
          heading: "Phase 3 — Govern and scale",
          body: [
            "Centralize agent orchestration with elsai-style governance: audit trails, role-based approvals, and environment isolation. Feed results into Prism dashboards for executive visibility.",
            "Expand to industry-specific agents — financial compliance, healthcare knowledge workflows — as domain teams adopt the platform.",
          ],
        },
      ],
      pullQuote:
        "Agentic QA is not about replacing testers. It is about giving every release the scrutiny of your best specialist, on every commit.",
    },
  },
  {
    slug: "sentinel-ci-pipeline-security",
    title: "Why Sentinel belongs in your CI pipeline",
    excerpt:
      "Continuous security probing catches vulnerability classes that quarterly pen tests miss — without slowing developers down.",
    template: "agent-spotlight",
    category: "agents",
    topic: "Sentinel",
    readTime: 6,
    publishedAt: "2026-06-10",
    author: { name: "Kavya Reddy", role: "Security Engineering Lead" },
    tags: ["Security", "CI/CD", "DevSecOps"],
    cover: { accent: "from-slate-500/20 via-slate-500/5 to-transparent", label: "Agent Spotlight" },
    content: {
      intro:
        "Sentinel operates like a tireless security researcher embedded in your delivery pipeline. It probes APIs, auth flows, and dependency surfaces continuously — surfacing issues when they are cheapest to fix.",
      agentSlug: "sentinel",
      capabilities: [
        "OWASP-aligned vulnerability scanning on every build",
        "Auth boundary fuzzing and session fixation checks",
        "Dependency and secrets exposure monitoring",
        "Prioritized findings with reproduction steps",
      ],
      sections: [
        {
          heading: "Shift-left without shift-blame",
          body: [
            "Sentinel reports flow directly into developer channels with severity, impact, and suggested remediation — framed as engineering tasks, not audit findings.",
            "Integration with GitHub Actions, Azure DevOps, and Jenkins takes under an hour for most teams.",
          ],
        },
        {
          heading: "Pair with functional agents",
          body: [
            "When TestBuddy validates happy paths, Sentinel stress-tests edge cases and abuse scenarios on the same endpoints. Combined coverage catches issues neither agent would find alone.",
          ],
        },
      ],
      pullQuote:
        "Security that only runs quarterly is security that only works quarterly.",
    },
  },
  {
    slug: "healthcare-compliance-ai-agents",
    title: "Healthcare platform achieves compliance-ready testing with AI agents",
    excerpt:
      "A clinical data platform automated HIPAA-sensitive workflow validation while maintaining full audit trails for regulatory review.",
    template: "case-study",
    category: "case-studies",
    topic: "Healthcare",
    readTime: 9,
    publishedAt: "2026-05-22",
    author: { name: "Priya Natarajan", role: "Head of QA Practice" },
    tags: ["Healthcare", "Compliance", "HIPAA"],
    cover: { accent: "from-emerald-500/20 via-emerald-500/5 to-transparent", label: "Case Study" },
    content: {
      intro:
        "Regulated healthcare software demands evidence — not just passing tests. This platform team used industry-specific knowledge agents alongside TestBuddy to produce audit-ready quality artifacts.",
      client: "Clinical data platform (US market)",
      industry: "Healthcare",
      challenge:
        "Manual validation of PHI handling workflows could not scale with quarterly release trains. Audit preparation consumed weeks of specialist time each cycle.",
      solution:
        "Healthcare Knowledge Agents mapped administrative and clinical data flows. TestBuddy automated regression across patient intake, provider portals, and billing integrations with governed data fixtures.",
      results: [
        { label: "Audit prep time", value: "−70%" },
        { label: "Workflow coverage", value: "+120%" },
        { label: "Compliance findings", value: "0 critical" },
        { label: "Release confidence", value: "↑ High" },
      ],
      sections: [
        {
          heading: "Governed test data",
          body: [
            "Synthetic PHI fixtures were generated and versioned through elsai orchestration. Every test run linked to an immutable audit record — satisfying internal compliance and external reviewer requirements.",
          ],
        },
        {
          heading: "Continuous compliance signals",
          body: [
            "Prism dashboards gave compliance officers weekly visibility into coverage trends and open risk areas, replacing ad-hoc spreadsheet reporting.",
          ],
        },
      ],
      pullQuote:
        "For the first time, our compliance team saw quality data in real time — not after the release shipped.",
    },
  },
  {
    slug: "five-signals-ready-for-atlas",
    title: "Five signals your QA stack is ready for Atlas",
    excerpt:
      "Short checklist for engineering leaders evaluating architecture-aware test planning and coverage mapping.",
    template: "insight",
    category: "insights",
    topic: "Atlas",
    readTime: 4,
    publishedAt: "2026-05-08",
    author: { name: "Arjun Mehta", role: "Chief Technology Officer" },
    tags: ["Atlas", "Readiness", "Architecture"],
    cover: { accent: "from-violet-500/20 via-violet-500/5 to-transparent", label: "Insight" },
    content: {
      intro:
        "Atlas shines when teams have outgrown ad-hoc test plans but are not ready to drown in maintenance. These five signals indicate you will see ROI within the first sprint.",
      keyTakeaways: [
        "Microservices or modular monolith with 8+ deployable units",
        "No single diagram of critical user journeys exists today",
        "Regression suites grow faster than product surface area",
        "New engineers take weeks to understand what must be tested",
        "Leadership asks for coverage metrics you cannot produce quickly",
      ],
      sections: [
        {
          heading: "What Atlas does on day one",
          body: [
            "Atlas ingests repository structure, API specs, and existing test metadata to produce a living coverage map. Gaps are ranked by business impact, not arbitrary line coverage percentages.",
            "From there, TestBuddy and Hermes receive targeted work orders — eliminating the spray-and-pray approach to automation.",
          ],
        },
      ],
      pullQuote:
        "You cannot automate what you have not mapped. Atlas makes the map.",
    },
  },
];
