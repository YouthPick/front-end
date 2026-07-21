import { motion } from 'motion/react';
import { useEffect } from 'react';

import { useBodyScrollLock } from '@/shared/hooks';
import { ErrorState, Skeleton } from '@/shared/ui';

import type { ComparisonPolicy } from '../types/comparisonPolicy.types';
import { COMPARE_SLOTS } from './compareSlots';

const DIALOG_TITLE_ID = 'compare-detail-title';

interface CompareDetailDialogProps {
  policies: ComparisonPolicy[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onClose: () => void;
}

// 텍스트 한 줄로 표현되는 비교 항목.
const COMPARE_ROWS: { label: string; render: (policy: ComparisonPolicy) => string }[] = [
  { label: '카테고리', render: (policy) => policy.category },
  { label: '주관기관', render: (policy) => policy.organizationName },
  { label: '지원 연령', render: (policy) => policy.ageRangeText },
  { label: '지원 지역', render: (policy) => policy.regionText },
  { label: '소득 조건', render: (policy) => policy.incomeText },
  { label: '신청자격', render: (policy) => policy.additionalQualification },
  { label: '참여제한사항', render: (policy) => policy.participationRestriction },
  { label: '신청 마감일', render: (policy) => policy.applicationEndDateText },
];

// 정책 칸끼리 옅은 세로선으로 구분한다(첫 칸 제외). 라벨 칸은 구분선 없이 오른쪽 여백만 둔다.
function getPolicyCellClass(index: number) {
  return `flex-1 min-w-0 text-left px-4 ${index > 0 ? 'border-l border-slate-100' : ''}`;
}

export function CompareDetailDialog({
  policies,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onClose,
}: CompareDetailDialogProps) {
  useBodyScrollLock();

  // Escape 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: 배경 클릭 닫기 — 키보드 동등 기능은 위 Escape 핸들러로 제공한다
    // biome-ignore lint/a11y/useKeyWithClickEvents: 배경 클릭 닫기 — 키보드 동등 기능은 위 Escape 핸들러로 제공한다
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
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
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
        id="comparison-detail-modal"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 id={DIALOG_TITLE_ID} className="text-base font-extrabold text-slate-800">
            📊 청년정책 맞춤 비교분석
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="비교 분석 닫기"
            className="rounded-full p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {isLoading && (
          <div className="mt-6 space-y-3" role="status" aria-label="비교 정보 불러오는 중">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && isError && (
          <div className="mt-6">
            <ErrorState
              title={errorMessage ?? '비교 정보를 불러오지 못했습니다.'}
              onRetry={onRetry}
            />
          </div>
        )}

        {!isLoading && !isError && (
          <div className="mt-6 space-y-4">
            {/* 헤더: 정책 제목 */}
            <div className="flex">
              <div className="w-28 shrink-0 self-center whitespace-nowrap pr-4 text-left text-xs font-semibold text-slate-400">
                구분
              </div>
              {policies.map((policy, index) => (
                <div
                  key={policy.policyId}
                  className={`${getPolicyCellClass(index)} text-xs font-bold ${COMPARE_SLOTS[index]?.title ?? 'text-slate-700'}`}
                >
                  {policy.title}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-50"></div>

            {COMPARE_ROWS.map((row) => (
              <div key={row.label} className="flex">
                <div className="w-28 shrink-0 whitespace-nowrap pr-4 text-left text-xs font-bold text-slate-500">
                  {row.label}
                </div>
                {policies.map((policy, index) => (
                  <div
                    key={policy.policyId}
                    className={`${getPolicyCellClass(index)} text-xs text-slate-700 leading-relaxed`}
                  >
                    {row.render(policy)}
                  </div>
                ))}
              </div>
            ))}

            {/* 신청 링크 */}
            <div className="flex">
              <div className="w-28 shrink-0 whitespace-nowrap pr-4 text-left text-xs font-bold text-slate-500">
                신청 바로가기
              </div>
              {policies.map((policy, index) => (
                <div key={policy.policyId} className={getPolicyCellClass(index)}>
                  {policy.applicationUrl ? (
                    <a
                      href={policy.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      신청 바로가기 ↗
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">정보 없음</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
