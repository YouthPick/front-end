import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { sendChatMessage } from "../api/chatApi";
import type { ChatMessage } from "../types/chat.types";

const WELCOME_MESSAGE_ID = "welcome";

function createWelcomeMessage(): ChatMessage {
  return {
    id: WELCOME_MESSAGE_ID,
    role: "bot",
    text: "안녕하세요! 청년정책 비서 **정책 탐색 도우미**입니다. 무엇을 도와드릴까요?",
    timestamp: new Date(),
  };
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);
  const [isFallback, setIsFallback] = useState(false);

  const sendMutation = useMutation({
    mutationFn: ({ text, history }: { text: string; history: { role: "user" | "bot"; text: string }[] }) =>
      sendChatMessage(text, history),
    onSuccess: (result) => {
      setIsFallback(result.isFallback);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: result.text,
          timestamp: new Date(),
        },
      ]);
    },
  });

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === "" || sendMutation.isPending) return;

    const history = messages
      .filter((message) => message.id !== WELCOME_MESSAGE_ID)
      .map((message) => ({ role: message.role, text: message.text }));

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: trimmed, timestamp: new Date() },
    ]);
    sendMutation.mutate({ text: trimmed, history });
  };

  return {
    messages,
    isLoading: sendMutation.isPending,
    isFallback,
    sendMessage,
  };
}
