export type PageContext = {
  pathname: string;
  title?: string;
  section?: string;
};

export type CitationSource = {
  id: string;
  title: string;
  href?: string;
  type: "website" | "document" | "structured";
};

export type AskAiRequest = {
  question: string;
  conversationId?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  pageContext?: PageContext;
  regenerate?: boolean;
};

export type AskAiResponse = {
  answer: string;
  conversationId: string;
  sources: CitationSource[];
  relatedQuestions: string[];
  ctas?: { label: string; href: string }[];
  /** When true, response used local fallback retrieval (not production LLM+RAG) */
  fallbackMode: boolean;
};
