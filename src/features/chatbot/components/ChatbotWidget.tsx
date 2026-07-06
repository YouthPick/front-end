import { MessageSquare } from "lucide-react";

const SUGGESTIONS = [
  "주거 지원 정책을 찾고 있어요",
  "취업 준비생을 위한 정책이 궁금해요",
  "서울시 청년 지원 정책 알려주세요",
];

interface ChatbotWidgetProps {
  onSuggestionClick: (query: string) => void;
  onOpen: () => void;
}

export function ChatbotWidget({ onSuggestionClick, onOpen }: ChatbotWidgetProps) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <h3 className="text-sm font-bold text-slate-800">정책 탐색 도우미</h3>

      {/* Avatar + speech bubble */}
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

      {/* Suggestion options */}
      <div className="mt-4 space-y-2 text-left">
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className="block w-full rounded-xl border border-slate-200/60 bg-white py-2.5 px-3.5 text-left text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
            id={`chat-suggest-${index + 1}`}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Bottom button */}
      <button
        type="button"
        onClick={onOpen}
        className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-brand-secondary py-2.5 text-xs font-bold text-white transition-all hover:brightness-105"
        id="chat-open-button"
      >
        <MessageSquare className="h-4 w-4" />
        <span>챗봇에게 질문하기</span>
      </button>
    </div>
  );
}
