import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

const DEFAULT_PAGE = 1;

interface LoginLogFilterValues {
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// 사용자 id·기간 필터와 페이지를 URL 쿼리스트링(?userId=&startDate=&endDate=&page=)과 동기화한다.
// 사용자 id는 입력 중엔 draft로만 관리하고 제출했을 때만 실제 필터·URL에 반영한다.
export function useAdminLoginLogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = searchParams.get('userId') ?? '';
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  const [draftUserId, setDraftUserId] = useState(userId);

  useEffect(() => {
    setDraftUserId(userId);
  }, [userId]);

  // 필터가 바뀌면 이전 페이지 번호가 더 이상 유효하지 않을 수 있으므로 항상 1페이지로 되돌린다.
  function applyFilters(next: LoginLogFilterValues) {
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

  const submitUserId = () => applyFilters({ userId: draftUserId });
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
        nextParams.delete('userId');
        nextParams.delete('startDate');
        nextParams.delete('endDate');
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
    setDraftUserId('');
  };

  return {
    userId,
    draftUserId,
    setDraftUserId,
    submitUserId,
    startDate,
    endDate,
    setDateRange,
    page,
    setPage,
    resetFilters,
  };
}
