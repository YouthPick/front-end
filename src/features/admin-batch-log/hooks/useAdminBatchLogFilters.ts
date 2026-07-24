import { useSearchParams } from 'react-router';

import type { BatchJobLogStatus } from '@/entities/batch-job-log';

const DEFAULT_PAGE = 1;
export const ALL_STATUS_VALUE = 'ALL';

const BATCH_JOB_LOG_STATUSES: readonly BatchJobLogStatus[] = ['SUCCESS', 'PARTIAL', 'FAILED'];

// URL에서 온 값은 신뢰할 수 없으므로 알 수 없는 값은 전체 조회(undefined)로 되돌린다.
function normalizeStatus(value: string | null): BatchJobLogStatus | undefined {
  return BATCH_JOB_LOG_STATUSES.find((status) => status === value);
}

interface AdminBatchLogFilterValues {
  status?: string;
  startDate?: string;
  endDate?: string;
}

// 상태·기간 필터와 페이지를 URL 쿼리스트링과 동기화한다.
export function useAdminBatchLogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = normalizeStatus(searchParams.get('status'));
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  // 필터가 바뀌면 이전 페이지 번호가 더 이상 유효하지 않을 수 있으므로 항상 1페이지로 되돌린다.
  function applyFilters(next: AdminBatchLogFilterValues) {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(next)) {
          if (!value || value === ALL_STATUS_VALUE) nextParams.delete(key);
          else nextParams.set(key, value);
        }
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  }

  const setStatus = (value: string) => applyFilters({ status: value });
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
        nextParams.delete('status');
        nextParams.delete('startDate');
        nextParams.delete('endDate');
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  };

  return {
    status,
    setStatus,
    startDate,
    endDate,
    setDateRange,
    page,
    setPage,
    resetFilters,
  };
}
