import { promises as fs } from "fs";
import path from "path";
import { desc, eq } from "drizzle-orm";
import { canUseLocalFileStore } from "@/lib/cms/storage";
import {
  CHATBOT_SKILL_SUGGESTIONS,
  DEFAULT_CHATBOT_SETTINGS,
  type ChatbotMemoryItem,
  type ChatbotMemoryType,
  type ChatbotSettings,
  type ChatbotTone,
} from "@/lib/cms/chatbot-shared";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { cmsChatbotMemory, cmsChatbotSettings } from "@/lib/db/schema";

const storePath = path.join(process.cwd(), "data", "cms-chatbot.json");

type FileStore = {
  settings: Omit<ChatbotSettings, "groqConfigured">;
  memory: ChatbotMemoryItem[];
  nextMemoryId: number;
};

function isMissingTableError(error: unknown) {
  const code =
    (error as { code?: string })?.code ??
    (error as { cause?: { code?: string } })?.cause?.code;
  return code === "42P01";
}

function isGroqConfigured() {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

function defaultFileStore(): FileStore {
  return {
    settings: {
      ...DEFAULT_CHATBOT_SETTINGS,
      crawlBaseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
      lastCrawledAt: null,
      updatedAt: null,
    },
    memory: [],
    nextMemoryId: 1,
  };
}

async function readFileStore(): Promise<FileStore> {
  if (!canUseLocalFileStore()) return defaultFileStore();

  try {
    const raw = await fs.readFile(storePath, "utf8");
    return JSON.parse(raw) as FileStore;
  } catch {
    const initial = defaultFileStore();
    await writeFileStore(initial);
    return initial;
  }
}

async function writeFileStore(store: FileStore) {
  if (!canUseLocalFileStore()) return;
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store, null, 2));
}

function rowToSettings(row: typeof cmsChatbotSettings.$inferSelect): ChatbotSettings {
  return {
    provider: row.provider,
    model: row.model,
    systemPrompt: row.systemPrompt,
    tone: row.tone as ChatbotTone,
    skills: row.skills ?? [],
    crawlEnabled: row.crawlEnabled,
    crawlBaseUrl: row.crawlBaseUrl ?? "",
    lastCrawledAt: row.lastCrawledAt,
    enabled: row.enabled,
    welcomeMessage: row.welcomeMessage,
    updatedAt: row.updatedAt,
    groqConfigured: isGroqConfigured(),
  };
}

function rowToMemory(row: typeof cmsChatbotMemory.$inferSelect): ChatbotMemoryItem {
  return {
    id: row.id,
    name: row.name,
    type: row.type as ChatbotMemoryType,
    content: row.content,
    fileUrl: row.fileUrl,
    sourceUrl: row.sourceUrl,
    charCount: row.charCount,
    createdAt: row.createdAt ?? new Date().toISOString(),
  };
}

export async function getChatbotSettings(): Promise<ChatbotSettings> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const rows = await db.select().from(cmsChatbotSettings).limit(1);
        if (rows[0]) return rowToSettings(rows[0]);

        const [created] = await db
          .insert(cmsChatbotSettings)
          .values({
            ...DEFAULT_CHATBOT_SETTINGS,
            crawlBaseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
          })
          .returning();
        return rowToSettings(created);
      } catch (error) {
        if (!isMissingTableError(error)) throw error;
      }
    }
  }

  const store = await readFileStore();
  return { ...store.settings, groqConfigured: isGroqConfigured() };
}

export type ChatbotSettingsInput = Partial<{
  provider: string;
  model: string;
  systemPrompt: string;
  tone: ChatbotTone;
  skills: string[];
  crawlEnabled: boolean;
  crawlBaseUrl: string;
  enabled: boolean;
  welcomeMessage: string;
  lastCrawledAt: string;
}>;

