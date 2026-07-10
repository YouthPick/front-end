import { useSearchParams } from 'react-router';

import { useSubmittableUrlQuery } from '@/shared/hooks';

import type { PolicySearchFilterKey, PolicySearchFilters } from '../types/policySearch.types';

export const DEFAULT_FILTER_VALUE = '전체';

const FILTER_KEYS: PolicySearchFilterKey[] = ['region', 'status', 'category', 'age'];

// 검색어·필터 상태를 URL 쿼리스트링(`/search?q=&region=...`)과 동기화한다.
// 검색어는 입력 중엔 draftQuery로만 반영하고, 제출(버튼/Enter)했을 때만 실제 검색과 URL에 반영한다.
export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, draftQuery, setDraftQuery, submitQuery } = useSubmittableUrlQuery('q');

  const filters: PolicySearchFilters = {
    region: searchParams.get('region') ?? DEFAULT_FILTER_VALUE,
    status: searchParams.get('status') ?? DEFAULT_FILTER_VALUE,
    category: searchParams.get('category') ?? DEFAULT_FILTER_VALUE,
    age: searchParams.get('age') ?? DEFAULT_FILTER_VALUE,
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
    if (options.clearQuery) {
      setDraftQuery('');
    }
  };

  const showNationwideOnly = () => {
    setSearchParams(new URLSearchParams({ region: '전국' }), { replace: true });
  };

  return {
    query,
    draftQuery,
    setDraftQuery,
    submitQuery,
    filters,
    setFilter,
    resetFilters,
    showNationwideOnly,
  };
}
