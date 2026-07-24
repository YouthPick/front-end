import type { BatchJobLogStatus } from '@/entities/batch-job-log';

import { ALL_STATUS_VALUE } from '../hooks/useAdminBatchLogFilters';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_STATUS_VALUE, label: '전체 상태' },
  { value: 'SUCCESS', label: 'SUCCESS' },
  { value: 'PARTIAL', label: 'PARTIAL' },
  { value: 'FAILED', label: 'FAILED' },
];

interface AdminBatchLogFiltersProps {
  status: BatchJobLogStatus | undefined;
  onStatusChange: (value: string) => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

export function AdminBatchLogFilters({
  status,
  onStatusChange,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminBatchLogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={status ?? ALL_STATUS_VALUE}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="상태 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(e) => onDateRangeChange({ startDate: e.target.value })}
        aria-label="실행일 시작"
        max={endDate || undefined}
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-600 focus:border-primary focus:outline-none"
      />
      <span className="text-xs text-slate-400">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onDateRangeChange({ endDate: e.target.value })}
        aria-label="실행일 종료"
        min={startDate || undefined}
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-600 focus:border-primary focus:outline-none"
      />

      <button
        type="button"
        onClick={onReset}
        aria-label="필터 초기화"
        className="rounded-xl px-2.5 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      >
        초기화
      </button>
    </div>
  );
}
