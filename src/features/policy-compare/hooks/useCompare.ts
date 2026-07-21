import { type Policy, usePoliciesQuery } from '@/entities/policy';
import { MAX_COMPARE_COUNT } from '@/shared/constants';
import { useToast } from '@/shared/ui';

import { useCompareStore } from '../store/compareStore';

// 비교함에는 policyId만 저장하고, Policy 객체는 정책 query 결과에서 join한다.
export function useCompare() {
  const policyIds = useCompareStore((state) => state.policyIds);
  const addPolicyId = useCompareStore((state) => state.addPolicyId);
  const removePolicyId = useCompareStore((state) => state.removePolicyId);
  const clearPolicyIds = useCompareStore((state) => state.clearPolicyIds);
  const { showToast } = useToast();

  const { data: allPolicies = [] } = usePoliciesQuery();

  const comparingPolicies = policyIds
    .map((id) => allPolicies.find((policy) => policy.id === id))
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
