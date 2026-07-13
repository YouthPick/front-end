import { Search } from 'lucide-react';
import { COMMUNITY_POST_CATEGORIES } from '@/entities/community-post';

import { ALL_CATEGORY_VALUE } from '../hooks/useAdminCommunityFilters';

interface AdminCommunityFiltersProps {
  category: string | undefined;
  onCategoryChange: (value: string) => void;
  authorId: string;
  onAuthorIdChange: (value: string) => void;
  onAuthorIdSubmit: () => void;
  startDate: string;
  endDate: string;
  onDateRangeChange: (range: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
}

export function AdminCommunityFilters({
  category,
  onCategoryChange,
  authorId,
  onAuthorIdChange,
  onAuthorIdSubmit,
  startDate,
  endDate,
  onDateRangeChange,
  onReset,
}: AdminCommunityFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={category ?? ALL_CATEGORY_VALUE}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="카테고리 필터"
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs font-bold text-slate-600 focus:border-primary focus:outline-none"
      >
        <option value={ALL_CATEGORY_VALUE}>전체 카테고리</option>
        {COMMUNITY_POST_CATEGORIES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div className="relative">
        <input
          type="text"
          value={authorId}
          onChange={(e) => onAuthorIdChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onAuthorIdSubmit();
          }}
          placeholder="작성자 ID 검색"
          aria-label="작성자 ID로 게시글 검색"
          className="w-32 rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={onAuthorIdSubmit}
          aria-label="작성자 ID로 검색"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      </div>

      <input
        type="date"
        value={startDate}
        onChange={(e) => onDateRangeChange({ startDate: e.target.value })}
        aria-label="작성일 시작"
        max={endDate || undefined}
        className="rounded-xl border border-slate-200 bg-white py-2 px-2.5 text-xs text-slate-600 focus:border-primary focus:outline-none"
      />
      <span className="text-xs text-slate-400">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onDateRangeChange({ endDate: e.target.value })}
        aria-label="작성일 종료"
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
