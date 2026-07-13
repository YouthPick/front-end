import { useState } from 'react';

import { useAdminPoliciesQuery } from '@/entities/policy';
import { DEFAULT_ADMIN_PAGE_SIZE } from '@/shared/constants';

import { useAdminPolicyFilters } from './useAdminPolicyFilters';

// 관리자 정책 목록 화면 use case: URL 필터 상태 + 서버(mock) 조회 + 상세보기 선택을 묶는다.
export function useAdminPolicy() {
  const {
    category,
    setCategory,
    visibilityStatus,
    setVisibilityStatus,
    startDate,
    endDate,
    setDateRange,
    page,
    setPage,
    resetFilters,
  } = useAdminPolicyFilters();

  const {
    data,
    isLoading,
    isError,
    refetch: reload,
  } = useAdminPoliciesQuery({
    page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    category,
    visibilityStatus,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

  return {
    policies: data?.items ?? [],
    page: data?.page ?? page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    reload,
    category,
    onCategoryChange: setCategory,
    visibilityStatus,
    onVisibilityStatusChange: setVisibilityStatus,
    startDate,
    endDate,
    onDateRangeChange: setDateRange,
    onPageChange: setPage,
    onReset: resetFilters,
    selectedPolicyId,
    onSelectPolicy: setSelectedPolicyId,
    onCloseDetail: () => setSelectedPolicyId(null),
  };
}
