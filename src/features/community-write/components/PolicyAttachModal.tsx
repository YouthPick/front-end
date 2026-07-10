import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';

import { type Policy, PolicyCategoryBadge } from '@/entities/policy';
import { useBodyScrollLock } from '@/shared/hooks';
import { ErrorState, Skeleton } from '@/shared/ui';

import { usePolicyAttachSearch } from '../hooks/usePolicyAttachSearch';

const DIALOG_TITLE_ID = 'policy-attach-modal-title';

interface PolicyAttachModalProps {
  onClose: () => void;
  onSelect: (policy: Policy) => void;
}

export function PolicyAttachModal({ onClose, onSelect }: PolicyAttachModalProps) {
  useBodyScrollLock();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const { draftQuery, setDraftQuery, submitSearch, policies, isLoading, isError, reload } =
    usePolicyAttachSearch();

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 배경 클릭 닫기 — 키보드 동등 기능은 Escape 핸들러로 제공한다
    // biome-ignore lint/a11y/useKeyWithClickEvents: 배경 클릭 닫기 — 키보드 동등 기능은 Escape 핸들러로 제공한다
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={DIALOG_TITLE_ID}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        id="policy-attach-modal"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 id={DIALOG_TITLE_ID} className="text-base font-extrabold text-slate-800">
            정책 첨부하기
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="정책 첨부 닫기"
            className="rounded-full p-1.5 transition-colors hover:bg-slate-50 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={draftQuery}
              onChange={(e) => setDraftQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) submitSearch();
              }}
              placeholder="정책명이나 키워드로 검색"
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-xs transition-colors focus:border-primary focus:outline-none"
              aria-label="정책 검색어 입력"
            />
            <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <button
            type="button"
            onClick={submitSearch}
            className="rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-all hover:brightness-105"
          >
            검색
          </button>
        </div>

        <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          )}

          {isError && <ErrorState title="정책을 불러오지 못했습니다" onRetry={() => reload()} />}

          {!isLoading && !isError && policies.length === 0 && (
            <p className="py-8 text-center text-xs font-bold text-slate-400">
              검색 결과가 없습니다.
            </p>
          )}

          {!isLoading &&
            !isError &&
            policies.map((policy) => (
              <button
                key={policy.id}
                type="button"
                onClick={() => onSelect(policy)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white p-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/[0.03]"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <PolicyCategoryBadge category={policy.category} />
                    <span className="text-[10px] font-bold text-slate-400">{policy.region}</span>
                  </div>
                  <p className="truncate text-xs font-bold text-slate-800">{policy.title}</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-primary">선택</span>
              </button>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
