import { RotateCcw, Search } from 'lucide-react';

interface AdminLoginLogFiltersProps {
  userId: string;
  onUserIdChange: (value: string) => void;
  onUserIdSubmit: () => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

export function AdminLoginLogFilters({
  userId,
  onUserIdChange,
  onUserIdSubmit,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminLoginLogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onUserIdSubmit();
          }}
          placeholder="사용자 ID 검색"
          aria-label="사용자 ID로 로그인 로그 검색"
          className="w-36 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={onUserIdSubmit}
          aria-label="사용자 ID로 검색"
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
