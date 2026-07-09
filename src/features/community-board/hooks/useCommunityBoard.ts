import { useCommunityPostSearchQuery } from '@/entities/community-post';
import { useDebouncedValue } from '@/shared/hooks';

import { useCommunityBoardFilters } from './useCommunityBoardFilters';

const SEARCH_DEBOUNCE_MS = 300;

// 커뮤니티 목록 화면 use case: URL 필터 상태 + 서버(mock) 검색 질의를 묶는다.
export function useCommunityBoard() {
  const { query, category, sort, setQuery, setCategory, setSort } = useCommunityBoardFilters();

  // 입력은 URL에 즉시 반영하되, 질의는 디바운스해 keystroke마다 refetch되지 않게 한다.
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
  } = useCommunityPostSearchQuery({ query: debouncedQuery, category, sort });

  return {
    query,
    category,
    sort,
    posts,
    isLoading,
    isError,
    reload: refetch,
    setQuery,
    setCategory,
    setSort,
  };
}
