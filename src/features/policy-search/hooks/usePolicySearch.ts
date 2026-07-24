import { useState } from 'react';

import { usePolicySearchPageQuery } from '@/entities/policy';
import { useToast } from '@/shared/ui';

import { toJobCodeParam } from '../policySearchOptions';
import { useSearchFilters } from './useSearchFilters';

// widgets/policy-card-grid의 POLICY_GRID_SKELETON_COUNT(3열 x 2행)와 값을 맞춰
// 로딩 스켈레톤 개수와 실제 페이지당 카드 개수가 어긋나지 않게 한다.
const SEARCH_PAGE_SIZE = 6;

// 검색 화면 use case: URL 필터 상태 + 서버 페이지네이션 검색 질의를 묶는다.
// keyword·region·category·age·status(→ jobCode)를 모두 서버가 필터링한다(#86/#87, back-end#133).
export function usePolicySearch() {
  const { query, draftQuery, setDraftQuery, submitQuery, filters, setFilter, resetFilters } =
    useSearchFilters();
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  // status는 UI 라벨이라 그대로 보낼 수 없다 — 여기서 jobCode로 옮긴다. 쿼리 key도 번역된 값을
  // 쓰므로, 서버가 구분하지 못하는 선택 변경으로 불필요한 재조회가 생기지 않는다.
  const { status, ...serverFilters } = filters;
  const { data, isLoading, isError, refetch } = usePolicySearchPageQuery(
    { query, ...serverFilters, jobCode: toJobCodeParam(status) },
    page,
    SEARCH_PAGE_SIZE,
  );
  const pageItems = data?.policies ?? [];
  const pageCount = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

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
    totalCount,
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
    submitSearch,
  };
}
