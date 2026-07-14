import { useSearchParams } from 'react-router';

import { useSubmittableUrlQuery } from '@/shared/hooks';

const DEFAULT_PAGE = 1;

// 키워드·기간 필터와 페이지를 URL 쿼리스트링과 동기화한다.
// 키워드의 draft/제출 동기화는 shared/hooks/useSubmittableUrlQuery를 재사용한다.
export function useAdminSearchLogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    query: keyword,
    draftQuery: draftKeyword,
    setDraftQuery: setDraftKeyword,
  } = useSubmittableUrlQuery('keyword');

  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  // useSubmittableUrlQuery의 submitQuery는 keyword만 갱신하고 page는 그대로 두는데,
  // 다른 필터(기간)는 변경 시 항상 1페이지로 되돌리므로 동작이 어긋난다. keyword 제출과
  // page 초기화를 한 번의 setSearchParams로 묶어 깊은 페이지에서 검색해도 1페이지로 돌아가게 한다.
  const submitKeyword = () => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        if (!draftKeyword) nextParams.delete('keyword');
        else nextParams.set('keyword', draftKeyword);
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  };

  // 기간 필터가 바뀌면 이전 페이지 번호가 더 이상 유효하지 않을 수 있으므로 항상 1페이지로 되돌린다.
  const setDateRange = (range: { startDate?: string; endDate?: string }) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(range)) {
          if (!value) nextParams.delete(key);
          else nextParams.set(key, value);
        }
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  };

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
