import type { Metadata } from "next";
import { AgentsPageContent } from "@/components/pages/agents-page-content";

export const metadata: Metadata = {
  title: "Agents",
  description:
    "Meet Apex Node testing agents — Sentinel, TestBuddy, Hermes, Prism, and Atlas — plus industry-specific AI agents.",
};

export default function AgentsPage() {
  return <AgentsPageContent />;
}
