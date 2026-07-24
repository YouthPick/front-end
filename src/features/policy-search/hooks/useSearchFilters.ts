import { useSearchParams } from 'react-router';

import { useSubmittableUrlQuery } from '@/shared/hooks';

import { REGION_FILTER_OPTIONS } from '../policySearchOptions';
import type { PolicySearchFilterKey, PolicySearchFilters } from '../types/policySearch.types';

export const DEFAULT_FILTER_VALUE = '전체';

const FILTER_KEYS: PolicySearchFilterKey[] = ['region', 'status', 'category', 'age'];

// 검색어·필터 상태를 URL 쿼리스트링(`/search?q=&region=...`)과 동기화한다.
// 검색어는 입력 중엔 draftQuery로만 반영하고, 제출(버튼/Enter)했을 때만 실제 검색과 URL에 반영한다.
export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, draftQuery, setDraftQuery, submitQuery } = useSubmittableUrlQuery('q');

  // 옵션에 없는 region 값은 '전체'로 정규화한다. 공유·북마크된 옛 URL(?region=전국 등)이나 손수정 쿼리가
  // 들어오면 controlled select는 매칭 실패로 빈 칸을 보여주는데 요청에는 그 값이 그대로 나가, 필터바는
  // "지역 조건 없음"인데 결과는 0건인 상태가 된다.
  // REGION_FILTER_OPTIONS는 as const라 원소 타입이 리터럴 유니온이다 — URL에서 온 임의 문자열을
  // 그대로 includes에 넘기면 타입이 막으므로, 검사 목적임을 명시해 string[]으로 넓힌다.
  const rawRegion = searchParams.get('region');
  const region =
    rawRegion && (REGION_FILTER_OPTIONS as readonly string[]).includes(rawRegion)
      ? rawRegion
      : DEFAULT_FILTER_VALUE;

  const filters: PolicySearchFilters = {
    region,
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

  return {
    query,
    draftQuery,
    setDraftQuery,
    submitQuery,
    filters,
    setFilter,
    resetFilters,
  };
}
