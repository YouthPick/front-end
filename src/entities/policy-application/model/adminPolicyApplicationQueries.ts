import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PageResult } from '@/shared/types';

import type { AdminPolicyApplicationStatus } from '../api/adminPolicyApplication.dto';
import {
  type AdminPolicyApplicationSearchParams,
  fetchAdminPolicyApplications,
  fetchApplicationChecklist,
  updateAdminPolicyApplicationStatus,
} from '../api/adminPolicyApplicationApi';
import type {
  AdminPolicyApplication,
  ApplicationChecklistItem,
} from './adminPolicyApplication.types';
import {
  mapAdminPolicyApplicationDtoToAdminPolicyApplication,
  mapApplicationChecklistItemDtoToApplicationChecklistItem,
} from './adminPolicyApplicationMapper';

export const adminPolicyApplicationKeys = {
  all: ['admin', 'policy-applications'] as const,
  list: (params: AdminPolicyApplicationSearchParams) =>
    ['admin', 'policy-applications', 'list', params] as const,
  checklist: (applicationId: string) =>
    ['admin', 'policy-applications', 'checklist', applicationId] as const,
};

export function useAdminPolicyApplicationsQuery(params: AdminPolicyApplicationSearchParams) {
  return useQuery({
    queryKey: adminPolicyApplicationKeys.list(params),
    queryFn: async (): Promise<PageResult<AdminPolicyApplication>> => {
      const pageDto = await fetchAdminPolicyApplications(params);
      return {
        ...pageDto,
        items: pageDto.items.map(mapAdminPolicyApplicationDtoToAdminPolicyApplication),
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useApplicationChecklistQuery(applicationId: string | null) {
  return useQuery({
    queryKey: adminPolicyApplicationKeys.checklist(applicationId ?? ''),
    queryFn: async (): Promise<ApplicationChecklistItem[]> => {
      if (!applicationId) return [];
      const dtos = await fetchApplicationChecklist(applicationId);
      return dtos.map(mapApplicationChecklistItemDtoToApplicationChecklistItem);
    },
    enabled: applicationId !== null,
  });
}

export function useUpdateAdminPolicyApplicationStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: AdminPolicyApplicationStatus;
    }) => updateAdminPolicyApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPolicyApplicationKeys.all });
    },
  });
}
