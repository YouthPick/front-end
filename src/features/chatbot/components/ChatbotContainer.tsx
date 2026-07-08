import { MessageSquare } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';

import { useChatbot } from '../hooks/useChatbot';
import { ChatDrawer } from './ChatDrawer';

const SUGGESTIONS = [
  '주거 지원 정책을 찾고 있어요',
  '취업 준비생을 위한 정책이 궁금해요',
  '서울시 청년 지원 정책 알려주세요',
];

export function ChatbotContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChatbot();

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="정책 탐색 도우미 열기"
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-secondary text-white shadow-lg shadow-primary/30 transition-all hover:brightness-105 active:scale-95 md:bottom-6 md:right-6"
          id="chatbot-fab"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <ChatDrawer
            messages={messages}
            isLoading={isLoading}
            suggestions={SUGGESTIONS}
            onSuggestionClick={sendMessage}
            onSend={sendMessage}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
