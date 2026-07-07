import { Loader2, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../types';

export default function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: '안녕하세요! 청년정책 비서 **정책 탐색 도우미**입니다. 무엇을 도와드릴까요?',
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const sendMessageToApi = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      // Build chat history for API
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: data.text || '죄송합니다. 답변을 얻지 못했습니다. 다시 한 번 질문해 주세요.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg: ChatMessage = {
        id: `b-err-${Date.now()}`,
        role: 'bot',
        text: '서버가 현재 혼잡하여 응답할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setIsOpen(true);
    sendMessageToApi(query);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;
    sendMessageToApi(inputVal);
  };

  return (
    <div className="relative">
      {/* Mini Widget on Dashboard */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
        <h3 className="text-sm font-bold text-slate-800">정책 탐색 도우미</h3>

        {/* Avatar + Speech bubble layout matching screenshot */}
        <div className="mt-4 flex items-start space-x-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg border border-slate-200">
            🤖
          </div>
          <div className="relative rounded-2xl bg-slate-100/70 px-3.5 py-2.5 text-left flex-1">
            <div className="absolute -left-1.5 top-3.5 h-3 w-3 rotate-45 bg-slate-100/70"></div>
            <p className="text-xs leading-normal text-slate-600 font-bold relative z-10">
              안녕하세요! 정책 탐색을 도와드릴게요.
            </p>
          </div>
        </div>

        {/* Suggestion Options with plain text matching screenshot */}
        <div className="mt-4 space-y-2 text-left">
          <button
            type="button"
            onClick={() => handleSuggestionClick('주거 지원 정책을 찾고 있어요')}
            className="block w-full rounded-xl border border-slate-200/60 bg-white py-2.5 px-3.5 text-left text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            id="chat-suggest-1"
          >
            주거 지원 정책을 찾고 있어요
          </button>
          <button
            type="button"
            onClick={() => handleSuggestionClick('취업 준비생을 위한 정책이 궁금해요')}
            className="block w-full rounded-xl border border-slate-200/60 bg-white py-2.5 px-3.5 text-left text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            id="chat-suggest-2"
          >
            취업 준비생을 위한 정책이 궁금해요
          </button>
          <button
            type="button"
            onClick={() => handleSuggestionClick('서울시 청년 지원 정책 알려주세요')}
            className="block w-full rounded-xl border border-slate-200/60 bg-white py-2.5 px-3.5 text-left text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            id="chat-suggest-3"
          >
            서울시 청년 지원 정책 알려주세요
          </button>
        </div>

        {/* Bottom Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-brand-secondary py-2.5 text-xs font-bold text-white transition-all hover:brightness-105"
          id="chat-open-button"
        >
          <MessageSquare className="h-4 w-4" />
          <span>챗봇에게 질문하기</span>
        </button>
      </div>

      {/* Floating Chat Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
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
                      <span>Gemini AI 맞춤 컨설팅</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/10 p-1.5 transition-colors hover:bg-white/20 text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Chat Messages Panel */}
              <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[85%] space-y-1">
                      <div
                        className={`rounded-2xl p-3.5 text-xs text-left leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/5'
                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {/* Preserve simple formatting for markdown lists / bolds */}
                        <div className="whitespace-pre-line">
                          {(() => {
                            let offset = 0;
                            return m.text.split('**').map((part, i) => {
                              const key = `${m.id}-${offset}`;
                              offset += part.length + 2;
                              return i % 2 === 1 ? (
                                <strong
                                  key={key}
                                  className={
                                    m.role === 'user' ? 'text-white' : 'text-primary font-bold'
                                  }
                                >
                                  {part}
                                </strong>
                              ) : (
                                part
                              );
                            });
                          })()}
                        </div>
                      </div>
                      <span className="block text-[8px] text-slate-400 px-1 text-right">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading state indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm text-slate-400 text-xs font-semibold">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Gemini가 정책 분석 중...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={handleFormSubmit}
                className="border-t border-slate-100 bg-white p-3 flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="예: 경기도 거주자를 위한 주택 전세대출 지원"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs outline-none transition-colors focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                  id="chat-input-field"
                />
                <button
                  type="submit"
                  disabled={loading || !inputVal.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:opacity-95 disabled:bg-slate-100 disabled:text-slate-300 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
