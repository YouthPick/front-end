import { motion } from 'motion/react';

import type { Policy } from '@/entities/policy';
import { useBodyScrollLock } from '@/shared/hooks';

import { COMPARE_SLOTS } from './compareSlots';

interface CompareDetailDialogProps {
  policies: Policy[];
  onClose: () => void;
}

// 텍스트 한 줄로 표현되는 비교 항목. 상세(details)는 리스트라 별도로 렌더한다.
const COMPARE_ROWS: { label: string; render: (policy: Policy) => string }[] = [
  { label: '카테고리', render: (policy) => policy.category },
  { label: '소속 지역', render: (policy) => policy.region },
  { label: '지원 연령', render: (policy) => policy.target },
  { label: '정책 소개', render: (policy) => policy.description },
];

// 정책 칸끼리 옅은 세로선으로 구분한다(첫 칸 제외). 라벨 칸은 구분선 없이 오른쪽 여백만 둔다.
function getPolicyCellClass(index: number) {
  return `flex-1 min-w-0 text-left px-4 ${index > 0 ? 'border-l border-slate-100' : ''}`;
}

export function CompareDetailDialog({ policies, onClose }: CompareDetailDialogProps) {
  useBodyScrollLock();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
        id="comparison-detail-modal"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-extrabold text-slate-800">📊 청년정책 맞춤 비교분석</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="비교 분석 닫기"
            className="rounded-full p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {/* 헤더: 정책 제목 */}
          <div className="flex">
            <div className="w-28 shrink-0 self-center whitespace-nowrap pr-4 text-left text-xs font-semibold text-slate-400">
              구분
            </div>
            {policies.map((policy, index) => (
              <div
                key={policy.id}
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
                  key={policy.id}
                  className={`${getPolicyCellClass(index)} text-xs text-slate-700 leading-relaxed`}
                >
                  {row.render(policy)}
                </div>
              ))}
            </div>
          ))}

          {/* 상세 혜택 및 요건 (리스트) */}
          <div className="flex">
            <div className="w-28 shrink-0 whitespace-nowrap pr-4 text-left text-xs font-bold text-slate-500">
              상세 혜택 및 요건
            </div>
            {policies.map((policy, index) => (
              <div
                key={policy.id}
                className={`${getPolicyCellClass(index)} text-[10px] text-slate-600 space-y-1.5 leading-relaxed`}
              >
                {policy.details.map((detail) => (
                  <p key={detail}>• {detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
