import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PageResult } from '@/shared/types';

import {
  type AdminUserSearchParams,
  fetchAdminUserProfile,
  fetchAdminUsers,
  softDeleteAdminUser,
  updateAdminUserRole,
} from '../api/adminUserApi';
import type { AdminUser, AdminUserProfile } from './adminUser.types';
import {
  mapAdminUserDtoToAdminUser,
  mapAdminUserProfileDtoToAdminUserProfile,
} from './adminUserMapper';
import type { UserRole } from './user.types';

export const adminUserKeys = {
  all: ['admin', 'users'] as const,
  list: (params: AdminUserSearchParams) => ['admin', 'users', 'list', params] as const,
  profile: (userId: string) => ['admin', 'users', 'profile', userId] as const,
};

export function useAdminUsersQuery(params: AdminUserSearchParams) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: async (): Promise<PageResult<AdminUser>> => {
      const pageDto = await fetchAdminUsers(params);
      return { ...pageDto, items: pageDto.items.map(mapAdminUserDtoToAdminUser) };
    },
    placeholderData: keepPreviousData,
  });
}

export function useAdminUserProfileQuery(userId: string | null) {
  return useQuery({
    queryKey: adminUserKeys.profile(userId ?? ''),
    queryFn: async (): Promise<AdminUserProfile | null> => {
      if (!userId) return null;
      const dto = await fetchAdminUserProfile(userId);
      return dto ? mapAdminUserProfileDtoToAdminUserProfile(dto) : null;
    },
    enabled: userId !== null,
  });
}

export function useUpdateAdminUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateAdminUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}

export function useSoftDeleteAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => softDeleteAdminUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}
