import { useSearchParams } from 'react-router';

import {
  DEFAULT_COMMUNITY_POST_SORT,
  normalizeCommunityPostCategory,
  normalizeCommunityPostSort,
} from '@/entities/community-post';

export const DEFAULT_CATEGORY_VALUE = '전체';

// 검색어·카테고리·정렬 상태를 URL 쿼리스트링(`/community?q=&category=&sort=...`)과 동기화한다.
export function useCommunityBoardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  // URL에서 온 카테고리 값은 신뢰할 수 없으므로 알 수 없는 값은 기본값(전체)으로 되돌린다.
  const categoryParam = searchParams.get('category');
  const category =
    categoryParam === null
      ? DEFAULT_CATEGORY_VALUE
      : (normalizeCommunityPostCategory(categoryParam) ?? DEFAULT_CATEGORY_VALUE);
  const sort = normalizeCommunityPostSort(searchParams.get('sort'));

  const setQuery = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === '') {
          next.delete('q');
        } else {
          next.set('q', value);
        }
        return next;
      },
      { replace: true },
    );
  };

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

  return { query, category, sort, setQuery, setCategory, setSort };
}
