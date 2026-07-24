import { type ApiPageEnvelope, apiClient, queryClient } from '@/shared/api';

export interface PolicyApplicationBookmarkDto {
  id: number;
  policyId: number;
  status: 'INTERESTED' | 'PREPARING' | 'APPLIED' | 'COMPLETED';
}

export async function fetchApplications(): Promise<PolicyApplicationBookmarkDto[]> {
  const firstResponse = await apiClient.get<ApiPageEnvelope<PolicyApplicationBookmarkDto>>(
    '/v1/policy-applications',
    { params: { page: 1, size: 100 } },
  );

  const { data, meta } = firstResponse.data;
  let allItems = [...data];

  if (meta.totalPages > 1) {
    const promises = [];
    for (let p = 2; p <= meta.totalPages; p++) {
      promises.push(
        apiClient.get<ApiPageEnvelope<PolicyApplicationBookmarkDto>>('/v1/policy-applications', {
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

export async function fetchBookmarkedPolicyIds(): Promise<string[]> {
  const applications = await fetchApplications();
  return applications
    .filter((application) => application.status === 'INTERESTED')
    .map((application) => String(application.policyId));
}

export async function toggleBookmark(policyId: string): Promise<{ saved: boolean }> {
  const numericPolicyId = Number(policyId);
  if (!Number.isSafeInteger(numericPolicyId)) {
    throw new Error('유효하지 않은 정책 ID입니다.');
  }

  const cachedApps = queryClient.getQueryData<PolicyApplicationBookmarkDto[]>(['applications']);
  const applications = cachedApps ?? (await fetchApplications());
  const existing = applications.find((application) => application.policyId === numericPolicyId);

  if (existing?.status === 'INTERESTED') {
    await apiClient.delete(`/v1/policy-applications/${existing.id}`);
    return { saved: false };
  }

  if (existing) {
    await apiClient.patch(`/v1/policy-applications/${existing.id}/status`, undefined, {
      params: { status: 'INTERESTED' },
    });
    return { saved: true };
  }

  await apiClient.post('/v1/policy-applications', {
    policyId: numericPolicyId,
    status: 'INTERESTED',
    memo: '',
  });
  return { saved: true };
}
