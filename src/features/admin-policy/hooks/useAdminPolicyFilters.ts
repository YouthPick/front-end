import { useSearchParams } from 'react-router';

import type { AdminPolicyVisibilityStatus } from '@/entities/policy';
import { POLICY_CATEGORIES } from '@/entities/policy';

const DEFAULT_PAGE = 1;
export const ALL_FILTER_VALUE = 'ALL';

const VISIBILITY_STATUSES: readonly AdminPolicyVisibilityStatus[] = ['VISIBLE', 'HIDDEN'];

// URL에서 온 값은 신뢰할 수 없으므로 알 수 없는 값은 전체 조회(undefined)로 되돌린다.
function normalizeCategory(value: string | null): string | undefined {
  return POLICY_CATEGORIES.find((category) => category === value);
}

function normalizeVisibilityStatus(value: string | null): AdminPolicyVisibilityStatus | undefined {
  return VISIBILITY_STATUSES.find((status) => status === value);
}

interface AdminPolicyFilterValues {
  category?: string;
  visibilityStatus?: string;
  startDate?: string;
  endDate?: string;
}

// 카테고리·공개상태·기간 필터와 페이지를 URL 쿼리스트링과 동기화한다.
export function useAdminPolicyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = normalizeCategory(searchParams.get('category'));
  const visibilityStatus = normalizeVisibilityStatus(searchParams.get('visibilityStatus'));
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  // 필터가 바뀌면 이전 페이지 번호가 더 이상 유효하지 않을 수 있으므로 항상 1페이지로 되돌린다.
  function applyFilters(next: AdminPolicyFilterValues) {
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

  const setCategory = (value: string) => applyFilters({ category: value });
  const setVisibilityStatus = (value: string) => applyFilters({ visibilityStatus: value });
  const setDateRange = (range: { startDate?: string; endDate?: string }) => applyFilters(range);

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
        nextParams.delete('category');
        nextParams.delete('visibilityStatus');
        nextParams.delete('startDate');
        nextParams.delete('endDate');
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  };

  return {
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
  };
}
