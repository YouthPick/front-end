import { useState } from 'react';

import { useAdminUsersQuery } from '@/entities/user';
import { DEFAULT_ADMIN_PAGE_SIZE } from '@/shared/constants';

import { useAdminUserFilters } from './useAdminUserFilters';

// 관리자 사용자 목록 화면 use case: URL 필터 상태 + 서버(mock) 조회 + 상세보기 선택을 묶는다.
export function useAdminUser() {
  const {
    role,
    setRole,
    accountStatus,
    setAccountStatus,
    provider,
    setProvider,
    page,
    setPage,
    resetFilters,
  } = useAdminUserFilters();

  const {
    data,
    isLoading,
    isError,
    refetch: reload,
  } = useAdminUsersQuery({
    page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    role,
    accountStatus,
    provider,
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return {
    users: data?.items ?? [],
    page: data?.page ?? page,
    pageSize: DEFAULT_ADMIN_PAGE_SIZE,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    reload,
    role,
    onRoleChange: setRole,
    accountStatus,
    onAccountStatusChange: setAccountStatus,
    provider,
    onProviderChange: setProvider,
    onPageChange: setPage,
    onReset: resetFilters,
    selectedUserId,
    onSelectUser: setSelectedUserId,
    onCloseDetail: () => setSelectedUserId(null),
  };
}
