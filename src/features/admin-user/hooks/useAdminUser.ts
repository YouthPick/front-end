import { useState } from 'react';

import { type AdminUser, useAdminUsersQuery } from '@/entities/user';
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

  // 선택된 사용자 객체 자체를 들고 있는다. 필터링된 목록에서 매번 다시 찾으면(.find),
  // role 변경/탈퇴 처리 후 그 사용자가 현재 필터 조건에서 빠지는 순간 모달이 안내 없이
  // 사라진다. 최신 값은 mutation 성공 시 이 setter로 직접 갱신한다.
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

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
    selectedUser,
    onSelectUser: setSelectedUser,
    onCloseDetail: () => setSelectedUser(null),
  };
}
