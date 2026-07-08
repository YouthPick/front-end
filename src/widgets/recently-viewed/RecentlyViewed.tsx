import {
  getPolicyCategoryBadgeClasses,
  usePolicyDetailStore,
  useRecentlyViewedPoliciesQuery,
} from '@/entities/policy';
import { Skeleton } from '@/shared/ui';

// 원본 화면과 동일하게 일부 제목에 주관 부처를 병기한다.
const TITLE_SUFFIX_BY_NAME: Record<string, string> = {
  청년내일채움공제: '청년내일채움공제 (고용노동부)',
  국민내일배움카드: '국민내일배움카드 (고용노동부)',
};

export function RecentlyViewed() {
  const { data: recentPolicies = [], isLoading } = useRecentlyViewedPoliciesQuery();
  const openPolicyDetail = usePolicyDetailStore((state) => state.openPolicyDetail);

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
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {isLoading && (
          <div className="space-y-2 py-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        )}

        {!isLoading && recentPolicies.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-400">최근 조회한 정책이 없습니다.</p>
        )}

        {recentPolicies.map((item) => {
          const displayTitle = TITLE_SUFFIX_BY_NAME[item.title] ?? item.title;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openPolicyDetail(item.id)}
              className="flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-slate-50/50 rounded-xl px-2 -mx-2 cursor-pointer"
              id={`recently-viewed-${item.id}`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <span
                  className={`rounded border px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${getPolicyCategoryBadgeClasses(item.category)}`}
                >
                  {item.category}
                </span>
                <span className="truncate text-[11px] font-bold text-slate-700">
                  {displayTitle}
                </span>
              </div>
              <div className="flex items-center space-x-1 shrink-0 pl-2">
                <span className="text-[10px] font-semibold text-slate-400">{item.viewedDate}</span>
                <svg
                  className="h-3 w-3 text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
