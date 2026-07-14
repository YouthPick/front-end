import { useCommunityPostSearchQuery } from '@/entities/community-post';
import { usePagination } from '@/shared/hooks';

import { useCommunityBoardFilters } from './useCommunityBoardFilters';

// widgets/community-post-grid의 COMMUNITY_POST_GRID_SKELETON_COUNT(3열 x 2행)와 값을 맞춰
// 로딩 스켈레톤 개수와 실제 페이지당 카드 개수가 어긋나지 않게 한다.
const COMMUNITY_PAGE_SIZE = 6;

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
  const { page, pageItems, pageCount, setPage } = usePagination(posts, COMMUNITY_PAGE_SIZE);

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
    pageItems,
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
