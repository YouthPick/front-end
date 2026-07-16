import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  fetchPolicies,
  fetchPolicy,
  fetchPolicyCardPage,
  fetchRecentlyViewedPolicies,
  type PolicySearchParams,
  searchPolicies,
} from '../api/policyApi';
import type { RecentlyViewedPolicy } from './policy.types';
import {
  mapPolicyCardsToPolicies,
  mapPolicyDetailToPolicy,
  mapRecentlyViewedDtoToModel,
} from './policyMapper';

export const policyKeys = {
  all: ['policies'] as const,
  list: (params: PolicySearchParams) => ['policies', 'list', params] as const,
  page: (page: number, size: number) => ['policies', 'page', page, size] as const,
  detail: (policyId: string) => ['policies', 'detail', policyId] as const,
  recentlyViewed: ['policies', 'recently-viewed'] as const,
};

export function usePoliciesQuery() {
  return useQuery({
    queryKey: policyKeys.all,
    queryFn: async () => mapPolicyCardsToPolicies(await fetchPolicies()),
  });
}

// 홈 그리드 서버 페이지네이션. page는 1-base(UI 기준)로 받아 서버 0-base로 변환한다.
export function usePolicyCardPageQuery(page: number, size: number) {
  return useQuery({
    queryKey: policyKeys.page(page, size),
    queryFn: async () => {
      const envelope = await fetchPolicyCardPage(page - 1, size);
      return {
        policies: mapPolicyCardsToPolicies(envelope.data),
        totalPages: envelope.meta.totalPages,
        totalCount: envelope.meta.totalCount,
      };
    },
    // 페이지 전환 시 이전 페이지를 유지해 스켈레톤 깜빡임을 막는다.
    placeholderData: keepPreviousData,
  });
}

export function usePolicySearchQuery(params: PolicySearchParams) {
  return useQuery({
    queryKey: policyKeys.list(params),
    queryFn: async () => mapPolicyCardsToPolicies(await searchPolicies(params)),
    // 파라미터 변경 시 이전 결과를 유지해 스켈레톤 flash와 '총 0건' 깜빡임을 막는다.
    placeholderData: keepPreviousData,
  });
}

// 정책 상세는 목록 카드에 없는 필드(혜택·신청정보 등)를 담고 있어 클릭 시 별도로 조회한다.
export function usePolicyDetailQuery(policyId: string | null) {
  return useQuery({
    queryKey: policyKeys.detail(policyId ?? ''),
    queryFn: async () => mapPolicyDetailToPolicy(await fetchPolicy(policyId as string)),
    enabled: policyId != null,
  });
}

export function useRecentlyViewedPoliciesQuery() {
  return useQuery({
    queryKey: policyKeys.recentlyViewed,
    queryFn: async () => {
      const dtos = await fetchRecentlyViewedPolicies();
      return dtos
        .map(mapRecentlyViewedDtoToModel)
        .filter((policy): policy is RecentlyViewedPolicy => policy !== null);
    },
  });
}
