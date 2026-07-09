import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import {
  DEFAULT_COMMUNITY_POST_SORT,
  normalizeCommunityPostCategory,
  normalizeCommunityPostSort,
} from '@/entities/community-post';

export const DEFAULT_CATEGORY_VALUE = '전체';

const QUERY_SYNC_DEBOUNCE_MS = 300;

// 검색어·카테고리·정렬 상태를 URL 쿼리스트링(`/community?q=&category=&sort=...`)과 동기화한다.
export function useCommunityBoardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 검색어는 로컬 state를 우선으로 하고 URL에는 디바운스로만 반영한다.
  // URL(searchParams)을 입력의 controlled value로 직접 쓰면 매 키 입력마다 라우터
  // 리렌더를 거치게 되어, 한글 조합(IME) 입력 중 값이 깨지는 문제가 있었다.
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (query === '') {
            next.delete('q');
          } else {
            next.set('q', query);
          }
          return next;
        },
        { replace: true },
      );
    }, QUERY_SYNC_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [query, setSearchParams]);

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

  return { query, category, sort, setQuery, setCategory, setSort };
}
