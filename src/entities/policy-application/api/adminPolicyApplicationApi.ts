import { MOCK_API_DELAY_MS } from '@/shared/constants';
import type { PageParams, PageResult } from '@/shared/types';
import { delay, matchesTextQuery, paginate } from '@/shared/utils';

import type {
  AdminPolicyApplicationDto,
  AdminPolicyApplicationStatus,
  ApplicationChecklistItemDto,
} from './adminPolicyApplication.dto';
import {
  MOCK_ADMIN_POLICY_APPLICATION_DTOS,
  MOCK_APPLICATION_CHECKLIST_BY_APPLICATION_ID,
} from './adminPolicyApplicationMockData';

// 백엔드 API가 준비되면 이 파일의 mock 구현만 apiClient 호출로 교체한다.

export interface AdminPolicyApplicationSearchParams extends PageParams {
  userId?: string;
  policyName?: string;
  status?: AdminPolicyApplicationStatus;
  // "YYYY-MM-DD". 마감일(deadline)이 이 범위 안에 있는 신청만 조회한다.
  deadlineStart?: string;
  deadlineEnd?: string;
}

const adminPolicyApplications: AdminPolicyApplicationDto[] = MOCK_ADMIN_POLICY_APPLICATION_DTOS.map(
  (dto) => ({ ...dto }),
);

function matchesAdminPolicyApplicationParams(
  application: AdminPolicyApplicationDto,
  params: AdminPolicyApplicationSearchParams,
): boolean {
  if (params.userId && application.userId !== params.userId) return false;
  if (!matchesTextQuery([application.policyName], params.policyName)) return false;
  if (params.status && application.status !== params.status) return false;
  if (params.deadlineStart && application.deadline < params.deadlineStart) return false;
  if (params.deadlineEnd && application.deadline > params.deadlineEnd) return false;
  return true;
}

export async function fetchAdminPolicyApplications(
  params: AdminPolicyApplicationSearchParams,
): Promise<PageResult<AdminPolicyApplicationDto>> {
  await delay(MOCK_API_DELAY_MS);

  const filtered = adminPolicyApplications.filter((application) =>
    matchesAdminPolicyApplicationParams(application, params),
  );
  const paged = paginate(filtered, params.page, params.pageSize);

  return { ...paged, items: paged.items.map((dto) => ({ ...dto })) };
}

export async function fetchApplicationChecklist(
  policyApplicationId: string,
): Promise<ApplicationChecklistItemDto[]> {
  await delay(MOCK_API_DELAY_MS);

  const items = MOCK_APPLICATION_CHECKLIST_BY_APPLICATION_ID[policyApplicationId] ?? [];
  return items.map((item) => ({ ...item }));
}

export async function updateAdminPolicyApplicationStatus(
  applicationId: string,
  status: AdminPolicyApplicationStatus,
): Promise<AdminPolicyApplicationDto> {
  await delay(MOCK_API_DELAY_MS);

  const target = adminPolicyApplications.find((application) => application.id === applicationId);
  if (!target) throw new Error(`존재하지 않는 정책 신청입니다: ${applicationId}`);

  target.status = status;
  return { ...target };
}
