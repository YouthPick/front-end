import { usePolicySearchQuery } from "@/entities/policy";

import { useSearchFilters } from "./useSearchFilters";

// 검색 화면 use case: URL 필터 상태 + 서버(mock) 검색 질의를 묶는다.
export function usePolicySearch() {
  const { query, filters, setQuery, setFilter, resetFilters, showNationwideOnly } =
    useSearchFilters();

  const {
    data: policies = [],
    isLoading,
    isError,
    refetch,
  } = usePolicySearchQuery({ query, ...filters });

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
  };
}
