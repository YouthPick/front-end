import { usePolicySearchQuery } from '@/entities/policy';
import { useToast } from '@/shared/ui';

import { useSearchFilters } from './useSearchFilters';

// 검색 화면 use case: URL 필터 상태 + 서버(mock) 검색 질의를 묶는다.
export function usePolicySearch() {
  const {
    query,
    draftQuery,
    setDraftQuery,
    submitQuery,
    filters,
    setFilter,
    resetFilters,
    showNationwideOnly,
  } = useSearchFilters();
  const { showToast } = useToast();

  const {
    data: policies = [],
    isLoading,
    isError,
    refetch,
  } = usePolicySearchQuery({ query, ...filters });

  const submitSearch = () => {
    submitQuery();
    showToast(`검색 쿼리가 적용되었습니다: '${draftQuery}'`, 'info');
  };

  return {
    query: draftQuery,
    filters,
    policies,
    isLoading,
    isError,
    reload: refetch,
    setQuery: setDraftQuery,
    setFilter,
    resetFilters,
    showNationwideOnly,
    submitSearch,
  };
}
