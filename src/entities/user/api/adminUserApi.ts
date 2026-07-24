import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';

import type { UserRole } from '../model/user.types';
import type { AdminUserDto, AdminUserProfileDto } from './adminUser.dto';

export type AdminUserAccountStatus = 'ACTIVE' | 'DELETED';

export interface AdminUserSearchParams extends PageParams {
  role?: UserRole;
  accountStatus?: AdminUserAccountStatus;
  provider?: string;
}

export async function fetchAdminUsers(
  params: AdminUserSearchParams,
): Promise<PageResult<AdminUserDto>> {
  const response = await apiClient.get<ApiPageEnvelope<AdminUserDto>>('/v1/admin/users', {
    params,
  });
  return toPageResult(response.data, params.pageSize);
}

export async function fetchAdminUserProfile(userId: string): Promise<AdminUserProfileDto | null> {
  const response = await apiClient.get<{ data: AdminUserProfileDto | null }>(
    `/v1/admin/users/${userId}/profile`,
  );
  return response.data.data;
}

export async function updateAdminUserRole(userId: string, role: UserRole): Promise<AdminUserDto> {
  const response = await apiClient.patch<{ data: AdminUserDto }>(`/v1/admin/users/${userId}/role`, {
    role,
  });
  return response.data.data;
}

export async function softDeleteAdminUser(userId: string): Promise<AdminUserDto> {
  const response = await apiClient.delete<{ data: AdminUserDto }>(`/v1/admin/users/${userId}`);
  return response.data.data;
}
