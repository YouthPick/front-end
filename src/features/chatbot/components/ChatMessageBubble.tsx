import type { ChatMessage } from '../types/chat.types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[85%] space-y-1">
        <div
          className={`rounded-2xl p-3.5 text-xs text-left leading-relaxed ${
            message.role === 'user'
              ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/5'
              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
          }`}
        >
          {/* Preserve simple formatting for markdown bolds */}
          <div className="whitespace-pre-line">
            {message.text.split('**').map((part, i) =>
              i % 2 === 1 ? (
                <strong
                  // biome-ignore lint/suspicious/noArrayIndexKey: 정적 텍스트를 '**'로 분할한 세그먼트라 순서 불변이며 message.id로 스코프됨
                  key={`${message.id}-${i}`}
                  className={message.role === 'user' ? 'text-white' : 'text-primary font-bold'}
                >
                  {part}
                </strong>
              ) : (
                part
              ),
            )}
          </div>
        </div>
        <span className="block text-[8px] text-slate-400 px-1 text-right">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
