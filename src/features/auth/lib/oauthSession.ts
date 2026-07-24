import { isInternalPath } from '@/shared/utils';

import type { OAuthProviderId } from '../api/auth.dto';

// 소셜 로그인은 외부 사이트(카카오 등)를 거쳐 브라우저가 완전히 새로고침되며 돌아오므로,
// SPA state(location.state)가 아닌 sessionStorage로 provider/복귀 경로를 넘긴다.
const PROVIDER_KEY = 'auth.oauth.provider';
const REDIRECT_KEY = 'auth.oauth.redirect';

export function saveOAuthSession(provider: OAuthProviderId, redirectTo: string | null): void {
  sessionStorage.setItem(PROVIDER_KEY, provider);
  if (redirectTo) {
    sessionStorage.setItem(REDIRECT_KEY, redirectTo);
  } else {
    sessionStorage.removeItem(REDIRECT_KEY);
  }
}

export function consumeOAuthSession(): { provider: string | null; redirectTo: string | null } {
  const provider = sessionStorage.getItem(PROVIDER_KEY);
  const redirectTo = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(PROVIDER_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  return { provider, redirectTo: isInternalPath(redirectTo) ? redirectTo : null };
}