export async function updateChatbotSettings(input: ChatbotSettingsInput): Promise<ChatbotSettings> {
  const updatedAt = new Date().toISOString();

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const existing = await db.select().from(cmsChatbotSettings).limit(1);
        if (existing[0]) {
          const [row] = await db
            .update(cmsChatbotSettings)
            .set({ ...input, updatedAt })
            .where(eq(cmsChatbotSettings.id, existing[0].id))
            .returning();
          return rowToSettings(row);
        }

        const [row] = await db
          .insert(cmsChatbotSettings)
          .values({
            ...DEFAULT_CHATBOT_SETTINGS,
            ...input,
            crawlBaseUrl: input.crawlBaseUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "",
            updatedAt,
          })
          .returning();
        return rowToSettings(row);
      } catch (error) {
        if (!isMissingTableError(error)) throw error;
      }
    }
  }

  const store = await readFileStore();
  store.settings = {
    ...store.settings,
    ...input,
    updatedAt,
  };
  await writeFileStore(store);
  return { ...store.settings, groqConfigured: isGroqConfigured() };
}

export async function listChatbotMemory(): Promise<ChatbotMemoryItem[]> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const rows = await db
          .select()
          .from(cmsChatbotMemory)
          .orderBy(desc(cmsChatbotMemory.createdAt));
        return rows.map(rowToMemory);
      } catch (error) {
        if (!isMissingTableError(error)) throw error;
      }
    }
  }

  const store = await readFileStore();
  return [...store.memory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export type ChatbotMemoryInput = {
  name: string;
  type: ChatbotMemoryType;
  content?: string;
  fileUrl?: string;
  sourceUrl?: string;
};

export async function addChatbotMemory(input: ChatbotMemoryInput): Promise<ChatbotMemoryItem> {
  const charCount = input.content?.length ?? 0;

  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const [row] = await db
          .insert(cmsChatbotMemory)
          .values({
            name: input.name,
            type: input.type,
            content: input.content ?? null,
            fileUrl: input.fileUrl ?? null,
            sourceUrl: input.sourceUrl ?? null,
            charCount,
          })
          .returning();
        return rowToMemory(row);
      } catch (error) {
        if (!isMissingTableError(error)) throw error;
      }
    }
  }

  const store = await readFileStore();
  const item: ChatbotMemoryItem = {
    id: store.nextMemoryId++,
    name: input.name,
    type: input.type,
    content: input.content ?? null,
    fileUrl: input.fileUrl ?? null,
    sourceUrl: input.sourceUrl ?? null,
    charCount,
    createdAt: new Date().toISOString(),
  };
  store.memory.unshift(item);
  await writeFileStore(store);
  return item;
}

export async function deleteChatbotMemory(id: number): Promise<boolean> {
  if (isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      try {
        await db.delete(cmsChatbotMemory).where(eq(cmsChatbotMemory.id, id));
        return true;
      } catch (error) {
        if (!isMissingTableError(error)) throw error;
      }
    }
  }

  const store = await readFileStore();
  const before = store.memory.length;
  store.memory = store.memory.filter((item) => item.id !== id);
  await writeFileStore(store);
  return store.memory.length < before;
}

export async function triggerChatbotCrawl(): Promise<{ ok: boolean; message: string }> {
  const settings = await getChatbotSettings();
  const baseUrl = settings.crawlBaseUrl?.trim() || process.env.NEXT_PUBLIC_SITE_URL || "";

  if (!baseUrl) {
    return { ok: false, message: "Set a crawl base URL first (e.g. your site URL)." };
  }

  const crawledAt = new Date().toISOString();
  await updateChatbotSettings({ lastCrawledAt: crawledAt });

  await addChatbotMemory({
    name: `Site crawl · ${new Date().toLocaleDateString()}`,
    type: "crawl",
    sourceUrl: baseUrl,
    content: `Queued crawl for ${baseUrl}. Full site indexing will run when the public chatbot is connected.`,
  });

  return {
    ok: true,
    message: `Crawl queued for ${baseUrl}. Memory entry created — indexing runs when the widget is live.`,
  };
}

export function getChatbotSkillSuggestions() {
  return CHATBOT_SKILL_SUGGESTIONS;
}
