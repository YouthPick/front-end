import { useState } from 'react';

import { type ApplicationLog, useApplicationLogsQuery } from '@/entities/application-log';
import { DEFAULT_ADMIN_PAGE_SIZE } from '@/shared/constants';

import { useAdminApplicationLogFilters } from './useAdminApplicationLogFilters';

// 관리자 애플리케이션 로그 화면 use case: URL 필터 상태 + 서버(mock) 조회 + 상세보기 선택을 묶는다.
export function useAdminApplicationLog() {
  const {
    logLevel,
    setLogLevel,
    keyword,
    setDraftKeyword,
    submitKeyword,
    startDate,
    endDate,
    setDateRange,
    page,
    setPage,
    resetFilters,
  } = useAdminApplicationLogFilters();

  const {
    data,
    isLoading,
    isError,
    refetch: reload,
  } = useApplicationLogsQuery({
    page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    logLevel,
    keyword: keyword || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [selectedLog, setSelectedLog] = useState<ApplicationLog | null>(null);

  return {
    logs: data?.items ?? [],
    page: data?.page ?? page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    reload,
    logLevel,
    onLogLevelChange: setLogLevel,
    keyword,
    onKeywordChange: setDraftKeyword,
    onKeywordSubmit: submitKeyword,
    startDate,
    endDate,
    onDateRangeChange: setDateRange,
    onPageChange: setPage,
    onReset: resetFilters,
    selectedLog,
    onSelectLog: setSelectedLog,
    onCloseDetail: () => setSelectedLog(null),
  };
}
