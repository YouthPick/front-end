import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { ApiPageEnvelope } from '@/shared/api';

import type { PolicyCardDto } from '../api/policy.dto';
import {
  fetchPolicies,
  fetchPolicy,
  fetchPolicyCardPage,
  fetchPolicySearchPage,
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
  searchPage: (params: PolicySearchParams, page: number, size: number) =>
    ['policies', 'search-page', params, page, size] as const,
  detail: (policyId: string) => ['policies', 'detail', policyId] as const,
  recentlyViewed: ['policies', 'recently-viewed'] as const,
};

export function usePoliciesQuery() {
  return useQuery({
    queryKey: policyKeys.all,
    queryFn: async () => mapPolicyCardsToPolicies(await fetchPolicies()),
  });
}

// 페이지 envelope → 뷰모델. toPageResult(shared)는 totalPages가 없어 목록 훅 공용으로 여기 둔다.
//
// meta.page(서버가 해석한 페이지)를 요청값과 대조한다. 이 버그(#126)를 스스로 드러냈을 유일한
// 신호인데 그동안 매퍼가 버리고 있었다 — UI 1·2페이지가 둘 다 meta.page=1을 받고 있었는데도
// 사용자 제보 전까지 아무도 몰랐다. base 변경이나 백엔드 프로필 차이로 같은 불일치가 다시
// 생기면 조용히 지나가지 않도록 개발 모드에서 경고한다.
function mapPolicyPageEnvelope(envelope: ApiPageEnvelope<PolicyCardDto>, requestedPage: number) {
  if (import.meta.env.DEV && envelope.meta.page !== requestedPage) {
    console.warn(
      `[pagination] 요청 page=${requestedPage} 인데 서버는 page=${envelope.meta.page}로 응답했습니다. ` +
        '프론트/백엔드의 page base(0-base vs 1-base)가 어긋났을 수 있습니다.',
    );
  }
  return {
    policies: mapPolicyCardsToPolicies(envelope.data),
    totalPages: envelope.meta.totalPages,
    totalCount: envelope.meta.totalCount,
  };
}

// 검색 화면 서버 페이지네이션 — 필터가 바뀌면 key가 바뀌어 1페이지부터 다시 조회된다. page는 1-base.
export function usePolicySearchPageQuery(params: PolicySearchParams, page: number, size: number) {
  return useQuery({
    queryKey: policyKeys.searchPage(params, page, size),
    queryFn: async () =>
      mapPolicyPageEnvelope(await fetchPolicySearchPage(params, page, size), page),
    placeholderData: keepPreviousData,
  });
}

// 홈 그리드 서버 페이지네이션. 서버가 1-base(one-indexed-parameters)라 UI 페이지 번호를 그대로 넘긴다.
export function usePolicyCardPageQuery(page: number, size: number) {
  return useQuery({
    queryKey: policyKeys.page(page, size),
    queryFn: async () => mapPolicyPageEnvelope(await fetchPolicyCardPage(page, size), page),
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
