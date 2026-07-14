import { useSearchParams } from 'react-router';
import type { AdminUserAccountStatus, UserRole } from '@/entities/user';

const DEFAULT_PAGE = 1;
export const ALL_FILTER_VALUE = 'ALL';

const USER_ROLES: readonly UserRole[] = ['member', 'admin'];
const ACCOUNT_STATUSES: readonly AdminUserAccountStatus[] = ['ACTIVE', 'DELETED'];

// URL에서 온 값은 신뢰할 수 없으므로 알 수 없는 값은 전체 조회(undefined)로 되돌린다.
function normalizeRole(value: string | null): UserRole | undefined {
  return USER_ROLES.find((role) => role === value);
}

function normalizeAccountStatus(value: string | null): AdminUserAccountStatus | undefined {
  return ACCOUNT_STATUSES.find((status) => status === value);
}

interface AdminUserFilterValues {
  role?: string;
  accountStatus?: string;
  provider?: string;
}

// role·상태·가입경로 필터와 페이지를 URL 쿼리스트링과 동기화한다.
export function useAdminUserFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const role = normalizeRole(searchParams.get('role'));
  const accountStatus = normalizeAccountStatus(searchParams.get('accountStatus'));
  const provider = searchParams.get('provider') ?? undefined;
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  // 필터가 바뀌면 이전 페이지 번호가 더 이상 유효하지 않을 수 있으므로 항상 1페이지로 되돌린다.
  function applyFilters(next: AdminUserFilterValues) {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(next)) {
          if (!value || value === ALL_FILTER_VALUE) nextParams.delete(key);
          else nextParams.set(key, value);
        }
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  }

  const setRole = (value: string) => applyFilters({ role: value });
  const setAccountStatus = (value: string) => applyFilters({ accountStatus: value });
  const setProvider = (value: string) => applyFilters({ provider: value });

  const setPage = (nextPage: number) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        if (nextPage <= DEFAULT_PAGE) nextParams.delete('page');
        else nextParams.set('page', String(nextPage));
        return nextParams;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.delete('role');
        nextParams.delete('accountStatus');
        nextParams.delete('provider');
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  };

  return {
    role,
    setRole,
    accountStatus,
    setAccountStatus,
    provider,
    setProvider,
    page,
    setPage,
    resetFilters,
  };
}
