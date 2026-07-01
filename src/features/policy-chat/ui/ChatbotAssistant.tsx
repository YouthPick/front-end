import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, Loader2, UserRound } from "lucide-react";
import { formatPolicyChatResponse, streamPolicyChat, type ChatMessage, type PolicyChatProgressStatus, type PolicyChatUserProfilePayload } from "@features/policy-chat";
import { fetchUserProfile, getStoredAuthTokens, type ProfileResponseDto } from "@entities/user";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessageContent } from "./ChatMessageContent";

function isAuthenticated(): boolean {
  return Boolean(getStoredAuthTokens()?.accessToken);
}

function profileToChatPayload(profile: ProfileResponseDto): PolicyChatUserProfilePayload {
  return {
    birthYear: profile.birthYear,
    region: profile.region,
    subRegion: profile.subRegion,
    employmentStatus: profile.employmentStatus,
    educationLevel: profile.educationLevel,
    categories: profile.categories,
    keywords: profile.keywords,
  };
}

function progressMessage(status: PolicyChatProgressStatus): string {
  const messages: Record<PolicyChatProgressStatus, string> = {
    thinking: "생각 중...",
    searching: "정책 찾아보는 중...",
    reading: "검색 결과 확인 중...",
    writing: "답변 정리 중...",
  };
  return messages[status];
}

export default function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "안녕하세요! 청년정책 비서 **정책 탐색 도우미**입니다. 무엇을 도와드릴까요?",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [threadId, setThreadId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [progressStatus, setProgressStatus] = useState<PolicyChatProgressStatus>("thinking");
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [useProfileContext, setUseProfileContext] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      const authenticated = isAuthenticated();
      setLoggedIn(authenticated);
      if (!authenticated) {
        setUseProfileContext(false);
      }
    }
  }, [isOpen]);

  const resolveChatProfile = async (): Promise<PolicyChatUserProfilePayload | undefined> => {
    if (!loggedIn || !useProfileContext) {
      return undefined;
    }

    try {
      return profileToChatPayload(await fetchUserProfile());
    } catch (error) {
      console.warn("Failed to load user profile for policy chat", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-profile-warn-${Date.now()}`,
          role: "bot",
          text: "온보딩 정보를 불러오지 못해 이번 질문은 입력한 내용만 기준으로 검색할게요.",
          timestamp: new Date(),
        },
      ]);
      return undefined;
    }
  };

  const sendMessageToApi = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);
    setProgressStatus("thinking");

    try {
      const profile = await resolveChatProfile();
      const data = await streamPolicyChat(text, threadId, profile, {
        onThread: setThreadId,
        onProgress: setProgressStatus,
      });
      setThreadId(data.threadId);
      
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: formatPolicyChatResponse(data),
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg: ChatMessage = {
        id: `b-err-${Date.now()}`,
        role: "bot",
        text: "정책 검색 API가 현재 응답하지 않습니다. 잠시 후 다시 시도하거나 일반 검색 화면에서 직접 찾아보세요.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setLoggedIn(isAuthenticated());
    setIsOpen(true);
    void sendMessageToApi(query);
  };

  const handleOpenChat = () => {
    setLoggedIn(isAuthenticated());
    setIsOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;
    void sendMessageToApi(inputVal);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenChat}
          className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-brand-secondary text-white shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-primary/20 md:bottom-8 md:right-8"
          id="chat-floating-button"
          aria-label="정책 탐색 도우미 열기"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

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
              <div className="flex items-center justify-between bg-gradient-to-r from-primary to-brand-secondary px-5 py-4 text-white">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <h3 className="text-sm font-bold tracking-tight">정책 탐색 도우미</h3>
                    <p className="text-[9px] text-white/80 flex items-center">
                      <Sparkles className="h-2.5 w-2.5 fill-current mr-0.5" />
                      <span>실제 정책 검색 기반 안내</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/10 p-1.5 transition-colors hover:bg-white/20 text-white"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {loggedIn ? (
                <label className="flex items-start gap-2 border-b border-slate-100 bg-violet-50/70 px-4 py-3 text-left text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={useProfileContext}
                    onChange={(event) => setUseProfileContext(event.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <UserRound className="h-3.5 w-3.5 text-primary" />
                      내 온보딩 정보 기반으로 추천받기
                    </span>
                    <span className="mt-0.5 block leading-relaxed">
                      체크하면 지역, 출생연도, 고용상태, 학력, 관심 분야를 이번 질문에만 함께 보냅니다.
                    </span>
                  </span>
                </label>
              ) : (
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-left text-[11px] text-slate-500">
                  로그인하지 않은 상태에서는 입력한 질문만 기준으로 정책을 찾습니다.
                </div>
              )}

              <div className="border-b border-slate-100 bg-white px-4 py-3">
                <p className="mb-2 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">빠른 질문</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("주거 지원 정책을 찾고 있어요")}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    id="chat-suggest-1"
                  >
                    주거 지원
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("취업 준비생을 위한 정책이 궁금해요")}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    id="chat-suggest-2"
                  >
                    취업 준비생
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick("서울시 청년 지원 정책 알려주세요")}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    id="chat-suggest-3"
                  >
                    서울시 청년 정책
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="min-w-0 max-w-[85%] space-y-1">
                      <div
                        className={`min-w-0 overflow-hidden rounded-2xl p-3.5 text-xs text-left leading-relaxed break-words ${
                          m.role === "user"
                            ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/5"
                            : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <ChatMessageContent text={m.text} role={m.role} />
                      </div>
                      <span className="block text-[8px] text-slate-400 px-1 text-right">
                        {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 shadow-sm text-slate-400 text-xs font-semibold">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>{progressMessage(progressStatus)}</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleFormSubmit} className="border-t border-slate-100 bg-white p-3 flex items-center space-x-2">
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
    </>
  );
}
