import { Search } from 'lucide-react';

interface AdminSearchLogFiltersProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onKeywordSubmit: () => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

export function AdminSearchLogFilters({
  keyword,
  onKeywordChange,
  onKeywordSubmit,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminSearchLogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onKeywordSubmit();
          }}
          placeholder="검색어 검색"
          aria-label="키워드로 검색 로그 검색"
          className="w-48 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs focus:border-primary focus:outline-none"
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
        className="rounded-xl px-2.5 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      >
        초기화
      </button>
    </div>
  );
}
