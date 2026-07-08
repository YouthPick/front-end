import { useSearchParams } from 'react-router';

import type { PolicySearchFilterKey, PolicySearchFilters } from '../types/policySearch.types';

export const DEFAULT_FILTER_VALUE = '전체';

const FILTER_KEYS: PolicySearchFilterKey[] = ['region', 'status', 'category', 'age'];

// 검색어·필터 상태를 URL 쿼리스트링(`/search?q=&region=...`)과 동기화한다.
export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const filters: PolicySearchFilters = {
    region: searchParams.get('region') ?? DEFAULT_FILTER_VALUE,
    status: searchParams.get('status') ?? DEFAULT_FILTER_VALUE,
    category: searchParams.get('category') ?? DEFAULT_FILTER_VALUE,
    age: searchParams.get('age') ?? DEFAULT_FILTER_VALUE,
  };

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

  const setFilter = (key: PolicySearchFilterKey, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === DEFAULT_FILTER_VALUE) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      },
      { replace: true },
    );
  };

  const resetFilters = (options: { clearQuery?: boolean } = {}) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const key of FILTER_KEYS) {
          next.delete(key);
        }
        if (options.clearQuery) {
          next.delete('q');
        }
        return next;
      },
      { replace: true },
    );
  };

  const showNationwideOnly = () => {
    setSearchParams(new URLSearchParams({ region: '전국' }), { replace: true });
  };

  return { query, filters, setQuery, setFilter, resetFilters, showNationwideOnly };
}
