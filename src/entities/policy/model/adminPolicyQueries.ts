import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PageResult } from '@/shared/types';
import type { AdminPolicyVisibilityStatus } from '../api/adminPolicy.dto';
import {
  type AdminPolicySearchParams,
  type AdminPolicyUpdateInput,
  fetchAdminPolicies,
  setAdminPolicyVisibility,
  softDeleteAdminPolicy,
  updateAdminPolicy,
} from '../api/adminPolicyApi';
import type { AdminPolicy } from './adminPolicy.types';
import { mapAdminPolicyDtoToAdminPolicy } from './adminPolicyMapper';

export const adminPolicyKeys = {
  all: ['admin', 'policies'] as const,
  list: (params: AdminPolicySearchParams) => ['admin', 'policies', 'list', params] as const,
};

export function useAdminPoliciesQuery(params: AdminPolicySearchParams) {
  return useQuery({
    queryKey: adminPolicyKeys.list(params),
    queryFn: async (): Promise<PageResult<AdminPolicy>> => {
      const pageDto = await fetchAdminPolicies(params);
      return { ...pageDto, items: pageDto.items.map(mapAdminPolicyDtoToAdminPolicy) };
    },
    placeholderData: keepPreviousData,
  });
}

export function useUpdateAdminPolicyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ policyId, input }: { policyId: string; input: AdminPolicyUpdateInput }) =>
      updateAdminPolicy(policyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPolicyKeys.all });
    },
  });
}

export function useSetAdminPolicyVisibilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      policyId,
      visibilityStatus,
    }: {
      policyId: string;
      visibilityStatus: AdminPolicyVisibilityStatus;
    }) => setAdminPolicyVisibility(policyId, visibilityStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPolicyKeys.all });
    },
  });
}

export function useSoftDeleteAdminPolicyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policyId: string) => softDeleteAdminPolicy(policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPolicyKeys.all });
    },
  });
}
