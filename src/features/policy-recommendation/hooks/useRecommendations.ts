import { useMemo } from 'react';

import { usePoliciesQuery } from '@/entities/policy';
import { usePublicRegionsQuery } from '@/entities/region';
import { mapMyProfileResponse, useMyProfileQuery, useProfileStore } from '@/entities/user';

import { buildRecommendations } from '../api/recommendApi';

// 정책 목록 쿼리를 그대로 공유하고 추천 점수만 파생해, 목록과 추천의 이중 fetch를 피한다.
export function useRecommendations() {
  const localProfile = useProfileStore((state) => state.profile);
  const { data: regions = [], isLoading: isRegionsLoading } = usePublicRegionsQuery();
  const { data: myProfileDto, isLoading: isMyProfileLoading } = useMyProfileQuery();
  const {
    data: policies = [],
    isLoading: isPoliciesLoading,
    isError,
    refetch,
  } = usePoliciesQuery();

  // 클라이언트 스토어(useProfileStore)는 같은 세션에서 방금 온보딩/수정한 값만 신뢰할 수 있다.
  // 새로고침이나 다른 기기 로그인에서는 서버 프로필이 진실 원천이므로, 로딩 중에는 화면 깜빡임을
  // 막기 위해 로컬 값을 잠시 보여주고 서버 응답이 오면 그 값으로 교체한다.
  const isProfileLoading = isMyProfileLoading || isRegionsLoading;
  const profile = useMemo(
    () => (myProfileDto ? mapMyProfileResponse(myProfileDto, regions) : localProfile),
    [myProfileDto, regions, localProfile],
  );

  const recommendations = useMemo(
    () => buildRecommendations(policies, profile),
    [policies, profile],
  );

  return {
    profile,
    recommendations,
    isLoading: isPoliciesLoading || isProfileLoading,
    isError,
    reload: refetch,
  };
}
