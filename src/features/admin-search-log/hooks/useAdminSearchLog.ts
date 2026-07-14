import { useSearchLogsQuery } from '@/entities/search-log';
import { DEFAULT_ADMIN_PAGE_SIZE } from '@/shared/constants';

import { useAdminSearchLogFilters } from './useAdminSearchLogFilters';

// 관리자 검색 로그 화면 use case: URL 필터 상태 + 서버(mock) 조회를 묶는다.
export function useAdminSearchLog() {
  const {
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
  } = useAdminSearchLogFilters();

  const {
    data,
    isLoading,
    isError,
    refetch: reload,
  } = useSearchLogsQuery({
    page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    keyword: keyword || undefined,
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
    keyword: draftKeyword,
    onKeywordChange: setDraftKeyword,
    onKeywordSubmit: submitKeyword,
    startDate,
    endDate,
    onDateRangeChange: setDateRange,
    onPageChange: setPage,
    onReset: resetFilters,
  };
}
