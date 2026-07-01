const DEFAULT_CHATBOT_API_BASE_URL = "";

export interface PolicyChatQueryDto {
  message: string;
  threadId: string;
}

export interface PolicyChatUserProfilePayload {
  birthYear: number | null;
  region: string | null;
  subRegion: string | null;
  employmentStatus: string | null;
  educationLevel: string | null;
  categories: string[];
  keywords: string[];
}

export type PolicyChatProgressStatus = "thinking" | "searching" | "reading" | "writing";

export interface PolicyChatStreamHandlers {
  onThread?: (threadId: string) => void;
  onProgress?: (status: PolicyChatProgressStatus) => void;
}

interface FastApiChatResponse {
  message: string;
  thread_id: string;
}

interface FastApiStreamEvent {
  event: string;
  data: Record<string, unknown>;
}

export function chatbotApiBaseUrl(): string {
  return import.meta.env.VITE_CHATBOT_API_BASE_URL ?? DEFAULT_CHATBOT_API_BASE_URL;
}

export async function queryPolicyChat(
  message: string,
  threadId?: string,
  userProfile?: PolicyChatUserProfilePayload,
): Promise<PolicyChatQueryDto> {
  const response = await fetch(`${chatbotApiBaseUrl()}/chat`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildChatRequestBody(message, threadId, userProfile)),
  });

  if (!response.ok) {
    throw new Error(`Chatbot API request failed: ${response.status}`);
  }

  const data = await response.json() as FastApiChatResponse;
  return {
    message: data.message,
    threadId: data.thread_id,
  };
}

export async function streamPolicyChat(
  message: string,
  threadId?: string,
  userProfile?: PolicyChatUserProfilePayload,
  handlers: PolicyChatStreamHandlers = {},
): Promise<PolicyChatQueryDto> {
  handlers.onProgress?.("thinking");

  const response = await fetch(`${chatbotApiBaseUrl()}/chat/stream`, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildChatRequestBody(message, threadId, userProfile)),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Chatbot stream request failed: ${response.status}`);
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = "";
  let finalResponse: PolicyChatQueryDto | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const event = parseSseChunk(chunk);
      if (!event) continue;
      const result = handleStreamEvent(event, handlers);
      if (result) {
        finalResponse = result;
      }
    }
  }

  buffer += decoder.decode();
  const trailing = parseSseChunk(buffer);
  if (trailing) {
    const result = handleStreamEvent(trailing, handlers);
    if (result) {
      finalResponse = result;
    }
  }

  if (!finalResponse) {
    throw new Error("Chatbot stream ended without final response");
  }

  return finalResponse;
}

function buildChatRequestBody(
  message: string,
  threadId?: string,
  userProfile?: PolicyChatUserProfilePayload,
): Record<string, unknown> {
  return {
    message,
    thread_id: threadId,
    user_profile: userProfile,
  };
}

function parseSseChunk(chunk: string): FastApiStreamEvent | null {
  const eventLine = chunk
    .split("\n")
    .find((line) => line.startsWith("event:"));
  const dataLine = chunk
    .split("\n")
    .find((line) => line.startsWith("data:"));

  if (!eventLine || !dataLine) {
    return null;
  }

  const event = eventLine.replace(/^event:\s*/, "").trim();
  const rawData = dataLine.replace(/^data:\s*/, "");
  try {
    const data = JSON.parse(rawData) as Record<string, unknown>;
    return { event, data };
  } catch {
    return null;
  }
}

function handleStreamEvent(
  streamEvent: FastApiStreamEvent,
  handlers: PolicyChatStreamHandlers,
): PolicyChatQueryDto | null {
  switch (streamEvent.event) {
    case "thread": {
      const threadId = stringValue(streamEvent.data.thread_id);
      if (threadId) handlers.onThread?.(threadId);
      return null;
    }
    case "progress": {
      const status = stringValue(streamEvent.data.status);
      if (isProgressStatus(status)) {
        handlers.onProgress?.(status);
      }
      return null;
    }
    case "tool_call":
      handlers.onProgress?.("searching");
      return null;
    case "tool_result":
      handlers.onProgress?.("reading");
      return null;
    case "token":
      handlers.onProgress?.("writing");
      return null;
    case "final": {
      const message = stringValue(streamEvent.data.message);
      const threadId = stringValue(streamEvent.data.thread_id);
      if (!message || !threadId) return null;
      return { message, threadId };
    }
    case "error": {
      const message = stringValue(streamEvent.data.message) || "Chatbot stream failed";
      throw new Error(message);
    }
    default:
      return null;
  }
}

function isProgressStatus(value: string): value is PolicyChatProgressStatus {
  return ["thinking", "searching", "reading", "writing"].includes(value);
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}
