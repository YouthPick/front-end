import type { AdminPolicyVisibilityStatus } from '@/entities/policy';
import { POLICY_CATEGORIES } from '@/entities/policy';
import { useUrlFilters } from '@/shared/hooks';

export const ALL_FILTER_VALUE = 'ALL';

const VISIBILITY_STATUSES: readonly AdminPolicyVisibilityStatus[] = ['VISIBLE', 'HIDDEN'];

function normalizeCategory(value: string | null): string | undefined {
  return POLICY_CATEGORIES.find((category) => category === value);
}

function normalizeVisibilityStatus(value: string | null): AdminPolicyVisibilityStatus | undefined {
  return VISIBILITY_STATUSES.find((status) => status === value);
}

function normalizeDate(value: string | null): string {
  return value ?? '';
}

type AdminPolicyFilterValues = {
  category: string | undefined;
  visibilityStatus: AdminPolicyVisibilityStatus | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
};

// 카테고리·공개상태·기간 필터와 페이지를 URL 쿼리스트링과 동기화한다.
export function useAdminPolicyFilters() {
  const { filters, page, setFilter, applyFilters, setPage, resetFilters } =
    useUrlFilters<AdminPolicyFilterValues>({
      keys: ['category', 'visibilityStatus', 'startDate', 'endDate'],
      normalizers: {
        category: normalizeCategory,
        visibilityStatus: normalizeVisibilityStatus,
        startDate: normalizeDate,
        endDate: normalizeDate,
      },
    });

  const setDateRange = (range: { startDate?: string; endDate?: string }) => {
    applyFilters(range as Partial<AdminPolicyFilterValues>);
  };

  return {
    category: filters.category,
    setCategory: (val: string) => setFilter('category', val),
    visibilityStatus: filters.visibilityStatus,
    setVisibilityStatus: (val: string) => setFilter('visibilityStatus', val),
    startDate: filters.startDate ?? '',
    endDate: filters.endDate ?? '',
    setDateRange,
    page,
    setPage,
    resetFilters,
  };
}
