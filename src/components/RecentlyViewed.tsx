import { ChevronRight } from 'lucide-react';
import { RECENTLY_VIEWED_POLICIES } from '../data';
import type { Policy } from '../types';

interface RecentlyViewedProps {
  policies: Policy[];
  onViewDetails: (policy: Policy) => void;
}

export default function RecentlyViewed({ policies, onViewDetails }: RecentlyViewedProps) {
  // Find full policy info from the list of all policies based on mock data
  const getFullPolicy = (id: string) => {
    return policies.find((p) => p.id === id);
  };

  const getBadgeColors = (category: string) => {
    switch (category) {
      case '주거':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case '일자리':
        return 'bg-primary/10 text-primary border border-primary/20';
      case '교육':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      default:
        return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">최근 본 정책</h3>
        <button
          type="button"
          className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center space-x-0.5 cursor-pointer"
        >
          <span>전체 보기</span>
          <svg
            aria-hidden="true"
            focusable="false"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {RECENTLY_VIEWED_POLICIES.map((item) => {
          const fullPolicy = getFullPolicy(item.id);
          // Append publisher in parenthesis to match screenshot if it matches
          let displayTitle = item.title;
          if (item.title === '청년내일채움공제') {
            displayTitle = '청년내일채움공제 (고용노동부)';
          } else if (item.title === '국민내일배움카드') {
            displayTitle = '국민내일배움카드 (고용노동부)';
          }

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => fullPolicy && onViewDetails(fullPolicy)}
              disabled={!fullPolicy}
              className="flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-slate-50/50 rounded-xl px-2 -mx-2 cursor-pointer"
              id={`recently-viewed-${item.id}`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${getBadgeColors(item.category)}`}
                >
                  {item.category}
                </span>
                <span className="truncate text-[11px] font-bold text-slate-700">
                  {displayTitle}
                </span>
              </div>
              <div className="flex items-center space-x-1 shrink-0 pl-2">
                <span className="text-[10px] font-semibold text-slate-400">{item.date}</span>
                <ChevronRight className="h-3 w-3 text-slate-300" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
