import { useSearchParams } from 'react-router';

import type { ApplicationLogLevel } from '@/entities/application-log';
import { useSubmittableUrlQuery } from '@/shared/hooks';

const DEFAULT_PAGE = 1;
export const ALL_LOG_LEVELS_VALUE = 'ALL';
const APPLICATION_LOG_LEVELS: readonly ApplicationLogLevel[] = ['ERROR', 'WARN', 'INFO', 'DEBUG'];

// URL에서 온 값은 신뢰할 수 없으므로 알 수 없는 값은 전체 조회(undefined)로 되돌린다.
function normalizeApplicationLogLevel(value: string | null): ApplicationLogLevel | undefined {
  return APPLICATION_LOG_LEVELS.find((level) => level === value);
}

interface ApplicationLogFilterValues {
  logLevel?: string;
  startDate?: string;
  endDate?: string;
}

// 로그 레벨·키워드·기간 필터와 페이지를 URL 쿼리스트링과 동기화한다.
// 키워드의 draft/제출 동기화는 shared/hooks/useSubmittableUrlQuery가 이미 제공하는 패턴이라 재사용한다.
export function useAdminApplicationLogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    query: keyword,
    draftQuery: draftKeyword,
    setDraftQuery: setDraftKeyword,
    submitQuery: submitKeyword,
  } = useSubmittableUrlQuery('keyword');

  const logLevel = normalizeApplicationLogLevel(searchParams.get('logLevel'));
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  // logLevel·기간 필터가 바뀌면 이전 페이지 번호가 더 이상 유효하지 않을 수 있으므로 항상 1페이지로 되돌린다.
  function applyFilters(next: ApplicationLogFilterValues) {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(next)) {
          if (!value) nextParams.delete(key);
          else nextParams.set(key, value);
        }
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  }

  const setLogLevel = (value: string) =>
    applyFilters({ logLevel: value === ALL_LOG_LEVELS_VALUE ? undefined : value });
  const setDateRange = (range: { startDate?: string; endDate?: string }) => applyFilters(range);

  const setPage = (nextPage: number) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        if (nextPage <= DEFAULT_PAGE) nextParams.delete('page');
        else nextParams.set('page', String(nextPage));
        return nextParams;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.delete('logLevel');
        nextParams.delete('keyword');
        nextParams.delete('startDate');
        nextParams.delete('endDate');
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
    setDraftKeyword('');
  };

  return {
    logLevel,
    setLogLevel,
    keyword,
    draftKeyword,
    setDraftKeyword,
    submitKeyword,
    startDate,
    endDate,
    setDateRange,
    page,
    setPage,
    resetFilters,
  };
}
