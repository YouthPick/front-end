import { useSearchParams } from 'react-router';

import type { AdminPolicyApplicationStatus } from '@/entities/policy-application';
import { useSubmittableUrlQuery } from '@/shared/hooks';

const DEFAULT_PAGE = 1;
export const ALL_STATUS_VALUE = 'ALL';

const APPLICATION_STATUSES: readonly AdminPolicyApplicationStatus[] = [
  'INTERESTED',
  'PREPARING',
  'SUBMITTED',
  'CLOSED',
];

// URL에서 온 값은 신뢰할 수 없으므로 알 수 없는 값은 전체 조회(undefined)로 되돌린다.
function normalizeStatus(value: string | null): AdminPolicyApplicationStatus | undefined {
  return APPLICATION_STATUSES.find((status) => status === value);
}

interface AdminApplicationFilterValues {
  status?: string;
  deadlineStart?: string;
  deadlineEnd?: string;
}

// 사용자 id·정책명·상태·마감일 필터와 페이지를 URL 쿼리스트링과 동기화한다.
// 사용자 id·정책명의 draft/제출 동기화는 shared/hooks/useSubmittableUrlQuery를 재사용한다.
export function useAdminApplicationFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const status = normalizeStatus(searchParams.get('status'));
  const deadlineStart = searchParams.get('deadlineStart') ?? '';
  const deadlineEnd = searchParams.get('deadlineEnd') ?? '';
  const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

  // status·마감일 필터가 바뀌면 이전 페이지 번호가 더 이상 유효하지 않을 수 있으므로 항상 1페이지로 되돌린다.
  function applyFilters(next: AdminApplicationFilterValues) {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(next)) {
          if (!value || value === ALL_STATUS_VALUE) nextParams.delete(key);
          else nextParams.set(key, value);
        }
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
  }

  const setStatus = (value: string) => applyFilters({ status: value });
  const setDeadlineRange = (range: { deadlineStart?: string; deadlineEnd?: string }) =>
    applyFilters(range);

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
        nextParams.delete('userId');
        nextParams.delete('policyName');
        nextParams.delete('status');
        nextParams.delete('deadlineStart');
        nextParams.delete('deadlineEnd');
        nextParams.delete('page');
        return nextParams;
      },
      { replace: true },
    );
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
    status,
    setStatus,
    deadlineStart,
    deadlineEnd,
    setDeadlineRange,
    page,
    setPage,
    resetFilters,
  };
}
