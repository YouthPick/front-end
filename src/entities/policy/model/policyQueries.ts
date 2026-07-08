import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  fetchPolicies,
  fetchRecentlyViewedPolicies,
  searchPolicies,
  type PolicySearchParams,
} from "../api/policyApi";
import { mapPolicyDtosToPolicies, mapRecentlyViewedDtoToModel } from "./policyMapper";
import type { RecentlyViewedPolicy } from "./policy.types";

export const policyKeys = {
  all: ["policies"] as const,
  list: (params: PolicySearchParams) => ["policies", "list", params] as const,
  recentlyViewed: ["policies", "recently-viewed"] as const,
};

export function usePoliciesQuery() {
  return useQuery({
    queryKey: policyKeys.all,
    queryFn: async () => mapPolicyDtosToPolicies(await fetchPolicies()),
  });
}

export function usePolicySearchQuery(params: PolicySearchParams) {
  return useQuery({
    queryKey: policyKeys.list(params),
    queryFn: async () => mapPolicyDtosToPolicies(await searchPolicies(params)),
    // 파라미터 변경 시 이전 결과를 유지해 스켈레톤 flash와 '총 0건' 깜빡임을 막는다.
    placeholderData: keepPreviousData,
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
