import { RotateCcw } from 'lucide-react';
import type { AdminPolicyVisibilityStatus } from '@/entities/policy';
import { POLICY_CATEGORIES } from '@/entities/policy';

import { ALL_FILTER_VALUE } from '../hooks/useAdminPolicyFilters';

const VISIBILITY_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_FILTER_VALUE, label: '전체 공개상태' },
  { value: 'VISIBLE', label: '노출' },
  { value: 'HIDDEN', label: '비노출' },
];

interface AdminPolicyFiltersProps {
  category: string | undefined;
  onCategoryChange: (value: string) => void;
  visibilityStatus: AdminPolicyVisibilityStatus | undefined;
  onVisibilityStatusChange: (value: string) => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

export function AdminPolicyFilters({
  category,
  onCategoryChange,
  visibilityStatus,
  onVisibilityStatusChange,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminPolicyFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={category ?? ALL_FILTER_VALUE}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="카테고리 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        <option value={ALL_FILTER_VALUE}>전체 카테고리</option>
        {POLICY_CATEGORIES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={visibilityStatus ?? ALL_FILTER_VALUE}
        onChange={(e) => onVisibilityStatusChange(e.target.value)}
        aria-label="공개상태 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        {VISIBILITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(e) => onDateRangeChange({ startDate: e.target.value })}
        aria-label="신청기간 시작일"
        max={endDate || undefined}
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-600 focus:border-primary focus:outline-none"
      />
      <span className="text-xs text-slate-400">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onDateRangeChange({ endDate: e.target.value })}
        aria-label="신청기간 종료일"
        min={startDate || undefined}
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-600 focus:border-primary focus:outline-none"
      />

      <button
        type="button"
        onClick={onReset}
        aria-label="필터 초기화"
        className="inline-flex items-center space-x-1 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>초기화</span>
      </button>
    </div>
  );
}
