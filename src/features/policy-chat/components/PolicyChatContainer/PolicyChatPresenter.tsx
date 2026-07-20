import { AlertCircle, Loader2, LockKeyhole, MessageCircle, SendHorizontal } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { PolicyChatMessage, PolicyChatStatus } from '../../model/policyChat.types';

const MESSAGE_MAX_LENGTH = 1000;
const AUTO_SCROLL_THRESHOLD_PX = 48;

interface PolicyChatPresenterProps {
  messages: PolicyChatMessage[];
  status: PolicyChatStatus;
  errorMessage: string | null;
  isSending: boolean;
  sendErrorMessage: string | null;
  onRetry: () => void;
  onSendMessage: (content: string) => Promise<boolean>;
}

function formatMessageTime(createdAt: string): string {
  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return createdAt;

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(createdDate);
}

export function PolicyChatPresenter({
  messages,
  status,
  errorMessage,
  isSending,
  sendErrorMessage,
  onRetry,
  onSendMessage,
}: PolicyChatPresenterProps) {
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef(true);
  const trimmedDraftLength = draft.trim().length;
  const canSubmit = trimmedDraftLength > 0 && draft.length <= MESSAGE_MAX_LENGTH && !isSending;

  useEffect(() => {
    const listElement = listRef.current;
    if (messages.length === 0) return;
    if (!listElement || !isNearBottomRef.current) return;
    listElement.scrollTop = listElement.scrollHeight;
  }, [messages.length]);

  const handleScroll = () => {
    const listElement = listRef.current;
    if (!listElement) return;
    const distanceFromBottom =
      listElement.scrollHeight - listElement.scrollTop - listElement.clientHeight;
    isNearBottomRef.current = distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX;
  };

  const handleDraftChange = (value: string) => {
    setDraft(value.slice(0, MESSAGE_MAX_LENGTH));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    const sent = await onSendMessage(draft);
    if (sent) setDraft('');
  };

  return (
    <section
      className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3 lg:h-full"
      aria-labelledby="policy-chat-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 id="policy-chat-heading" className="text-xs font-extrabold text-slate-800">
              정책 대화
            </h3>
            <p className="text-[10px] font-medium text-slate-400">
              같은 정책을 보는 회원들과 실시간으로 의견을 나눕니다.
            </p>
          </div>
        </div>

        {status === 'reconnecting' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-600">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            재연결 중
          </span>
        )}
      </div>

      {status === 'error' && errorMessage ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-center space-y-2 lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center">
          <AlertCircle className="mx-auto h-5 w-5 text-rose-500" aria-hidden="true" />
          <p className="text-xs font-bold text-rose-700">{errorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-rose-600 px-3.5 py-2 text-[11px] font-bold text-white hover:bg-rose-700"
          >
            다시 연결
          </button>
        </div>
      ) : (
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="max-h-64 overflow-y-auto rounded-2xl border border-slate-100 bg-white p-3 space-y-3 lg:max-h-none lg:min-h-0 lg:flex-1"
          aria-live="polite"
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? (
            <div className="space-y-2" role="status" aria-label="정책 대화 불러오는 중">
              <div className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
              <div className="ml-12 h-14 rounded-2xl bg-primary/10 animate-pulse" />
            </div>
          ) : messages.length === 0 ? (
            <div className="py-8 text-center text-xs font-medium text-slate-400">
              아직 대화가 없습니다. 이 정책에 대한 첫 의견을 남겨보세요.
            </div>
          ) : (
            <ol className="space-y-2">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}
                >
                  <article
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                      message.mine
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-md'
                    }`}
                    aria-label={`${message.authorName}님의 메시지`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold">
                      <span className={message.mine ? 'text-white/85' : 'text-slate-500'}>
                        {message.mine ? '나' : message.authorName}
                      </span>
                      <time
                        dateTime={message.createdAt}
                        className={message.mine ? 'text-white/65' : 'text-slate-400'}
                      >
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed font-medium">
                      {message.content}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {status === 'reconnecting' && errorMessage && (
        <p className="text-[10px] font-bold text-amber-600" role="status">
          {errorMessage}
        </p>
      )}

      <form className="space-y-2" onSubmit={handleSubmit}>
        <label htmlFor="policy-chat-message" className="sr-only">
          정책 대화 메시지 입력
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id="policy-chat-message"
            value={draft}
            maxLength={MESSAGE_MAX_LENGTH}
            onChange={(event) => handleDraftChange(event.target.value)}
            placeholder="이 정책에 대해 궁금한 점이나 경험을 공유해 주세요"
            rows={2}
            aria-describedby="policy-chat-character-count policy-chat-send-error"
            className="min-h-18 flex-1 resize-none rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-relaxed shadow-sm transition-colors focus:border-primary focus:outline-none disabled:bg-slate-50"
            disabled={status === 'error' || isSending}
          />
          <button
            type="submit"
            disabled={!canSubmit || status === 'error'}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
            aria-label="정책 대화 메시지 보내기"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <SendHorizontal className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-slate-400">
          <span id="policy-chat-send-error" className="text-rose-500" role="status">
            {sendErrorMessage ?? ''}
          </span>
          <span id="policy-chat-character-count" aria-live="polite">
            {draft.length}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
      </form>
    </section>
  );
}

export function PolicyChatDisabledState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center space-y-2 lg:h-full">
      <LockKeyhole className="mx-auto h-5 w-5 text-slate-400" aria-hidden="true" />
      <p className="text-xs font-bold text-slate-600">이 정책은 지금 채팅을 이용할 수 없습니다</p>
      <p className="text-[10px] leading-relaxed text-slate-400">
        정책 ID를 확인할 수 없어 정책별 대화 요청을 보내지 않습니다.
      </p>
    </section>
  );
}

export function PolicyChatLoginRequiredState() {
  return (
    <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center space-y-2 lg:h-full">
      <LockKeyhole className="mx-auto h-5 w-5 text-slate-400" aria-hidden="true" />
      <p className="text-xs font-bold text-slate-600">로그인 후 정책 대화를 이용할 수 있습니다</p>
      <p className="text-[10px] leading-relaxed text-slate-400">
        회원만 정책별 메시지를 읽고 작성할 수 있습니다.
      </p>
    </section>
  );
}
