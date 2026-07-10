import { useCommunityPostSearchQuery } from '@/entities/community-post';

import { useCommunityBoardFilters } from './useCommunityBoardFilters';

// 커뮤니티 목록 화면 use case: URL 필터 상태 + 서버(mock) 검색 질의를 묶는다.
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

  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
  } = useCommunityPostSearchQuery({ query, category, sort });

  return {
    query: draftQuery,
    category,
    sort,
    posts,
    isLoading,
    isError,
    reload: refetch,
    setQuery: setDraftQuery,
    submitQuery,
    resetFilters,
    setCategory,
    setSort,
  };
}
