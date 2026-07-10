import { useSearchParams } from 'react-router';

import {
  DEFAULT_COMMUNITY_POST_SORT,
  normalizeCommunityPostCategory,
  normalizeCommunityPostSort,
} from '@/entities/community-post';
import { useSubmittableUrlQuery } from '@/shared/hooks';

export const DEFAULT_CATEGORY_VALUE = '전체';

// 검색어·카테고리·정렬 상태를 URL 쿼리스트링(`/community?q=&category=&sort=...`)과 동기화한다.
// 검색어는 입력 중엔 draftQuery로만 반영하고, 제출(버튼/Enter)했을 때만 실제 검색과 URL에 반영한다.
export function useCommunityBoardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, draftQuery, setDraftQuery, submitQuery, resetQuery } = useSubmittableUrlQuery('q');

  // URL에서 온 카테고리 값은 신뢰할 수 없으므로 알 수 없는 값은 기본값(전체)으로 되돌린다.
  const categoryParam = searchParams.get('category');
  const category =
    categoryParam === null
      ? DEFAULT_CATEGORY_VALUE
      : (normalizeCommunityPostCategory(categoryParam) ?? DEFAULT_CATEGORY_VALUE);
  const sort = normalizeCommunityPostSort(searchParams.get('sort'));

  const setCategory = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === DEFAULT_CATEGORY_VALUE) {
          next.delete('category');
        } else {
          next.set('category', value);
        }
        return next;
      },
      { replace: true },
    );
  };

  const setSort = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === DEFAULT_COMMUNITY_POST_SORT) {
          next.delete('sort');
        } else {
          next.set('sort', value);
        }
        return next;
      },
      { replace: true },
    );
  };

  return {
    query,
    draftQuery,
    setDraftQuery,
    submitQuery,
    resetQuery,
    category,
    sort,
    setCategory,
    setSort,
  };
}
