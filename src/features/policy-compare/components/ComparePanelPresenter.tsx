import { RefreshCw } from 'lucide-react';

import { getPolicyCategoryBadgeClasses, type Policy } from '@/entities/policy';
import { MAX_COMPARE_COUNT } from '@/shared/constants';

import { COMPARE_SLOTS } from './compareSlots';

interface ComparePanelPresenterProps {
  // policyIds와 인덱스가 1:1로 대응한다. 아직 상세를 불러오는 중인 슬롯은 undefined다.
  comparingPolicies: (Policy | undefined)[];
  onOpenDetail: () => void;
  onRemove: (policy: Policy) => void;
  onClear: () => void;
}

interface CompareSlotProps {
  policy: Policy | undefined;
  slotLabel: string;
  onRemove: (policy: Policy) => void;
}

function CompareSlot({ policy, slotLabel, onRemove }: CompareSlotProps) {
  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-2 text-[9px] font-bold text-slate-400 min-h-[64px]">
        <span>{slotLabel}</span>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg border border-slate-100 bg-white p-2.5 min-h-[64px]">
      <div className="space-y-1 pr-4">
        <span
          className={`inline-block rounded border px-1.5 py-0.5 text-[9px] font-bold ${getPolicyCategoryBadgeClasses(policy.category)}`}
        >
          {policy.category}
        </span>
        <h4
          className="line-clamp-2 text-[10px] font-bold text-slate-700 leading-normal"
          title={policy.title}
        >
          {policy.title}
        </h4>
        <p className="text-[9px] text-slate-400 font-semibold">({policy.region})</p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(policy)}
        aria-label={`${policy.title} 비교 해제`}
        className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

export function ComparePanelPresenter({
  comparingPolicies,
  onOpenDetail,
  onRemove,
  onClear,
}: ComparePanelPresenterProps) {
  const canCompare = comparingPolicies.length >= 2;
  const slots = COMPARE_SLOTS.slice(0, MAX_COMPARE_COUNT);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <div className="flex items-start justify-between">
        <div className="text-left space-y-0.5">
          <h3 className="text-sm font-bold text-slate-800">정책 비교</h3>
          <p className="text-[10px] text-slate-400 font-medium">
            최대 {MAX_COMPARE_COUNT}개 정책을 선택해 비교해보세요.
          </p>
        </div>

        {canCompare ? (
          <button
            type="button"
            onClick={onOpenDetail}
            className="text-xs font-bold text-primary hover:underline flex items-center space-x-0.5 cursor-pointer"
          >
            <span>비교하기</span>
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="text-xs font-bold text-slate-300 flex items-center space-x-0.5 cursor-default select-none">
            <span>비교하기</span>
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>

      <div className="mt-4">
        {/* 슬롯 그리드: 모바일 2열, sm 이상 3열 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl bg-slate-50/50 p-3.5 border border-slate-100">
          {slots.map((slot, index) => (
            <CompareSlot
              key={slot.label}
              policy={comparingPolicies[index]}
              slotLabel={slot.label}
              onRemove={onRemove}
            />
          ))}
        </div>

        {comparingPolicies.length > 0 && (
          <div className="mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>선택 해제</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
