import { useSearchParams } from 'react-router';

export const DEFAULT_CATEGORY_VALUE = '전체';

// 검색어·카테고리 상태를 URL 쿼리스트링(`/community?q=&category=...`)과 동기화한다.
export function useCommunityBoardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? DEFAULT_CATEGORY_VALUE;

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

  return { query, category, setQuery, setCategory };
}
