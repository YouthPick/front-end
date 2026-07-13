import { RotateCcw, Search } from 'lucide-react';
import type { ApplicationLogLevel } from '@/entities/application-log';

import { ALL_LOG_LEVELS_VALUE } from '../hooks/useAdminApplicationLogFilters';

const LOG_LEVEL_OPTIONS: { value: string; label: string }[] = [
  { value: ALL_LOG_LEVELS_VALUE, label: '전체 레벨' },
  { value: 'ERROR', label: 'ERROR' },
  { value: 'WARN', label: 'WARN' },
  { value: 'INFO', label: 'INFO' },
  { value: 'DEBUG', label: 'DEBUG' },
];

interface AdminApplicationLogFiltersProps {
  logLevel: ApplicationLogLevel | undefined;
  onLogLevelChange: (value: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onKeywordSubmit: () => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

export function AdminApplicationLogFilters({
  logLevel,
  onLogLevelChange,
  keyword,
  onKeywordChange,
  onKeywordSubmit,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminApplicationLogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={logLevel ?? ALL_LOG_LEVELS_VALUE}
        onChange={(e) => onLogLevelChange(e.target.value)}
        aria-label="로그 레벨 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        {LOG_LEVEL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onKeywordSubmit();
          }}
          placeholder="메시지·trace id·요청 경로 검색"
          aria-label="키워드로 애플리케이션 로그 검색"
          className="w-56 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={onKeywordSubmit}
          aria-label="키워드로 검색"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      </div>

      <input
        type="date"
        value={startDate}
        onChange={(e) => onDateRangeChange({ startDate: e.target.value })}
        aria-label="조회 시작일"
        max={endDate || undefined}
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-600 focus:border-primary focus:outline-none"
      />
      <span className="text-xs text-slate-400">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onDateRangeChange({ endDate: e.target.value })}
        aria-label="조회 종료일"
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
