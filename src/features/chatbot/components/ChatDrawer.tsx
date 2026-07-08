import { Loader2, Send, Sparkles, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import type { ChatMessage } from '../types/chat.types';
import { ChatMessageBubble } from './ChatMessageBubble';

interface ChatDrawerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
}

export function ChatDrawer({ messages, isLoading, onSend, onClose }: ChatDrawerProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지·로딩 표시가 생기면 목록 맨 아래로 스크롤을 동기화한다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: messages·isLoading 변화를 스크롤 트리거로 의도적으로 구독
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSend(inputValue);
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="flex h-full w-full max-w-md flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100"
        id="chat-window-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-primary to-brand-secondary px-5 py-4 text-white">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <h3 className="text-sm font-bold tracking-tight">정책 탐색 도우미</h3>
              <p className="text-[9px] text-white/80 flex items-center">
                <Sparkles className="h-2.5 w-2.5 fill-current mr-0.5" />
                <span>AI 맞춤 컨설팅</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="챗봇 닫기"
            className="rounded-full bg-white/10 p-1.5 transition-colors hover:bg-white/20 text-white"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Chat messages panel */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm text-slate-400 text-xs font-semibold">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>정책 분석 중...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input form */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-100 bg-white p-3 flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="예: 경기도 거주자를 위한 주택 전세대출 지원"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none transition-colors focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
            id="chat-input-field"
            aria-label="챗봇 질문 입력"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            aria-label="질문 보내기"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-95 disabled:bg-slate-100 disabled:text-slate-300 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
