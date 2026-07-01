import type { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";
import { CompareModule } from "@features/policy-compare";
import { FilterBar, type FilterState } from "@features/policy-filter";
import { PolicyCard, type Policy } from "@entities/policy";
import type { PolicyReadStatus } from "@entities/user";

interface PolicyPagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface SearchPageProps {
  searchQuery: string;
  policySearchSuggestions: string[];
  isPolicySuggestionLoading: boolean;
  isPolicySuggestionFallback: boolean;
  policySuggestionErrorMessage: string | null;
  filters: FilterState;
  filteredPolicies: Policy[];
  isPolicyLoading: boolean;
  isPolicyFallback: boolean;
  policyApiErrorMessage: string | null;
  policyPagination: PolicyPagination;
  savedPolicyIds: string[];
  readStatesByPolicyId: Record<string, PolicyReadStatus>;
  comparingPolicies: Policy[];
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  onApplySearchSuggestion: (suggestion: string) => void;
  onFiltersChange: Dispatch<SetStateAction<FilterState>>;
  onPolicyPageChange: (page: number) => void;
  onResetFilters: () => void;
  onResetEmptyState: () => void;
  onShowNationwidePolicies: () => void;
  onToggleSave: (policyId: string) => void;
  onViewPolicyDetails: (policy: Policy) => void;
  onToggleCompare: (policy: Policy) => void;
  onClearCompare: () => void;
  onRemoveCompare: (policy: Policy) => void;
}

export function SearchPage({
  searchQuery,
  policySearchSuggestions,
  isPolicySuggestionLoading,
  isPolicySuggestionFallback,
  policySuggestionErrorMessage,
  filters,
  filteredPolicies,
  isPolicyLoading,
  isPolicyFallback,
  policyApiErrorMessage,
  policyPagination,
  savedPolicyIds,
  readStatesByPolicyId,
  comparingPolicies,
  onSearchQueryChange,
  onSearchSubmit,
  onApplySearchSuggestion,
  onFiltersChange,
  onPolicyPageChange,
  onResetFilters,
  onResetEmptyState,
  onShowNationwidePolicies,
  onToggleSave,
  onViewPolicyDetails,
  onToggleCompare,
  onClearCompare,
  onRemoveCompare,
}: SearchPageProps) {
  const currentPage = policyPagination.page;
  const totalPages = policyPagination.totalPages;
  const totalElements = policyPagination.totalElements;
  const canGoPrevious = currentPage > 0 && !isPolicyLoading;
  const canGoNext = totalPages > 0 && currentPage + 1 < totalPages && !isPolicyLoading;
  const firstItemNumber = totalElements === 0 ? 0 : currentPage * policyPagination.size + 1;
  const lastItemNumber = Math.min((currentPage + 1) * policyPagination.size, totalElements);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-left space-y-1">
        <span className="text-[10px] font-extrabold text-primary">YouthPick &gt; 통합 검색</span>
        <h2 className="text-lg font-black text-slate-800">실시간 정책 검색기</h2>
        <p className="text-xs text-slate-400">
          조건 필터와 지역 정보를 조합하여 나에게 딱 맞는 혜택 사업을 세밀하게 타겟팅해 보세요.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 max-w-3xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="예: '월세', '인턴', 'K-디지털', '서울' 등 키워드나 정책명 검색"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-5 pr-12 text-xs transition-colors focus:border-primary focus:outline-none shadow-sm"
            id="search-main-input"
          />
          <Search className="absolute right-4.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <button
          onClick={() => onSearchSubmit()}
          className="rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-white transition-all hover:brightness-105"
        >
          검색하기
        </button>
      </div>

      {(isPolicySuggestionLoading ||
        policySearchSuggestions.length > 0 ||
        policySuggestionErrorMessage) && (
        <div className="max-w-3xl rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left shadow-sm">
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span>추천 검색어</span>
            {isPolicySuggestionLoading && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
                불러오는 중
              </span>
            )}
            {policySuggestionErrorMessage && (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-600">
                서버 검색어 제안 실패 · {policySuggestionErrorMessage}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {policySearchSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onApplySearchSuggestion(suggestion)}
                className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-bold text-primary transition-colors hover:bg-primary/10"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <FilterBar filters={filters} setFilters={onFiltersChange} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-left">
        <div>
          <span className="text-xs text-slate-500 font-semibold">
            총 <span className="text-primary font-bold">{totalElements.toLocaleString()}건</span>의
            청년 정책이 정밀 필터링되었습니다.
          </span>
          {totalElements > 0 && (
            <p className="mt-0.5 text-[10px] font-bold text-slate-400">
              현재 {firstItemNumber.toLocaleString()}-{lastItemNumber.toLocaleString()}건 표시 ·{" "}
              {currentPage + 1}/{totalPages}페이지
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
            {isPolicyLoading && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
                API 동기화 중
              </span>
            )}
            {policyApiErrorMessage && (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-600">
                서버 데이터 로드 실패 · {policyApiErrorMessage}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-[10px] font-bold text-slate-400">보기 구분:</span>
          <button
            onClick={() => onResetFilters()}
            className="text-[10px] font-bold text-primary hover:underline"
          >
            필터 초기화
          </button>
        </div>
      </div>

      {filteredPolicies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
              {filteredPolicies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  isSaved={savedPolicyIds.includes(policy.id)}
                  readStatus={readStatesByPolicyId[policy.id] ?? "UNREAD"}
                  onToggleSave={onToggleSave}
                  onViewDetails={onViewPolicyDetails}
                  isComparing={comparingPolicies.some((p) => p.id === policy.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm sm:flex-row">
                <p className="text-[11px] font-bold text-slate-500">
                  페이지 <span className="text-primary">{currentPage + 1}</span> / {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canGoPrevious}
                    onClick={() => onPolicyPageChange(Math.max(currentPage - 1, 0))}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => onPolicyPageChange(currentPage + 1)}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition-colors hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <CompareModule
              comparingPolicies={comparingPolicies}
              onClear={onClearCompare}
              onRemove={onRemoveCompare}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 px-4 text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-5xl block animate-bounce">🔍</span>
          <h3 className="text-sm font-extrabold text-slate-700">
            일치하는 검색 결과가 전혀 없습니다
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {policyApiErrorMessage
              ? "서버 정책 데이터를 불러오지 못했습니다. 백엔드 상태를 확인한 뒤 다시 시도해 주세요."
              : "선택한 시·도 필터 조건이 맞지 않거나, 특정 카테고리에 너무 협소한 연령 조건이 지정되었을 수 있습니다."}
          </p>
          <div className="flex justify-center space-x-2 pt-1">
            <button
              onClick={() => {
                onResetFilters();
                onSearchQueryChange("");
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              필터 설정 전체 초기화
            </button>
            <button
              onClick={() => {
                onShowNationwidePolicies();
                onSearchQueryChange("");
              }}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-105 transition-colors"
            >
              전국 공통 정책 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
