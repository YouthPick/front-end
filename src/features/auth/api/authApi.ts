import { apiClient } from '@/shared/api';

import type { AccessTokenDto, AuthUserDto, OAuthAuthorizationUrlDto } from './auth.dto';

interface ApiEnvelope<T> {
  data: T;
}

export async function fetchOAuthAuthorizationUrl(provider: string): Promise<string> {
  const response = await apiClient.get<ApiEnvelope<OAuthAuthorizationUrlDto>>(
    `/v1/auth/oauth/${provider}/authorization-url`,
  );
  return response.data.data.authorizationUrl;
}

export async function exchangeOAuthCallback(
  provider: string,
  code: string,
  state: string,
): Promise<AccessTokenDto> {
  const response = await apiClient.post<ApiEnvelope<AccessTokenDto>>(
    `/v1/auth/oauth/${provider}/callback`,
    { code, state },
  );
  return response.data.data;
}

export async function refreshAccessToken(): Promise<AccessTokenDto> {
  const response = await apiClient.post<ApiEnvelope<AccessTokenDto>>('/v1/auth/token/refresh');
  return response.data.data;
}

export async function requestLogout(): Promise<void> {
  await apiClient.post('/v1/auth/logout');
}

export async function fetchCurrentUser(): Promise<AuthUserDto> {
  const response = await apiClient.get<ApiEnvelope<AuthUserDto>>('/v1/auth/me');
  return response.data.data;
}

export async function requestAccountDeletion(): Promise<void> {
  await apiClient.delete('/v1/users');
}
