import { apiClient } from '@/shared/api';

import type { OnboardingProfileResponseDto } from './onboarding.dto';

export async function fetchMyProfile(): Promise<OnboardingProfileResponseDto | null> {
  const response = await apiClient.get<{ data: OnboardingProfileResponseDto | null }>(
    '/v1/me/profile',
  );
  return response.data.data;
}
