import { useToastStore } from '../ui/toast/toastStore';

// access token은 AUTH-GR-002(localStorage 저장 금지)에 따라 메모리에만 보관한다.
// 새로고침 시에는 refresh token(HttpOnly 쿠키)으로 세션을 다시 복원한다.
let accessToken: string | null = null;
const sessionExpiredListeners = new Set<() => void>();
// 로그인/로그아웃 1회당 세션 만료 알림을 한 번만 보내기 위한 플래그.
// 화면에 동시에 떠 있던 여러 요청이 한꺼번에 401을 받으면(refresh 재시도도 각자 실패)
// notifySessionExpired가 매 요청마다 호출돼 토스트가 중복으로 쌓인다.
let hasNotifiedSessionExpired = false;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
  localStorage.setItem('has_logged_in_hint', 'true');
  hasNotifiedSessionExpired = false;
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

// 사용자가 직접 로그아웃할 때 호출한다. 로그아웃 직후 화면에 남아있던 요청이 뒤늦게 401로
// 실패해도, 이미 안내한 로그아웃 토스트 위에 "세션이 만료되었습니다"가 겹쳐 뜨지 않게 막는다.
export function markLoggedOut(): void {
  hasNotifiedSessionExpired = true;
}

export function notifySessionExpired(): void {
  clearAccessToken();
  localStorage.removeItem('has_logged_in_hint');
  if (hasNotifiedSessionExpired) return;
  hasNotifiedSessionExpired = true;
  useToastStore.getState().showToast('세션이 만료되었습니다. 다시 로그인해주세요.', 'warning');
  for (const listener of sessionExpiredListeners) listener();
}
