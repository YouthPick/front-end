import { useQuery } from '@tanstack/react-query';

import { getPolicyComparison } from '../api/compareApi';

export const comparisonKeys = {
  all: ['policy-comparisons'] as const,
  // 서버가 요청 순서를 그대로 보존해 응답하므로(비교표 열 순서 = 사용자가 고른 순서) 캐시 키도
  // 정렬하지 않고 요청 순서를 그대로 쓴다. 정렬하면 [2,1]과 [1,2]가 같은 키를 공유해
  // 실제 응답 순서와 어긋난 캐시가 재사용된다.
  detail: (policyIds: string[]) => [...comparisonKeys.all, policyIds] as const,
};

interface UsePolicyComparisonQueryOptions {
  enabled?: boolean;
}

// policyId가 숫자로 변환되지 않으면(예: 아직 실제 정책 목록과 연동되지 않은 화면) 호출하지 않는다.
export function usePolicyComparisonQuery(
  policyIds: string[],
  { enabled = true }: UsePolicyComparisonQueryOptions = {},
) {
  const numericIds = policyIds.map(Number);
  const isValidRequest = numericIds.length >= 2 && numericIds.every(Number.isInteger);

  const query = useQuery({
    queryKey: comparisonKeys.detail(policyIds),
    queryFn: () => getPolicyComparison(numericIds),
    enabled: enabled && isValidRequest,
  });

  return { ...query, isValidRequest };
}
