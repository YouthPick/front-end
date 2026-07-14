import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, paginate } from '@/shared/utils';

import type { UserRole } from '../model/user.types';
import type { AdminUserDto, AdminUserProfileDto } from './adminUser.dto';
import { MOCK_ADMIN_USER_DTOS, MOCK_ADMIN_USER_PROFILE_DTOS } from './adminUserMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export type AdminUserAccountStatus = 'ACTIVE' | 'DELETED';

export interface AdminUserSearchParams extends PageParams {
  role?: UserRole;
  accountStatus?: AdminUserAccountStatus;
  provider?: string;
}

const adminUsers: AdminUserDto[] = MOCK_ADMIN_USER_DTOS.map((dto) => ({ ...dto }));

function matchesAdminUserParams(user: AdminUserDto, params: AdminUserSearchParams): boolean {
  if (params.role && user.role !== params.role) return false;
  if (params.provider && user.provider !== params.provider) return false;
  if (params.accountStatus === 'ACTIVE' && user.deletedAt !== null) return false;
  if (params.accountStatus === 'DELETED' && user.deletedAt === null) return false;
  return true;
}

export async function fetchAdminUsers(
  params: AdminUserSearchParams,
): Promise<PageResult<AdminUserDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = adminUsers.filter((user) => matchesAdminUserParams(user, params));
  const paged = paginate(filtered, params.page, params.pageSize);

  return { ...paged, items: paged.items.map((dto) => ({ ...dto })) };
}

export async function fetchAdminUserProfile(userId: string): Promise<AdminUserProfileDto | null> {
  await delay(MOCK_API_DELAY_MS);

  const found = MOCK_ADMIN_USER_PROFILE_DTOS.find((profile) => profile.userId === userId);
  return found ? { ...found } : null;
}

export async function updateAdminUserRole(userId: string, role: UserRole): Promise<AdminUserDto> {
  await delay(MOCK_API_DELAY_MS);

  const target = adminUsers.find((user) => user.id === userId);
  if (!target) throw new Error(`존재하지 않는 사용자입니다: ${userId}`);

  target.role = role;
  return { ...target };
}

export async function softDeleteAdminUser(userId: string): Promise<AdminUserDto> {
  await delay(MOCK_API_DELAY_MS);

  const target = adminUsers.find((user) => user.id === userId);
  if (!target) throw new Error(`존재하지 않는 사용자입니다: ${userId}`);

  target.deletedAt = new Date().toISOString();
  return { ...target };
}
