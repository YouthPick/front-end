import { useQueries } from '@tanstack/react-query';

import { fetchPolicy, mapPolicyDetailToPolicy, type Policy, policyKeys } from '@/entities/policy';
import { MAX_COMPARE_COUNT } from '@/shared/constants';
import { useToast } from '@/shared/ui';

import { useCompareStore } from '../store/compareStore';

// 비교함에는 policyId만 저장하고, Policy 객체는 id별로 상세 조회해서 채운다.
// (주의: '전체 정책 목록'과 join하면 안 된다 — 그 목록은 최신 N건만 담고 있어서, 추천/필터
// 검색처럼 그 범위 밖의 정책을 담으면 화면에서 조용히 사라지는 버그가 있었다.)
export function useCompare() {
  const policyIds = useCompareStore((state) => state.policyIds);
  const addPolicyId = useCompareStore((state) => state.addPolicyId);
  const removePolicyId = useCompareStore((state) => state.removePolicyId);
  const clearPolicyIds = useCompareStore((state) => state.clearPolicyIds);
  const { showToast } = useToast();

  const policyDetailQueries = useQueries({
    queries: policyIds.map((id) => ({
      queryKey: policyKeys.detail(id),
      queryFn: async () => mapPolicyDetailToPolicy(await fetchPolicy(id)),
    })),
  });

  const comparingPolicies = policyDetailQueries
    .map((query) => query.data)
    .filter((policy): policy is Policy => policy !== undefined);

  const isComparing = (policyId: string) => policyIds.includes(policyId);

  const toggleCompare = (policy: Policy) => {
    if (policyIds.includes(policy.id)) {
      removePolicyId(policy.id);
      return;
    }
    if (policyIds.length >= MAX_COMPARE_COUNT) {
      showToast(`비교 분석은 한 번에 최대 ${MAX_COMPARE_COUNT}개의 정책만 가능합니다.`, 'warning');
      return;
    }
    addPolicyId(policy.id);
    showToast(`${policy.title}이 비교 슬롯에 등록되었습니다.`, 'success');
  };

  return {
    policyIds,
    comparingPolicies,
    isComparing,
    toggleCompare,
    removeCompare: (policy: Policy) => removePolicyId(policy.id),
    clearCompare: clearPolicyIds,
  };
}
