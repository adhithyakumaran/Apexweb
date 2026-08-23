import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Chat Bot",
  robots: { index: false, follow: false },
};

export default function AdminChatbotPage() {
  return (
    <AdminShell
      title="Chat Bot"
      description="Configure and manage the site chatbot. Coming soon."
    >
      <div className="rounded-md border border-[#333] bg-black px-6 py-16 text-center">
        <p className="text-[13px] font-medium text-[#ededed]">Chat Bot</p>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-[#666]">
          This section is reserved for chatbot configuration and conversation management.
        </p>
      </div>
    </AdminShell>
  );
}
