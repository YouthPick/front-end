import { apiClient } from '@/shared/api';

import type { PolicyComparisonResponseDto } from './compareApi.dto';

export async function createPolicyComparison(
  policyIds: number[],
): Promise<PolicyComparisonResponseDto> {
  const response = await apiClient.post<{ data: PolicyComparisonResponseDto }>(
    '/v1/policy-comparisons',
    { policyIds },
  );
  return response.data.data;
}
