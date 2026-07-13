import { useState } from 'react';

import { useAdminPolicyApplicationsQuery } from '@/entities/policy-application';
import { DEFAULT_ADMIN_PAGE_SIZE } from '@/shared/constants';

import { useAdminApplicationFilters } from './useAdminApplicationFilters';

// 관리자 정책 신청 목록 화면 use case: URL 필터 상태 + 서버(mock) 조회 + 상세보기 선택을 묶는다.
export function useAdminApplication() {
  const {
    userId,
    draftUserId,
    setDraftUserId,
    submitUserId,
    policyName,
    draftPolicyName,
    setDraftPolicyName,
    submitPolicyName,
    status,
    setStatus,
    deadlineStart,
    deadlineEnd,
    setDeadlineRange,
    page,
    setPage,
    resetFilters,
  } = useAdminApplicationFilters();

  const {
    data,
    isLoading,
    isError,
    refetch: reload,
  } = useAdminPolicyApplicationsQuery({
    page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    userId: userId || undefined,
    policyName: policyName || undefined,
    status,
    deadlineStart: deadlineStart || undefined,
    deadlineEnd: deadlineEnd || undefined,
  });

  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  return {
    applications: data?.items ?? [],
    page: data?.page ?? page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    reload,
    userId: draftUserId,
    onUserIdChange: setDraftUserId,
    onUserIdSubmit: submitUserId,
    policyName: draftPolicyName,
    onPolicyNameChange: setDraftPolicyName,
    onPolicyNameSubmit: submitPolicyName,
    status,
    onStatusChange: setStatus,
    deadlineStart,
    deadlineEnd,
    onDeadlineRangeChange: setDeadlineRange,
    onPageChange: setPage,
    onReset: resetFilters,
    selectedApplicationId,
    onSelectApplication: setSelectedApplicationId,
    onCloseDetail: () => setSelectedApplicationId(null),
  };
}
