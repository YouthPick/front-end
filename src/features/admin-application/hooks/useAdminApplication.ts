import { useState } from 'react';

import {
  type AdminPolicyApplication,
  useAdminPolicyApplicationsQuery,
} from '@/entities/policy-application';
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

  // 선택된 신청 객체 자체를 들고 있는다. 필터링된 목록에서 매번 다시 찾으면(.find),
  // 상태 변경 성공 후 그 신청이 현재 상태 필터에서 빠지는 순간 모달이 안내 없이 사라진다.
  // 최신 값은 mutation 성공 시 이 setter로 직접 갱신한다.
  const [selectedApplication, setSelectedApplication] = useState<AdminPolicyApplication | null>(
    null,
  );

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
    selectedApplication,
    onSelectApplication: setSelectedApplication,
    onCloseDetail: () => setSelectedApplication(null),
  };
}
