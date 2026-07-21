import { useState } from 'react';

import { useCommunityPostPageQuery } from '@/entities/community-post';

import { useCommunityBoardFilters } from './useCommunityBoardFilters';

// widgets/community-post-grid의 COMMUNITY_POST_GRID_SKELETON_COUNT(3열 x 2행)와 값을 맞춰
// 로딩 스켈레톤 개수와 실제 페이지당 카드 개수가 어긋나지 않게 한다.
const COMMUNITY_PAGE_SIZE = 6;

// 커뮤니티 목록 화면 use case: URL 필터 상태(검색어/카테고리/정렬) + 서버 페이지네이션 조회를 묶는다.
export function useCommunityBoard() {
  const {
    query,
    draftQuery,
    setDraftQuery,
    submitQuery,
    resetFilters,
    category,
    sort,
    setCategory,
    setSort,
  } = useCommunityBoardFilters();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useCommunityPostPageQuery({
    page,
    pageSize: COMMUNITY_PAGE_SIZE,
    query,
    category,
    sort,
  });

  const posts = data?.items ?? [];
  const pageCount = Math.max(1, Math.ceil((data?.totalCount ?? 0) / COMMUNITY_PAGE_SIZE));

  const handleSubmitQuery: typeof submitQuery = () => {
    submitQuery();
    setPage(1);
  };

  const handleResetFilters: typeof resetFilters = () => {
    resetFilters();
    setPage(1);
  };

  const handleSetCategory: typeof setCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleSetSort: typeof setSort = (value) => {
    setSort(value);
    setPage(1);
  };

  return {
    query: draftQuery,
    category,
    sort,
    posts,
    page,
    pageItems: posts,
    pageCount,
    setPage,
    isLoading,
    isError,
    reload: refetch,
    setQuery: setDraftQuery,
    submitQuery: handleSubmitQuery,
    resetFilters: handleResetFilters,
    setCategory: handleSetCategory,
    setSort: handleSetSort,
  };
}
