import { useLoginHistoriesQuery } from '@/entities/login-history';
import { DEFAULT_ADMIN_PAGE_SIZE } from '@/shared/constants';

import { useAdminLoginLogFilters } from './useAdminLoginLogFilters';

// 관리자 로그인 로그 화면 use case: URL 필터 상태 + 서버(mock) 조회를 묶는다.
export function useAdminLoginLog() {
  const {
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
  } = useAdminLoginLogFilters();

  const {
    data,
    isLoading,
    isError,
    refetch: reload,
  } = useLoginHistoriesQuery({
    page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    userId: userId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  return {
    histories: data?.items ?? [],
    page: data?.page ?? page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    reload,
    userId: draftUserId,
    onUserIdChange: setDraftUserId,
    onUserIdSubmit: submitUserId,
    startDate,
    endDate,
    onDateRangeChange: setDateRange,
    onPageChange: setPage,
    onReset: resetFilters,
  };
}
