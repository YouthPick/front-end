import { Search } from 'lucide-react';

interface PolicySearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function PolicySearchBar({ query, onQueryChange, onSubmit }: PolicySearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 max-w-3xl">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="예: '월세', '인턴', 'K-디지털', '서울' 등 키워드나 정책명 검색"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) onSubmit();
          }}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-5 pr-12 text-xs transition-colors focus:border-primary focus:outline-none shadow-sm"
          id="search-main-input"
          aria-label="정책 검색어 입력"
        />
        <Search className="absolute right-4.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="rounded-2xl bg-gradient-to-r from-primary to-brand-secondary px-6 py-3 text-xs font-bold text-white transition-all hover:brightness-105"
      >
        검색하기
      </button>
    </div>
  );
}
