import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ChatbotAdmin } from "@/components/admin/chatbot-admin";
import { getChatbotSettings, listChatbotMemory } from "@/lib/cms/chatbot";

export const metadata: Metadata = {
  title: "Chat Bot",
  robots: { index: false, follow: false },
};

export default async function AdminChatbotPage() {
  const [settings, memory] = await Promise.all([getChatbotSettings(), listChatbotMemory()]);

  return (
    <AdminShell title="Chat Bot">
      <ChatbotAdmin initialSettings={settings} initialMemory={memory} />
    </AdminShell>
  );
}
