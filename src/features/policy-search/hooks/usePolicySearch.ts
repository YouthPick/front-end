import { usePolicySearchQuery } from '@/entities/policy';
import { usePagination } from '@/shared/hooks';
import { useToast } from '@/shared/ui';

import { useSearchFilters } from './useSearchFilters';

// widgets/policy-card-grid의 POLICY_GRID_SKELETON_COUNT(3열 x 2행)와 값을 맞춰
// 로딩 스켈레톤 개수와 실제 페이지당 카드 개수가 어긋나지 않게 한다.
const SEARCH_PAGE_SIZE = 6;

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
  const { page, pageItems, pageCount, setPage } = usePagination(policies, SEARCH_PAGE_SIZE);

  const submitSearch = () => {
    submitQuery();
    setPage(1);
    showToast(`검색 쿼리가 적용되었습니다: '${draftQuery}'`, 'info');
  };

  const handleSetFilter: typeof setFilter = (key, value) => {
    setFilter(key, value);
    setPage(1);
  };

  const handleResetFilters: typeof resetFilters = (options) => {
    resetFilters(options);
    setPage(1);
  };

  return {
    query: draftQuery,
    filters,
    policies,
    page,
    pageItems,
    pageCount,
    setPage,
    isLoading,
    isError,
    reload: refetch,
    setQuery: setDraftQuery,
    setFilter: handleSetFilter,
    resetFilters: handleResetFilters,
    showNationwideOnly,
    submitSearch,
  };
}
