import { apiBaseUrl, requestJson, requestNoContent, setUnauthorizedHandler, type ApiResponse } from "@shared/api/http";

const AUTH_USER_STORAGE_KEY = "bop.auth.user";
const AUTH_TOKEN_STORAGE_KEY = "bop.auth.tokens";

export const OAUTH_PROVIDERS = ["kakao", "naver", "google"] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

const PROVIDER_ALIASES: Record<string, OAuthProvider> = {
  kakao: "kakao",
  "카카오": "kakao",
  naver: "naver",
  "네이버": "naver",
  google: "google",
  "구글": "google",
};

export interface CurrentUserDto {
  userId: string;
  role: "MEMBER" | "ADMIN" | string;
  onboardingStatus: "COMPLETED" | "NEEDS_PROFILE" | string;
  permissions: string[];
}

export interface TokenPairDto {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer" | string;
  accessTokenExpiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
}

export interface OAuthCallbackDto extends CurrentUserDto {
  provider: OAuthProvider;
  displayName: string | null;
  email: string | null;
  authenticated: boolean;
  tokens: TokenPairDto;
}

interface OAuthAuthorizationUrlDto {
  provider: OAuthProvider;
  authorizationUrl: string;
}

export interface StoredAuthUser {
  userId: string;
  displayName?: string | null;
  email?: string | null;
  provider?: OAuthProvider;
}

export const MOCK_USER_DISPLAY_NAME = "익명";

const PROVIDER_LABELS: Record<OAuthProvider, string> = {
  kakao: "카카오",
  naver: "네이버",
  google: "Google",
};

export function isProviderSubjectUserId(userId: string | null | undefined): boolean {
  return inferOAuthProvider(userId) !== null;
}

export function inferOAuthProvider(userId: string | null | undefined): OAuthProvider | null {
  const normalizedUserId = userId?.trim();
  if (!normalizedUserId) {
    return null;
  }
  return OAUTH_PROVIDERS.find((provider) => normalizedUserId.startsWith(`${provider}:`)) ?? null;
}

export function toDisplayUserName(user: Pick<StoredAuthUser, "userId" | "displayName"> | null): string {
  const displayName = user?.displayName?.trim();
  if (displayName && !isProviderSubjectUserId(displayName)) {
    return displayName;
  }

  const userId = user?.userId?.trim();
  if (!userId || isProviderSubjectUserId(userId)) {
    return MOCK_USER_DISPLAY_NAME;
  }

  return userId;
}

export function toOAuthProviderLabel(provider: OAuthProvider | null | undefined): string {
  return provider ? PROVIDER_LABELS[provider] : "소셜";
}

interface StoredAuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export function normalizeOAuthProvider(provider: string): OAuthProvider {
  const normalized = PROVIDER_ALIASES[provider.trim().toLowerCase()] ?? PROVIDER_ALIASES[provider.trim()];
  if (!normalized) {
    throw new Error("지원하지 않는 OAuth 제공자입니다.");
  }
  return normalized;
}

export function getStoredAuthUser(): StoredAuthUser | null {
  const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredAuthUser;
    return parsed.userId ? parsed : null;
  } catch {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

export function getStoredAuthTokens(): StoredAuthTokens | null {
  const raw = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredAuthTokens;
    return parsed.accessToken && parsed.refreshToken ? parsed : null;
  } catch {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return null;
  }
}

export function getAuthenticatedUserId(): string | null {
  return getStoredAuthUser()?.userId ?? null;
}

export function setAuthenticatedUser(user: OAuthCallbackDto | CurrentUserDto): void {
  const existingUser = getStoredAuthUser();
  const shouldPreserveExisting = existingUser?.userId === user.userId;
  const stored: StoredAuthUser = {
    userId: user.userId,
    displayName: "displayName" in user ? user.displayName : shouldPreserveExisting ? existingUser.displayName : null,
    email: "email" in user ? user.email : shouldPreserveExisting ? existingUser.email : null,
    provider: "provider" in user ? user.provider : shouldPreserveExisting ? existingUser.provider ?? inferOAuthProvider(user.userId) ?? undefined : inferOAuthProvider(user.userId) ?? undefined,
  };
  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(stored));

  if ("tokens" in user) {
    setAuthTokens(user.tokens);
  }
}

export function setAuthTokens(tokens: TokenPairDto): void {
  window.localStorage.setItem(
    AUTH_TOKEN_STORAGE_KEY,
    JSON.stringify({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: tokens.tokenType,
    } satisfies StoredAuthTokens),
  );
}

export function clearAuthenticatedUser(): void {
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getUserHeaders(): Record<string, string> {
  const tokens = getStoredAuthTokens();
  return tokens?.accessToken ? { Authorization: `${tokens.tokenType || "Bearer"} ${tokens.accessToken}` } : {};
}

export function getUserJsonHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...getUserHeaders(),
  };
}

export async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUserDto> {
  const tokens = getStoredAuthTokens();
  if (!tokens?.accessToken) {
    throw new Error("저장된 로그인 토큰이 없습니다.");
  }
  const response = await requestJson<ApiResponse<CurrentUserDto>>("/api/v1/auth/me", {
    headers: getUserHeaders(),
    signal,
  });
  setAuthenticatedUser(response.data);
  return response.data;
}

export async function fetchOAuthAuthorizationUrl(provider: string, state?: string): Promise<OAuthAuthorizationUrlDto> {
  const normalizedProvider = normalizeOAuthProvider(provider);
  const redirectUri = `${window.location.origin}/login/callback`;
  const searchParams = new URLSearchParams({ redirectUri });
  if (state?.trim()) {
    searchParams.set("state", state.trim());
  }
  const response = await requestJson<ApiResponse<OAuthAuthorizationUrlDto>>(
    `/api/v1/auth/oauth/${encodeURIComponent(normalizedProvider)}/authorization-url?${searchParams.toString()}`,
  );
  return response.data;
}

export async function completeOAuthLogin(provider: string, code: string): Promise<OAuthCallbackDto> {
  const normalizedProvider = normalizeOAuthProvider(provider);
  const response = await requestJson<ApiResponse<OAuthCallbackDto>>(
    `/api/v1/auth/oauth/${encodeURIComponent(normalizedProvider)}/callback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        redirectUri: `${window.location.origin}/login/callback`,
      }),
    },
  );
  setAuthenticatedUser(response.data);
  return response.data;
}

export async function refreshAccessToken(): Promise<boolean> {
  const tokens = getStoredAuthTokens();
  if (!tokens?.refreshToken) {
    clearAuthenticatedUser();
    return false;
  }

  const response = await fetch(`${apiBaseUrl()}/api/v1/auth/token/refresh`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });

  if (!response.ok) {
    clearAuthenticatedUser();
    return false;
  }

  const body = (await response.json()) as ApiResponse<TokenPairDto>;
  setAuthTokens(body.data);
  return true;
}

export async function logoutCurrentUser(): Promise<void> {
  const refreshToken = getStoredAuthTokens()?.refreshToken;
  if (refreshToken) {
    await requestNoContent("/api/v1/auth/logout", {
      method: "POST",
      headers: getUserJsonHeaders(),
      body: JSON.stringify({ refreshToken }),
    });
  }
  clearAuthenticatedUser();
}

export async function deleteCurrentUser(): Promise<void> {
  await requestNoContent("/api/v1/auth/me", {
    method: "DELETE",
    headers: getUserJsonHeaders(),
    body: JSON.stringify({ confirmText: "탈퇴합니다" }),
  });
  clearAuthenticatedUser();
}

setUnauthorizedHandler(refreshAccessToken);
