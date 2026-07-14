import { X } from 'lucide-react';
import { useEffect } from 'react';

import type { ApplicationLog } from '@/entities/application-log';
import { useBodyScrollLock } from '@/shared/hooks';
import { formatDateTime } from '@/shared/utils';

interface ApplicationLogDetailModalProps {
  log: ApplicationLog | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <p className="mt-0.5 text-xs text-slate-700 break-all">{value}</p>
    </div>
  );
}

export function ApplicationLogDetailModal({ log, onClose }: ApplicationLogDetailModalProps) {
  useBodyScrollLock(log !== null);

  // Escape 키로 닫기
  useEffect(() => {
    if (!log) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [log, onClose]);

  if (!log) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 배경 클릭 닫기 — 키보드 동등 기능은 위 Escape 핸들러로 제공한다
    // biome-ignore lint/a11y/useKeyWithClickEvents: 배경 클릭 닫기 — 키보드 동등 기능은 위 Escape 핸들러로 제공한다
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="애플리케이션 로그 상세"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl text-left space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-800">애플리케이션 로그 상세</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailRow label="로그 레벨" value={log.logLevel} />
          <DetailRow label="발생 시각" value={formatDateTime(log.createdAt)} />
          <DetailRow label="Trace ID" value={log.traceId} />
          <DetailRow label="사용자 ID" value={log.userId ?? '비로그인'} />
          <DetailRow label="요청" value={`${log.requestMethod} ${log.requestUri}`} />
          <DetailRow label="요청 IP" value={log.userIp} />
        </div>

        <DetailRow label="메시지" value={log.message} />

        {log.exceptionClass && <DetailRow label="예외 클래스" value={log.exceptionClass} />}
        {log.exceptionMessage && <DetailRow label="예외 메시지" value={log.exceptionMessage} />}

        {log.stackTrace && (
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              스택 트레이스
            </span>
            <pre className="mt-1 max-h-64 overflow-auto rounded-2xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 whitespace-pre-wrap break-all">
              {log.stackTrace}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
