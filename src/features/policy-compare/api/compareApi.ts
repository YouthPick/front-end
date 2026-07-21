import { apiClient } from '@/shared/api';

import type { PolicyComparisonItemDto } from './compareApi.dto';

// 비교는 저장되는 리소스가 아니라 순수 조회라 GET + 반복 쿼리 파라미터로 요청한다.
// axios 기본 직렬화는 배열을 policyIds[]=1 형태로 만들어 Spring의 @RequestParam List<Long>에
// 바인딩되지 않으므로, URLSearchParams로 policyIds=1&policyIds=2 형태를 직접 만든다.
export async function getPolicyComparison(policyIds: number[]): Promise<PolicyComparisonItemDto[]> {
  const params = new URLSearchParams();
  for (const policyId of policyIds) {
    params.append('policyIds', String(policyId));
  }

  const response = await apiClient.get<{ data: PolicyComparisonItemDto[] }>(
    '/v1/policy-comparisons',
    { params },
  );
  return response.data.data;
}
