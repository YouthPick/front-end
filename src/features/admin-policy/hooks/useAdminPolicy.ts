import { useState } from 'react';

import { type AdminPolicy, useAdminPoliciesQuery } from '@/entities/policy';
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

  // 선택된 정책 객체 자체를 들고 있는다. 필터링된 목록에서 매번 다시 찾으면(.find),
  // 노출 상태 토글/저장/삭제 후 그 정책이 현재 필터(카테고리/공개상태) 조건에서 빠지는 순간
  // 모달이 안내 없이 사라진다. 최신 값은 mutation 성공 시 이 setter로 직접 갱신한다.
  const [selectedPolicy, setSelectedPolicy] = useState<AdminPolicy | null>(null);

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
    selectedPolicy,
    onSelectPolicy: setSelectedPolicy,
    onCloseDetail: () => setSelectedPolicy(null),
  };
}
