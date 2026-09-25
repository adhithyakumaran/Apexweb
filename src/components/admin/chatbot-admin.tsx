"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import {
  AdminAlert,
  AdminPanel,
  AdminPanelBody,
  AdminPanelHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminStatusDot,
} from "@/components/admin/admin-ui";
import { GROQ_MODEL_OPTIONS } from "@/lib/chatbot/groq";
import { adminClasses } from "@/components/admin/admin-theme";
import {
  CHATBOT_SKILL_SUGGESTIONS,
  CHATBOT_TONES,
  type ChatbotMemoryItem,
  type ChatbotSettings,
} from "@/lib/cms/chatbot-shared";

type ChatbotAdminProps = {
  initialSettings: ChatbotSettings;
  initialMemory: ChatbotMemoryItem[];
};

export function ChatbotAdmin({ initialSettings, initialMemory }: ChatbotAdminProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [memory, setMemory] = useState(initialMemory);
  const [saving, setSaving] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [memoryName, setMemoryName] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [memoryUrl, setMemoryUrl] = useState("");
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (!initialSettings.crawlBaseUrl && typeof window !== "undefined") {
      setSettings((s) => ({ ...s, crawlBaseUrl: window.location.origin }));
    }
  }, [initialSettings.crawlBaseUrl]);

  async function saveSettings() {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/cms/chatbot/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await response.json()) as { settings?: ChatbotSettings; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Failed to save");
      setSettings(data.settings ?? settings);
      setMessage("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function addTextMemory() {
    if (!memoryName.trim() || !memoryText.trim()) return;
    setError("");

    const response = await fetch("/api/cms/chatbot/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: memoryName.trim(), type: "text", content: memoryText.trim() }),
    });

    const data = (await response.json()) as { item?: ChatbotMemoryItem; error?: string };
    if (!response.ok) {
      setError(data.error ?? "Failed to add memory");
      return;
    }

    if (data.item) setMemory((items) => [data.item!, ...items]);
    setMemoryName("");
    setMemoryText("");
    setMessage("Memory added.");
  }

  async function addUrlMemory() {
    if (!memoryName.trim() || !memoryUrl.trim()) return;
    setError("");

    const response = await fetch("/api/cms/chatbot/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: memoryName.trim(),
        type: "url",
        sourceUrl: memoryUrl.trim(),
        content: `Reference URL: ${memoryUrl.trim()}`,
      }),
    });

    const data = (await response.json()) as { item?: ChatbotMemoryItem; error?: string };
    if (!response.ok) {
      setError(data.error ?? "Failed to add URL");
      return;
    }

    if (data.item) setMemory((items) => [data.item!, ...items]);
    setMemoryName("");
    setMemoryUrl("");
    setMessage("URL reference added.");
  }

  async function uploadPdf(file: File) {
    setError("");
    const body = new FormData();
    body.append("file", file);

    const upload = await fetch("/api/cms/upload", { method: "POST", body });
    const uploadData = (await upload.json()) as { url?: string; name?: string; error?: string };
    if (!upload.ok) {
      setError(uploadData.error ?? "Upload failed");
      return;
    }

    const response = await fetch("/api/cms/chatbot/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: memoryName.trim() || uploadData.name || file.name,
        type: "pdf",
        fileUrl: uploadData.url,
        content: `PDF document: ${uploadData.name ?? file.name}`,
      }),
    });

    const data = (await response.json()) as { item?: ChatbotMemoryItem; error?: string };
    if (!response.ok) {
      setError(data.error ?? "Failed to save PDF memory");
      return;
    }

    if (data.item) setMemory((items) => [data.item!, ...items]);
    setMemoryName("");
    setMessage("PDF added to memory.");
  }

  async function deleteMemory(id: number) {
    const response = await fetch(`/api/cms/chatbot/memory/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setMemory((items) => items.filter((item) => item.id !== id));
  }

  async function runCrawl() {
    setCrawling(true);
    setError("");
    setMessage("");

    try {
      const saveRes = await fetch("/api/cms/chatbot/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crawlBaseUrl: settings.crawlBaseUrl, crawlEnabled: settings.crawlEnabled }),
      });
      if (!saveRes.ok) {
        const saveData = (await saveRes.json()) as { error?: string };
        throw new Error(saveData.error ?? "Save crawl URL before crawling");
      }

      const response = await fetch("/api/cms/chatbot/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crawlBaseUrl: settings.crawlBaseUrl }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok) throw new Error(data.message ?? "Crawl failed");
      setMessage(data.message ?? "Crawl complete.");
      const memRes = await fetch("/api/cms/chatbot/memory");
      const memData = (await memRes.json()) as { memory?: ChatbotMemoryItem[] };
      if (memData.memory) setMemory(memData.memory);
      setSettings((s) => ({ ...s, lastCrawledAt: new Date().toISOString() }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crawl failed");
    } finally {
      setCrawling(false);
    }
  }

  function addSkill(skill: string) {
    if (!skill.trim() || settings.skills.includes(skill.trim())) return;
    setSettings((s) => ({ ...s, skills: [...s.skills, skill.trim()] }));
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSettings((s) => ({ ...s, skills: s.skills.filter((item) => item !== skill) }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 border-b border-[#333] pb-4">
        <AdminStatusDot tone={settings.groqConfigured ? "success" : "warning"}>
          {settings.groqConfigured ? "Groq API key set" : "GROQ_API_KEY not set"}
        </AdminStatusDot>
        <AdminStatusDot tone={settings.enabled ? "success" : "neutral"}>
          {settings.enabled ? "Bot enabled" : "Bot disabled"}
        </AdminStatusDot>
        {settings.lastCrawledAt && (
          <span className="text-[13px] text-[#666]">
            Last crawl {new Date(settings.lastCrawledAt).toLocaleString()}
          </span>
        )}
      </div>

      {message && <AdminAlert tone="info">{message}</AdminAlert>}
      {error && <AdminAlert tone="danger">{error}</AdminAlert>}

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminPanel>
          <AdminPanelHeader title="Model & provider" description="Groq free tier — swap API key in Vercel when ready." />
          <AdminPanelBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[13px] text-[#a1a1a1]">Provider</label>
                <input
                  value={settings.provider}
                  onChange={(e) => setSettings((s) => ({ ...s, provider: e.target.value }))}
                  className={adminClasses.input}
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="groq-model" className="text-[13px] text-[#a1a1a1]">
                  Model
                </label>
                <select
                  id="groq-model"
                  value={settings.model}
                  onChange={(e) => setSettings((s) => ({ ...s, model: e.target.value }))}
                  className={adminClasses.input}
                >
                  {GROQ_MODEL_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#666]">
                  If GPT-OSS shows a 403 error, use Qwen or enable models at{" "}
                  <a
                    href="https://console.groq.com/settings/project/limits"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Groq project limits
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] text-[#a1a1a1]">System prompt</label>
              <textarea
                value={settings.systemPrompt}
                onChange={(e) => setSettings((s) => ({ ...s, systemPrompt: e.target.value }))}
                className="min-h-28 w-full rounded border border-[#333] bg-black px-2.5 py-2 text-[13px] text-[#ededed]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] text-[#a1a1a1]">Welcome message</label>
              <input
                value={settings.welcomeMessage}
                onChange={(e) => setSettings((s) => ({ ...s, welcomeMessage: e.target.value }))}
                className={adminClasses.input}
              />
            </div>

            <label className="flex items-center gap-2 text-[13px] text-[#a1a1a1]">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings((s) => ({ ...s, enabled: e.target.checked }))}
                className="size-4 rounded border-[#333]"
              />
              Enable chatbot on website (widget connects later)
            </label>
          </AdminPanelBody>
        </AdminPanel>

        <AdminPanel>
          <AdminPanelHeader title="Tone & skills" description="How the bot speaks and what it can help with." />
          <AdminPanelBody className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#a1a1a1]">Tone</label>
              <select
                value={settings.tone}
                onChange={(e) => setSettings((s) => ({ ...s, tone: e.target.value as ChatbotSettings["tone"] }))}
                className={adminClasses.input}
              >
                {CHATBOT_TONES.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] text-[#a1a1a1]">Skills</label>
              <div className="flex flex-wrap gap-1.5">
                {settings.skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded border border-[#333] px-2 py-0.5 text-[12px] text-[#a1a1a1] hover:border-[#666] hover:text-white"
                  >
                    {skill} ×
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))}
                  placeholder="Add a skill"
                  className={adminClasses.input}
                />
                <AdminSecondaryButton onClick={() => addSkill(skillInput)}>Add</AdminSecondaryButton>
              </div>
              <div className="flex flex-wrap gap-1">
                {CHATBOT_SKILL_SUGGESTIONS.filter((s) => !settings.skills.includes(s)).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="text-[12px] text-[#666] hover:text-[#ededed]"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </AdminPanelBody>
        </AdminPanel>
      </div>

      <AdminPanel>
        <AdminPanelHeader
          title="Website knowledge"
          description="Crawl your public site so the bot knows your pages, plus manual memory below."
          action={
            <AdminSecondaryButton onClick={runCrawl} className={crawling ? "opacity-60" : ""}>
              {crawling ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
              Crawl site
            </AdminSecondaryButton>
          }
        />
        <AdminPanelBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-1.5">
              <label className="text-[13px] text-[#a1a1a1]">Crawl base URL</label>
              <input
                value={settings.crawlBaseUrl}
                onChange={(e) => setSettings((s) => ({ ...s, crawlBaseUrl: e.target.value }))}
                placeholder="https://apexweb-three.vercel.app"
                className={adminClasses.input}
              />
            </div>
            <label className="flex items-end gap-2 pb-1 text-[13px] text-[#a1a1a1]">
              <input
                type="checkbox"
                checked={settings.crawlEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, crawlEnabled: e.target.checked }))}
                className="size-4 rounded border-[#333]"
              />
              Auto-crawl enabled
            </label>
          </div>
        </AdminPanelBody>
      </AdminPanel>

      <AdminPanel>
        <AdminPanelHeader title="Memory sources" description="Text, PDFs, and URLs the bot can reference when answering." />
        <AdminPanelBody className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <input
                value={memoryName}
                onChange={(e) => setMemoryName(e.target.value)}
                placeholder="Source name"
                className={adminClasses.input}
              />
              <textarea
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Paste text knowledge…"
                className="min-h-24 w-full rounded border border-[#333] bg-black px-2.5 py-2 text-[13px] text-[#ededed]"
              />
              <AdminSecondaryButton onClick={addTextMemory}>
                <Plus className="size-3.5" />
                Add text
              </AdminSecondaryButton>
            </div>

            <div className="space-y-3">
              <input
                value={memoryUrl}
                onChange={(e) => setMemoryUrl(e.target.value)}
                placeholder="https://…"
                className={adminClasses.input}
              />
              <AdminSecondaryButton onClick={addUrlMemory}>
                <Plus className="size-3.5" />
                Add URL
              </AdminSecondaryButton>

              <label className="inline-flex cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadPdf(file);
                  }}
                />
                <span className={adminClasses.secondaryBtn}>
                  <Upload className="size-3.5" />
                  Upload PDF / text file
                </span>
              </label>
            </div>
          </div>

          {memory.length > 0 && (
            <div className="overflow-hidden rounded-md border border-[#333]">
              <div className="grid grid-cols-[minmax(0,1fr)_5rem_5rem_4rem] gap-4 border-b border-[#333] px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-[#666]">
                <span>Source</span>
                <span>Type</span>
                <span className="text-right">Chars</span>
                <span className="text-right"> </span>
              </div>
              {memory.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-[minmax(0,1fr)_5rem_5rem_4rem] items-center gap-4 px-4 py-2.5 text-[13px] ${
                    index !== memory.length - 1 ? "border-b border-[#333]" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#ededed]">{item.name}</p>
                    {(item.sourceUrl || item.fileUrl) && (
                      <p className="truncate font-mono text-[11px] text-[#666]">
                        {item.sourceUrl ?? item.fileUrl}
                      </p>
                    )}
                  </div>
                  <span className="capitalize text-[#a1a1a1]">{item.type}</span>
                  <span className="text-right tabular-nums text-[#666]">{item.charCount || "—"}</span>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => deleteMemory(item.id)}
                      className="inline-flex size-7 items-center justify-center rounded text-[#a1a1a1] hover:bg-[#111] hover:text-[#ff6666]"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminPanelBody>
      </AdminPanel>

      <div className="flex justify-end border-t border-[#333] pt-4">
        <AdminPrimaryButton onClick={saveSettings} className={saving ? "opacity-60" : ""}>
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
          Save chatbot settings
        </AdminPrimaryButton>
      </div>
    </div>
  );
}
