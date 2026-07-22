import { type ApiPageEnvelope, apiClient, queryClient } from '@/shared/api';

import type { TrackerChecklistItem, TrackerItem, TrackerStatus } from '../types/tracker.types';

export type ApplicationStatusDto = 'INTERESTED' | 'PREPARING' | 'APPLIED' | 'COMPLETED';

export interface PolicyApplicationDto {
  id: number;
  policyId: number;
  policyTitle: string;
  policyCategory: string;
  policyApplicationEndDate: string | null;
  status: ApplicationStatusDto;
  memo: string | null;
  endAt: string | null;
  createdAt: string;
}

export interface PolicyApplicationChecklistDto {
  id: number;
  policyApplicationId: number;
  message: string;
  checked: boolean;
  createdAt: string;
}

const trackerStatusByApiStatus: Record<ApplicationStatusDto, TrackerStatus> = {
  INTERESTED: '관심',
  PREPARING: '준비중',
  APPLIED: '신청완료',
  COMPLETED: '종료',
};

const apiStatusByTrackerStatus: Record<TrackerStatus, ApplicationStatusDto> = {
  관심: 'INTERESTED',
  준비중: 'PREPARING',
  신청완료: 'APPLIED',
  종료: 'COMPLETED',
};

function toDateInputValue(value: string | null): string {
  return value?.slice(0, 10) ?? '';
}

function toIsoDateTime(value: string): string | undefined {
  if (!value) return undefined;
  return `${value}T00:00:00`;
}

function toPolicyId(policyId: string): number {
  const parsedPolicyId = Number(policyId);
  if (!Number.isSafeInteger(parsedPolicyId)) {
    throw new Error('유효하지 않은 정책 ID입니다.');
  }
  return parsedPolicyId;
}

export function toApiApplicationStatus(status: TrackerStatus): ApplicationStatusDto {
  return apiStatusByTrackerStatus[status];
}

export function mapPolicyApplicationToTracker(
  application: PolicyApplicationDto,
  checklist: PolicyApplicationChecklistDto[],
): TrackerItem {
  return {
    applicationId: application.id,
    policyId: String(application.policyId),
    policyDeadline: toDateInputValue(application.policyApplicationEndDate),
    createdAt: toDateInputValue(application.createdAt),
    status: trackerStatusByApiStatus[application.status],
    targetDate: toDateInputValue(application.endAt),
    checklist: checklist.map((item) => ({
      id: item.id,
      text: item.message,
      completed: item.checked,
    })),
    memo: application.memo ?? '',
  };
}

async function fetchChecklist(applicationId: number): Promise<PolicyApplicationChecklistDto[]> {
  const response = await apiClient.get<ApiPageEnvelope<PolicyApplicationChecklistDto>>(
    `/v1/policy-application-checklists/application/${applicationId}`,
    { params: { size: 100 } },
  );
  return response.data.data;
}

async function fetchAllApplications(): Promise<PolicyApplicationDto[]> {
  const firstResponse = await apiClient.get<ApiPageEnvelope<PolicyApplicationDto>>(
    '/v1/policy-applications',
    { params: { page: 1, size: 100 } },
  );

  const { data, meta } = firstResponse.data;
  let allItems = [...data];

  if (meta.totalPages > 1) {
    const promises = [];
    for (let p = 2; p <= meta.totalPages; p++) {
      promises.push(
        apiClient.get<ApiPageEnvelope<PolicyApplicationDto>>('/v1/policy-applications', {
          params: { page: p, size: 100 },
        }),
      );
    }
    const responses = await Promise.all(promises);
    for (const res of responses) {
      allItems = allItems.concat(res.data.data);
    }
  }
  return allItems;
}

export async function fetchTrackers(): Promise<TrackerItem[]> {
  const applications = await fetchAllApplications();
  const checklists = await Promise.all(
    applications.map((application) => fetchChecklist(application.id)),
  );

  return applications.map((application, index) =>
    mapPolicyApplicationToTracker(application, checklists[index] ?? []),
  );
}

export interface StartTrackerResult {
  tracker: TrackerItem;
  created: boolean;
}

export async function startTracker(
  policyId: string,
  deadline: string,
): Promise<StartTrackerResult> {
  const cachedTrackers = queryClient.getQueryData<TrackerItem[]>(['trackers']);
  const existing = (cachedTrackers ?? (await fetchTrackers())).find(
    (tracker) => tracker.policyId === policyId,
  );
  if (existing) {
    return { tracker: existing, created: false };
  }

  const response = await apiClient.post<{ data: PolicyApplicationDto }>('/v1/policy-applications', {
    policyId: toPolicyId(policyId),
    status: 'PREPARING',
    memo: '',
    endAt: toIsoDateTime(deadline),
  });

  return {
    tracker: mapPolicyApplicationToTracker(response.data.data, []),
    created: true,
  };
}

// 신청 정보(상태/마감일)를 부분 수정하는 PATCH 응답은 체크리스트를 포함하지 않는다.
// 두 PATCH 모두 갱신된 신청 정보 + 기존 체크리스트를 합쳐 TrackerItem으로 돌려주는 동일한 패턴이라 하나로 묶는다.
async function patchTrackerApplication(
  applicationId: number,
  patch: () => Promise<{ data: { data: PolicyApplicationDto } }>,
): Promise<TrackerItem> {
  const response = await patch();
  return mapPolicyApplicationToTracker(response.data.data, await fetchChecklist(applicationId));
}

export async function updateTrackerStatus(
  applicationId: number,
  status: TrackerStatus,
): Promise<TrackerItem> {
  return patchTrackerApplication(applicationId, () =>
    apiClient.patch<{ data: PolicyApplicationDto }>(
      `/v1/policy-applications/${applicationId}/status`,
      undefined,
      { params: { status: toApiApplicationStatus(status) } },
    ),
  );
}

export async function updateTrackerDate(
  applicationId: number,
  targetDate: string,
): Promise<TrackerItem> {
  return patchTrackerApplication(applicationId, () =>
    apiClient.patch<{ data: PolicyApplicationDto }>(
      `/v1/policy-applications/${applicationId}/end-at`,
      { endAt: toIsoDateTime(targetDate) },
    ),
  );
}

export async function addChecklistItem(applicationId: number, text: string): Promise<void> {
  await apiClient.post('/v1/policy-application-checklists', { applicationId, message: text });
}

export async function editChecklistItem(itemId: number, text: string): Promise<void> {
  await apiClient.patch(`/v1/policy-application-checklists/${itemId}`, { message: text });
}

export async function toggleChecklistItem(item: TrackerChecklistItem): Promise<void> {
  await apiClient.patch(
    `/v1/policy-application-checklists/${item.id}/${item.completed ? 'uncheck' : 'check'}`,
  );
}

export async function deleteChecklistItem(itemId: number): Promise<void> {
  await apiClient.delete(`/v1/policy-application-checklists/${itemId}`);
}

export async function saveTrackerMemo(applicationId: number, memo: string): Promise<void> {
  await apiClient.patch(`/v1/policy-applications/${applicationId}/memo`, { memo });
}

export async function deleteTracker(applicationId: number): Promise<void> {
  await apiClient.delete(`/v1/policy-applications/${applicationId}`);
}
