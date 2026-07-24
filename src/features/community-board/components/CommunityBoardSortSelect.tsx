import { COMMUNITY_POST_SORT_OPTIONS } from '@/entities/community-post';

interface CommunityBoardSortSelectProps {
  sort: string;
  onSortChange: (value: string) => void;
}

export function CommunityBoardSortSelect({ sort, onSortChange }: CommunityBoardSortSelectProps) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-2.5 pr-6 text-[11px] font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-50"
        id="community-sort-select"
        aria-label="게시글 정렬"
      >
        {COMMUNITY_POST_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 h-3 w-3 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
