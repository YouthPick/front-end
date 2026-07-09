import { Search } from 'lucide-react';

interface CommunitySearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function CommunitySearchBar({ query, onQueryChange }: CommunitySearchBarProps) {
  return (
    <div className="relative max-w-xl">
      <input
        type="text"
        placeholder="제목이나 내용으로 게시글 검색"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-5 pr-12 text-xs transition-colors focus:border-primary focus:outline-none shadow-sm"
        id="community-search-input"
        aria-label="커뮤니티 게시글 검색어 입력"
      />
      <Search
        className="absolute right-4.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
    </div>
  );
}
