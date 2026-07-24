import { useBatchJobLogsQuery } from '@/entities/batch-job-log';
import { DEFAULT_ADMIN_PAGE_SIZE } from '@/shared/constants';

import { useAdminBatchLogFilters } from './useAdminBatchLogFilters';

// 관리자 배치 작업 로그 화면 use case: URL 필터 상태 + 서버(mock) 조회를 묶는다.
export function useAdminBatchLog() {
  const { status, setStatus, startDate, endDate, setDateRange, page, setPage, resetFilters } =
    useAdminBatchLogFilters();

  const {
    data,
    isLoading,
    isError,
    refetch: reload,
  } = useBatchJobLogsQuery({
    page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    status,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  return {
    logs: data?.items ?? [],
    page: data?.page ?? page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    reload,
    status,
    onStatusChange: setStatus,
    startDate,
    endDate,
    onDateRangeChange: setDateRange,
    onPageChange: setPage,
    onReset: resetFilters,
  };
}
