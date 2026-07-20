import { type ApiPageEnvelope, apiClient } from '@/shared/api';

interface PolicyApplicationBookmarkDto {
  id: number;
  policyId: number;
  status: 'INTERESTED' | 'PREPARING' | 'APPLIED' | 'COMPLETED';
}

async function fetchApplications(): Promise<PolicyApplicationBookmarkDto[]> {
  const response = await apiClient.get<ApiPageEnvelope<PolicyApplicationBookmarkDto>>(
    '/v1/policy-applications',
    { params: { size: 100 } },
  );
  return response.data.data;
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

  const applications = await fetchApplications();
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
