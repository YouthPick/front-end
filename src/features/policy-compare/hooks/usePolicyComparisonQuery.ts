import { useQuery } from '@tanstack/react-query';

import { createPolicyComparison } from '../api/compareApi';

export const comparisonKeys = {
  all: ['policy-comparisons'] as const,
  detail: (policyIds: string[]) =>
    [...comparisonKeys.all, [...policyIds].sort((a, b) => Number(a) - Number(b))] as const,
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
    queryFn: () => createPolicyComparison(numericIds),
    enabled: enabled && isValidRequest,
  });

  return { ...query, isValidRequest };
}
