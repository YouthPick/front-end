import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';

import type { AdminPolicyDto, AdminPolicyVisibilityStatus } from './adminPolicy.dto';

export interface AdminPolicySearchParams extends PageParams {
  category?: string;
  visibilityStatus?: AdminPolicyVisibilityStatus;
  // "YYYY-MM-DD". 정책의 신청기간(applicationStartDate~applicationEndDate)과 겹치는 정책만 조회한다.
  startDate?: string;
  endDate?: string;
}

export async function fetchAdminPolicies(
  params: AdminPolicySearchParams,
): Promise<PageResult<AdminPolicyDto>> {
  const response = await apiClient.get<ApiPageEnvelope<AdminPolicyDto>>('/v1/admin/policies', {
    params,
  });
  return toPageResult(response.data, params.pageSize);
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

export async function updateAdminPolicy(
  policyId: string,
  input: AdminPolicyUpdateInput,
): Promise<AdminPolicyDto> {
  const response = await apiClient.patch<{ data: AdminPolicyDto }>(
    `/v1/admin/policies/${policyId}`,
    input,
  );
  return response.data.data;
}

export async function setAdminPolicyVisibility(
  policyId: string,
  visibilityStatus: AdminPolicyVisibilityStatus,
): Promise<AdminPolicyDto> {
  const response = await apiClient.patch<{ data: AdminPolicyDto }>(
    `/v1/admin/policies/${policyId}/visibility`,
    { visibilityStatus },
  );
  return response.data.data;
}

export async function softDeleteAdminPolicy(policyId: string): Promise<AdminPolicyDto> {
  const response = await apiClient.delete<{ data: AdminPolicyDto }>(
    `/v1/admin/policies/${policyId}`,
  );
  return response.data.data;
}
