import type { AdminPolicyApplicationStatus } from '@/entities/policy-application';
import { useSubmittableUrlQuery, useUrlFilters } from '@/shared/hooks';

export const ALL_STATUS_VALUE = 'ALL';

const APPLICATION_STATUSES: readonly AdminPolicyApplicationStatus[] = [
  'INTERESTED',
  'PREPARING',
  'SUBMITTED',
  'CLOSED',
];

function normalizeStatus(value: string | null): AdminPolicyApplicationStatus | undefined {
  return APPLICATION_STATUSES.find((status) => status === value);
}

function normalizeDate(value: string | null): string {
  return value ?? '';
}

type AdminApplicationFilterValues = {
  status: AdminPolicyApplicationStatus | undefined;
  deadlineStart: string | undefined;
  deadlineEnd: string | undefined;
};

// 사용자 id·정책명·상태·마감일 필터와 페이지를 URL 쿼리스트링과 동기화한다.
// 사용자 id·정책명의 draft/제출 동기화는 shared/hooks/useSubmittableUrlQuery를 재사용한다.
export function useAdminApplicationFilters() {
  const {
    query: userId,
    draftQuery: draftUserId,
    setDraftQuery: setDraftUserId,
    submitQuery: submitUserId,
  } = useSubmittableUrlQuery('userId');
  const {
    query: policyName,
    draftQuery: draftPolicyName,
    setDraftQuery: setDraftPolicyName,
    submitQuery: submitPolicyName,
  } = useSubmittableUrlQuery('policyName');

  const { filters, page, setFilter, applyFilters, setPage, resetFilters } =
    useUrlFilters<AdminApplicationFilterValues>({
      keys: ['status', 'deadlineStart', 'deadlineEnd'],
      normalizers: {
        status: normalizeStatus,
        deadlineStart: normalizeDate,
        deadlineEnd: normalizeDate,
      },
    });

  const setDeadlineRange = (range: { deadlineStart?: string; deadlineEnd?: string }) => {
    applyFilters(range as Partial<AdminApplicationFilterValues>);
  };

  const handleResetFilters = () => {
    resetFilters();
    setDraftUserId('');
    setDraftPolicyName('');
  };

  return {
    userId,
    draftUserId,
    setDraftUserId,
    submitUserId,
    policyName,
    draftPolicyName,
    setDraftPolicyName,
    submitPolicyName,
    status: filters.status,
    setStatus: (val: string) => setFilter('status', val),
    deadlineStart: filters.deadlineStart ?? '',
    deadlineEnd: filters.deadlineEnd ?? '',
    setDeadlineRange,
    page,
    setPage,
    resetFilters: handleResetFilters,
  };
}
