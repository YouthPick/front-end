import { usePolicySearchQuery } from "@/entities/policy";
import { useDebouncedValue } from "@/shared/hooks";
import { useToast } from "@/shared/ui";

import { useSearchFilters } from "./useSearchFilters";

const SEARCH_DEBOUNCE_MS = 300;

// 검색 화면 use case: URL 필터 상태 + 서버(mock) 검색 질의를 묶는다.
export function usePolicySearch() {
  const { query, filters, setQuery, setFilter, resetFilters, showNationwideOnly } =
    useSearchFilters();
  const { showToast } = useToast();

  // 입력은 URL에 즉시 반영하되, 질의는 디바운스해 keystroke마다 refetch되지 않게 한다.
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  const {
    data: policies = [],
    isLoading,
    isError,
    refetch,
  } = usePolicySearchQuery({ query: debouncedQuery, ...filters });

  const submitSearch = () => {
    showToast(`검색 쿼리가 적용되었습니다: '${query}'`, "info");
  };

  return {
    query,
    filters,
    policies,
    isLoading,
    isError,
    reload: refetch,
    setQuery,
    setFilter,
    resetFilters,
    showNationwideOnly,
    submitSearch,
  };
}
