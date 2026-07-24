import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import type {
  AdminPolicyApplication,
  AdminPolicyApplicationStatus,
  ApplicationChecklistItem,
} from '@/entities/policy-application';
import { useBodyScrollLock } from '@/shared/hooks';
import { ConfirmDialog, Skeleton } from '@/shared/ui';
import { formatDateTime } from '@/shared/utils';

const STATUS_LABEL: Record<AdminPolicyApplicationStatus, string> = {
  INTERESTED: '관심',
  PREPARING: '준비중',
  SUBMITTED: '신청완료',
  CLOSED: '종료',
};

const STATUS_OPTIONS: AdminPolicyApplicationStatus[] = [
  'INTERESTED',
  'PREPARING',
  'SUBMITTED',
  'CLOSED',
];

function isApplicationStatus(value: string): value is AdminPolicyApplicationStatus {
  return (STATUS_OPTIONS as readonly string[]).includes(value);
}

interface AdminApplicationDetailModalProps {
  application: AdminPolicyApplication | null;
  checklist: ApplicationChecklistItem[];
  isChecklistLoading: boolean;
  onClose: () => void;
  onChangeStatus: (status: AdminPolicyApplicationStatus) => void;
  isChangingStatus: boolean;
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

export function AdminApplicationDetailModal({
  application,
  checklist,
  isChecklistLoading,
  onClose,
  onChangeStatus,
  isChangingStatus,
}: AdminApplicationDetailModalProps) {
  const [pendingStatus, setPendingStatus] = useState<AdminPolicyApplicationStatus | null>(null);

  useBodyScrollLock(application !== null);

  // Escape 키로 닫기
  useEffect(() => {
    if (!application) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [application, onClose]);

  if (!application) return null;

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
        aria-label="정책 신청 상세"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-xl text-left space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-800">정책 신청 상세</h3>
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
          <DetailRow label="사용자 ID" value={application.userId} />
          <DetailRow label="정책명" value={application.policyName} />
          <DetailRow label="마감일" value={application.deadline} />
          <DetailRow label="등록일" value={formatDateTime(application.createdAt)} />
        </div>

        {application.memo && <DetailRow label="메모" value={application.memo} />}

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-bold text-slate-600">
            상태: <span className="text-primary">{STATUS_LABEL[application.status]}</span>
          </span>
          <select
            value={application.status}
            onChange={(e) => {
              if (isApplicationStatus(e.target.value)) setPendingStatus(e.target.value);
            }}
            disabled={isChangingStatus}
            aria-label="신청 상태 변경"
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABEL[option]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            체크리스트
          </span>

          {isChecklistLoading && (
            <div className="space-y-1.5">
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
            </div>
          )}

          {!isChecklistLoading && checklist.length === 0 && (
            <p className="text-[10px] text-slate-400 italic py-1">등록된 체크리스트가 없습니다.</p>
          )}

          {!isChecklistLoading && checklist.length > 0 && (
            <ul className="space-y-1.5">
              {checklist.map((item) => (
                <li key={item.id} className="flex items-center space-x-2 text-xs text-slate-600">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded ${
                      item.checked
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-slate-300'
                    }`}
                  >
                    {item.checked && <Check className="h-3 w-3" />}
                  </span>
                  <span className={item.checked ? 'text-slate-400 line-through' : ''}>
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={pendingStatus !== null}
        title="신청 상태를 변경합니까?"
        description={
          <>
            <strong>{application.policyName}</strong> ({application.userId}) 신청의 상태를{' '}
            <strong>{pendingStatus ? STATUS_LABEL[pendingStatus] : ''}</strong>(으)로 변경합니다.
          </>
        }
        confirmLabel="변경 확인"
        cancelLabel="취소"
        onConfirm={() => {
          if (pendingStatus) onChangeStatus(pendingStatus);
          setPendingStatus(null);
        }}
        onCancel={() => setPendingStatus(null)}
      />
    </div>
  );
}
