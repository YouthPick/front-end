import { apiClient } from '@/shared/api';

import type { OnboardingProfileRequestDto, OnboardingProfileResponseDto } from './onboarding.dto';

interface ApiEnvelope<T> {
  data: T;
}

export async function submitOnboardingProfile(
  userId: string,
  request: OnboardingProfileRequestDto,
): Promise<OnboardingProfileResponseDto> {
  const response = await apiClient.post<ApiEnvelope<OnboardingProfileResponseDto>>(
    `/v1/users/${userId}/profile`,
    request,
  );
  return response.data.data;
}

export async function updateOnboardingProfile(
  request: OnboardingProfileRequestDto,
): Promise<OnboardingProfileResponseDto> {
  const response = await apiClient.patch<ApiEnvelope<OnboardingProfileResponseDto>>(
    '/v1/me/profile',
    request,
  );
  return response.data.data;
}
