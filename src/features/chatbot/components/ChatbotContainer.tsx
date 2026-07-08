import { useState } from "react";
import { AnimatePresence } from "motion/react";

import { useChatbot } from "../hooks/useChatbot";
import { ChatbotWidget } from "./ChatbotWidget";
import { ChatDrawer } from "./ChatDrawer";

export function ChatbotContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChatbot();

  const handleSuggestionClick = (query: string) => {
    setIsOpen(true);
    sendMessage(query);
  };

  return (
    <div className="relative">
      <ChatbotWidget onSuggestionClick={handleSuggestionClick} onOpen={() => setIsOpen(true)} />

      <AnimatePresence>
        {isOpen && (
          <ChatDrawer
            messages={messages}
            isLoading={isLoading}
            onSend={sendMessage}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
