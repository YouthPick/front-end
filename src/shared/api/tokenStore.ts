// access token은 AUTH-GR-002(localStorage 저장 금지)에 따라 메모리에만 보관한다.
// 새로고침 시에는 refresh token(HttpOnly 쿠키)으로 세션을 다시 복원한다.
let accessToken: string | null = null;
const sessionExpiredListeners = new Set<() => void>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}

// entities/user의 authStore가 구독해 세션 만료 시 로그인 UI 상태를 함께 초기화한다.
// shared 레이어가 entities를 직접 import할 수 없어 이벤트 구독 방식으로 알린다.
export function subscribeSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

export function notifySessionExpired(): void {
  clearAccessToken();
  for (const listener of sessionExpiredListeners) listener();
}
