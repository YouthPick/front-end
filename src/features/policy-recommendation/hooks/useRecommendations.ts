import { useMemo } from 'react';

import { usePoliciesQuery } from '@/entities/policy';
import { useProfileStore } from '@/entities/user';

import { buildRecommendations } from '../api/recommendApi';

// 정책 목록 쿼리를 그대로 공유하고 추천 점수만 파생해, 목록과 추천의 이중 fetch를 피한다.
export function useRecommendations() {
  const profile = useProfileStore((state) => state.profile);
  const { data: policies = [], isLoading, isError, refetch } = usePoliciesQuery();

  const recommendations = useMemo(
    () => buildRecommendations(policies, profile),
    [policies, profile],
  );

  return { profile, recommendations, isLoading, isError, reload: refetch };
}
