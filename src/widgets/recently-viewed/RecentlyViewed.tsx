import { usePoliciesQuery, usePolicyDetailStore, useRecentlyViewedPoliciesQuery, type PolicyCategory } from "@/entities/policy";
import { Skeleton } from "@/shared/ui";

function getBadgeColors(category: PolicyCategory): string {
  switch (category) {
    case "주거":
      return "bg-blue-50 text-blue-600 border border-blue-100";
    case "일자리":
      return "bg-primary/10 text-primary border border-primary/20";
    case "교육":
      return "bg-indigo-50 text-indigo-600 border border-indigo-100";
    default:
      return "bg-slate-50 text-slate-500 border border-slate-100";
  }
}

// 원본 화면과 동일하게 일부 제목에 주관 부처를 병기한다.
const TITLE_SUFFIX_BY_NAME: Record<string, string> = {
  청년내일채움공제: "청년내일채움공제 (고용노동부)",
  국민내일배움카드: "국민내일배움카드 (고용노동부)",
};

export function RecentlyViewed() {
  const { data: recentPolicies = [], isLoading } = useRecentlyViewedPoliciesQuery();
  const { data: policies = [] } = usePoliciesQuery();
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
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
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
          const fullPolicy = policies.find((policy) => policy.id === item.id);
          const displayTitle = TITLE_SUFFIX_BY_NAME[item.title] ?? item.title;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => fullPolicy && openPolicyDetail(fullPolicy.id)}
              disabled={!fullPolicy}
              className="flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-slate-50/50 rounded-xl px-2 -mx-2 cursor-pointer"
              id={`recently-viewed-${item.id}`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${getBadgeColors(item.category)}`}>
                  {item.category}
                </span>
                <span className="truncate text-[11px] font-bold text-slate-700">{displayTitle}</span>
              </div>
              <div className="flex items-center space-x-1 shrink-0 pl-2">
                <span className="text-[10px] font-semibold text-slate-400">{item.viewedDate}</span>
                <svg className="h-3 w-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
