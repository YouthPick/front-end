import { RefreshCw } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import type { Policy } from '@/entities/policy';

import { CompareDetailDialog } from './CompareDetailDialog';

interface ComparePanelPresenterProps {
  comparingPolicies: Policy[];
  showDetailDialog: boolean;
  onOpenDetail: () => void;
  onCloseDetail: () => void;
  onRemove: (policy: Policy) => void;
  onClear: () => void;
}

interface CompareSlotProps {
  policy: Policy | undefined;
  slotLabel: string;
  badgeClasses: string;
  onRemove: (policy: Policy) => void;
}

function CompareSlot({ policy, slotLabel, badgeClasses, onRemove }: CompareSlotProps) {
  if (!policy) {
    return (
      <div className="col-span-5 text-left relative min-h-[56px] flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center py-2 text-[9px] text-slate-400 font-bold border border-dashed border-slate-200 rounded-lg bg-white h-full min-h-[48px]">
          <span>{slotLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-5 text-left relative min-h-[56px] flex flex-col justify-center">
      <div className="space-y-1 pr-4">
        <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${badgeClasses}`}>
          {policy.category}
        </span>
        <h4
          className="line-clamp-2 text-[10px] font-bold text-slate-700 leading-normal"
          title={policy.title}
        >
          {policy.title}
        </h4>
        <p className="text-[9px] text-slate-400 font-semibold">({policy.region})</p>
        <button
          type="button"
          onClick={() => onRemove(policy)}
          aria-label={`${policy.title} 비교 해제`}
          className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ComparePanelPresenter({
  comparingPolicies,
  showDetailDialog,
  onOpenDetail,
  onCloseDetail,
  onRemove,
  onClear,
}: ComparePanelPresenterProps) {
  const [firstPolicy, secondPolicy] = comparingPolicies;
  const canCompare = comparingPolicies.length >= 2;

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <div className="flex items-start justify-between">
        <div className="text-left space-y-0.5">
          <h3 className="text-sm font-bold text-slate-800">정책 비교</h3>
          <p className="text-[10px] text-slate-400 font-medium">
            최대 2개 정책을 선택해 비교해보세요.
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
        {/* Comparison slots row with VS inside */}
        <div className="grid grid-cols-11 items-center gap-2 rounded-xl bg-slate-50/50 p-3.5 border border-slate-100">
          <CompareSlot
            policy={firstPolicy}
            slotLabel="정책 1 선택"
            badgeClasses="bg-primary/10 text-primary border border-primary/20"
            onRemove={onRemove}
          />
          <div className="col-span-1 flex justify-center text-[10px] font-black text-slate-300">
            VS
          </div>
          <CompareSlot
            policy={secondPolicy}
            slotLabel="정책 2 선택"
            badgeClasses="bg-blue-50 text-blue-600 border border-blue-100"
            onRemove={onRemove}
          />
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

      <AnimatePresence>
        {showDetailDialog && firstPolicy && secondPolicy && (
          <CompareDetailDialog
            firstPolicy={firstPolicy}
            secondPolicy={secondPolicy}
            onClose={onCloseDetail}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
