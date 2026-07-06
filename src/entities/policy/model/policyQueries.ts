import { useQuery } from "@tanstack/react-query";

import {
  fetchPolicies,
  fetchPolicy,
  fetchRecentlyViewedPolicies,
  searchPolicies,
  type PolicySearchParams,
} from "../api/policyApi";
import {
  mapPolicyDtosToPolicies,
  mapPolicyDtoToPolicy,
  mapRecentlyViewedDtoToModel,
} from "./policyMapper";
import type { RecentlyViewedPolicy } from "./policy.types";

export const policyKeys = {
  all: ["policies"] as const,
  list: (params: PolicySearchParams) => ["policies", "list", params] as const,
  detail: (policyId: string) => ["policies", "detail", policyId] as const,
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
  });
}

export function usePolicyQuery(policyId: string | null) {
  return useQuery({
    queryKey: policyKeys.detail(policyId ?? ""),
    queryFn: async () => {
      if (!policyId) return null;
      const dto = await fetchPolicy(policyId);
      return dto ? mapPolicyDtoToPolicy(dto) : null;
    },
    enabled: policyId !== null,
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
