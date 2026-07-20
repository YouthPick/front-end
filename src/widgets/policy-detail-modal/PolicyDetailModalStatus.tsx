import { X } from 'lucide-react';

import { ErrorState, Skeleton } from '@/shared/ui';

interface PolicyDetailModalShellProps {
  onClose: () => void;
  children: React.ReactNode;
}

// 로딩/에러 상태도 상세 모달과 같은 오버레이·카드 틀을 공유한다.
function PolicyDetailModalShell({ onClose, children }: PolicyDetailModalShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="상세 정보 닫기"
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PolicyDetailModalLoading({ onClose }: { onClose: () => void }) {
  return (
    <PolicyDetailModalShell onClose={onClose}>
      <div className="space-y-4" role="status" aria-busy="true" aria-label="정책 상세 불러오는 중">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </PolicyDetailModalShell>
  );
}

interface PolicyDetailModalErrorProps {
  onRetry: () => void;
  onClose: () => void;
}

export function PolicyDetailModalError({ onRetry, onClose }: PolicyDetailModalErrorProps) {
  return (
    <PolicyDetailModalShell onClose={onClose}>
      <ErrorState
        title="정책 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        onRetry={onRetry}
      />
    </PolicyDetailModalShell>
  );
}
