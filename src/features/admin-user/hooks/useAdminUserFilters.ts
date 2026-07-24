import type { AdminUserAccountStatus, UserRole } from '@/entities/user';
import { useUrlFilters } from '@/shared/hooks';

export const ALL_FILTER_VALUE = 'ALL';

const USER_ROLES: readonly UserRole[] = ['member', 'admin'];
const ACCOUNT_STATUSES: readonly AdminUserAccountStatus[] = ['ACTIVE', 'DELETED'];

function normalizeRole(value: string | null): UserRole | undefined {
  return USER_ROLES.find((role) => role === value);
}

function normalizeAccountStatus(value: string | null): AdminUserAccountStatus | undefined {
  return ACCOUNT_STATUSES.find((status) => status === value);
}

type AdminUserFilterValues = {
  role: UserRole | undefined;
  accountStatus: AdminUserAccountStatus | undefined;
  provider: string | undefined;
};

export function useAdminUserFilters() {
  const { filters, page, setFilter, setPage, resetFilters } = useUrlFilters<AdminUserFilterValues>({
    keys: ['role', 'accountStatus', 'provider'],
    normalizers: {
      role: normalizeRole,
      accountStatus: normalizeAccountStatus,
      provider: (val) => val ?? undefined,
    },
  });

  return {
    role: filters.role,
    setRole: (val: string) => setFilter('role', val),
    accountStatus: filters.accountStatus,
    setAccountStatus: (val: string) => setFilter('accountStatus', val),
    provider: filters.provider,
    setProvider: (val: string) => setFilter('provider', val),
    page,
    setPage,
    resetFilters,
  };
}
