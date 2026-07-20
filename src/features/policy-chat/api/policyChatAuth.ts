import { getAccessToken, requestNewAccessToken } from '@/shared/api';

const ACCESS_TOKEN_REFRESH_SKEW_SECONDS = 30;
const JWT_PART_COUNT = 3;

function decodeBase64Url(value: string): string {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4;
  return atob(`${normalizedValue}${'='.repeat(paddingLength)}`);
}

function getJwtExpirySeconds(token: string): number | null {
  const [, payload] = token.split('.');
  if (token.split('.').length !== JWT_PART_COUNT || !payload) return null;

  try {
    const parsedPayload: unknown = JSON.parse(decodeBase64Url(payload));
    if (typeof parsedPayload !== 'object' || parsedPayload === null) return null;
    const expiresAt = (parsedPayload as { exp?: unknown }).exp;
    return typeof expiresAt === 'number' ? expiresAt : null;
  } catch {
    return null;
  }
}

export function isPolicyChatAccessTokenUsable(token: string): boolean {
  const expiresAtSeconds = getJwtExpirySeconds(token);
  if (expiresAtSeconds === null) return false;

  const refreshThresholdMs = ACCESS_TOKEN_REFRESH_SKEW_SECONDS * 1000;
  return expiresAtSeconds * 1000 > Date.now() + refreshThresholdMs;
}

export async function getFreshPolicyChatAccessToken(): Promise<string> {
  const currentToken = getAccessToken();
  if (currentToken && isPolicyChatAccessTokenUsable(currentToken)) return currentToken;

  return requestNewAccessToken();
}
