import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, paginate } from '@/shared/utils';

import type { AdminPolicyDto, AdminPolicyVisibilityStatus } from './adminPolicy.dto';
import { MOCK_ADMIN_POLICY_DTOS } from './adminPolicyMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface AdminPolicySearchParams extends PageParams {
  category?: string;
  visibilityStatus?: AdminPolicyVisibilityStatus;
  // "YYYY-MM-DD". 정책의 신청기간(applicationStartDate~applicationEndDate)과 겹치는 정책만 조회한다.
  startDate?: string;
  endDate?: string;
}

const adminPolicies: AdminPolicyDto[] = MOCK_ADMIN_POLICY_DTOS.map((dto) => ({
  ...dto,
  regionCodes: [...dto.regionCodes],
}));

function cloneAdminPolicy(dto: AdminPolicyDto): AdminPolicyDto {
  return { ...dto, regionCodes: [...dto.regionCodes] };
}

function matchesAdminPolicyParams(
  policy: AdminPolicyDto,
  params: AdminPolicySearchParams,
): boolean {
  if (params.category && policy.largeCategory !== params.category) return false;
  if (params.visibilityStatus && policy.visibilityStatus !== params.visibilityStatus) return false;

  if (params.startDate && policy.applicationEndDate < params.startDate) return false;
  if (params.endDate && policy.applicationStartDate > params.endDate) return false;

  return true;
}

export async function fetchAdminPolicies(
  params: AdminPolicySearchParams,
): Promise<PageResult<AdminPolicyDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = adminPolicies.filter((policy) => matchesAdminPolicyParams(policy, params));
  const paged = paginate(filtered, params.page, params.pageSize);

  return { ...paged, items: paged.items.map(cloneAdminPolicy) };
}

export interface AdminPolicyUpdateInput {
  policyName: string;
  organizationName: string;
  description: string;
  largeCategory: string;
  middleCategory: string;
  applicationStartDate: string;
  applicationEndDate: string;
  applicationUrl: string;
  regionCodes: string[];
}

function findAdminPolicyOrThrow(policyId: string): AdminPolicyDto {
  const target = adminPolicies.find((policy) => policy.id === policyId);
  if (!target) throw new Error(`존재하지 않는 정책입니다: ${policyId}`);
  return target;
}

export async function updateAdminPolicy(
  policyId: string,
  input: AdminPolicyUpdateInput,
): Promise<AdminPolicyDto> {
  await delay(MOCK_API_DELAY_MS);

  const target = findAdminPolicyOrThrow(policyId);
  Object.assign(target, input, { updatedAt: new Date().toISOString() });

  return cloneAdminPolicy(target);
}

export async function setAdminPolicyVisibility(
  policyId: string,
  visibilityStatus: AdminPolicyVisibilityStatus,
): Promise<AdminPolicyDto> {
  await delay(MOCK_API_DELAY_MS);

  const target = findAdminPolicyOrThrow(policyId);
  target.visibilityStatus = visibilityStatus;
  target.updatedAt = new Date().toISOString();

  return cloneAdminPolicy(target);
}

export async function softDeleteAdminPolicy(policyId: string): Promise<AdminPolicyDto> {
  await delay(MOCK_API_DELAY_MS);

  const target = findAdminPolicyOrThrow(policyId);
  target.deletedAt = new Date().toISOString();

  return cloneAdminPolicy(target);
}
