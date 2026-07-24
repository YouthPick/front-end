import { type ApiPageEnvelope, apiClient, toPageResult } from '@/shared/api';
import type { PageParams, PageResult } from '@/shared/types';

import type {
  AdminPolicyApplicationDto,
  AdminPolicyApplicationStatus,
  ApplicationChecklistItemDto,
} from './adminPolicyApplication.dto';

export interface AdminPolicyApplicationSearchParams extends PageParams {
  userId?: string;
  policyName?: string;
  status?: AdminPolicyApplicationStatus;
  // "YYYY-MM-DD". 마감일(deadline)이 이 범위 안에 있는 신청만 조회한다.
  deadlineStart?: string;
  deadlineEnd?: string;
}

export async function fetchAdminPolicyApplications(
  params: AdminPolicyApplicationSearchParams,
): Promise<PageResult<AdminPolicyApplicationDto>> {
  const response = await apiClient.get<ApiPageEnvelope<AdminPolicyApplicationDto>>(
    '/v1/admin/policy-applications',
    { params },
  );
  return toPageResult(response.data, params.pageSize);
}

export async function fetchApplicationChecklist(
  policyApplicationId: string,
): Promise<ApplicationChecklistItemDto[]> {
  const response = await apiClient.get<{ data: ApplicationChecklistItemDto[] }>(
    `/v1/admin/policy-applications/${policyApplicationId}/checklist`,
  );
  return response.data.data;
}

export async function updateAdminPolicyApplicationStatus(
  applicationId: string,
  status: AdminPolicyApplicationStatus,
): Promise<AdminPolicyApplicationDto> {
  const response = await apiClient.patch<{ data: AdminPolicyApplicationDto }>(
    `/v1/admin/policy-applications/${applicationId}/status`,
    { status },
  );
  return response.data.data;
}
