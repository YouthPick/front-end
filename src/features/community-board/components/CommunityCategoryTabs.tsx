import { COMMUNITY_POST_CATEGORIES } from '@/entities/community-post';

import { DEFAULT_CATEGORY_VALUE } from '../hooks/useCommunityBoardFilters';

const CATEGORY_TABS = [DEFAULT_CATEGORY_VALUE, ...COMMUNITY_POST_CATEGORIES];

interface CommunityCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CommunityCategoryTabs({
  activeCategory,
  onCategoryChange,
}: CommunityCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2">
      {CATEGORY_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onCategoryChange(tab)}
          aria-pressed={activeCategory === tab}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-extrabold transition-all ${
            activeCategory === tab
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200/85'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
