import { ChatbotContainer } from "@/features/chatbot";
import { ComparePanelContainer } from "@/features/policy-compare";
import {
  PolicyFilterBar,
  PolicySearchBar,
  SearchEmptyState,
  usePolicySearch,
} from "@/features/policy-search";
import { ErrorState, Skeleton, useToast } from "@/shared/ui";
import { PolicyCardGrid } from "@/widgets/policy-card-grid";

export function SearchPage() {
  const {
    query,
    filters,
    policies,
    isLoading,
    isError,
    reload,
    setQuery,
    setFilter,
    resetFilters,
    showNationwideOnly,
  } = usePolicySearch();
  const { showToast } = useToast();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary">YouthPick &gt; 통합 검색</span>
        <h2 className="text-lg font-black text-slate-800">실시간 정책 검색기</h2>
        <p className="text-xs text-slate-400">
          조건 필터와 지역 정보를 조합하여 나에게 딱 맞는 혜택 사업을 세밀하게 타겟팅해 보세요.
        </p>
      </div>

      <PolicySearchBar
        query={query}
        onQueryChange={setQuery}
        onSubmit={() => showToast(`검색 쿼리가 적용되었습니다: '${query}'`, "info")}
      />

      <PolicyFilterBar filters={filters} onFilterChange={setFilter} />

      {/* Results row info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-left">
        <div>
          <span className="text-xs text-slate-500 font-semibold">
            총 <span className="text-primary font-bold">{policies.length}건</span>의 청년 정책이 정밀 필터링되었습니다.
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-[10px] font-bold text-slate-400">보기 구분:</span>
          <button
            type="button"
            onClick={() => resetFilters()}
            className="text-[10px] font-bold text-primary hover:underline"
          >
            필터 초기화
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid grid-cols-1 gap-4.5 sm:grid-cols-2">
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-48" />
          </div>
        </div>
      )}

      {isError && <ErrorState title="정책 목록을 불러오지 못했습니다" onRetry={() => reload()} />}

      {!isLoading && !isError && (
        policies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <PolicyCardGrid
                policies={policies}
                className="grid grid-cols-1 gap-4.5 sm:grid-cols-2"
              />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <ComparePanelContainer />
              <ChatbotContainer />
            </div>
          </div>
        ) : (
          <SearchEmptyState
            onResetAll={() => resetFilters({ clearQuery: true })}
            onShowNationwide={showNationwideOnly}
          />
        )
      )}
    </div>
  );
}
