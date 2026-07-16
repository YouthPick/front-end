import { create } from 'zustand';

import { clearAccessToken, subscribeSessionExpired } from '@/shared/api';

import { useProfileStore } from './profileStore';
import type { AuthUser } from './user.types';

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  // 새로고침 시 refresh 쿠키로 세션을 복원하는 동안 true. ProtectedRoute가 이 값이 꺼질 때까지
  // 로그인 화면으로 성급하게 리다이렉트하지 않는다.
  isInitializing: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    clearAccessToken();
    // 기기 공용 브라우저에서 다른 사용자가 로그인해도 이전 사용자의 온보딩 상태가 남지 않게 한다.
    useProfileStore.getState().resetProfile();
    set({ user: null, isAuthenticated: false });
  },
  setInitializing: (isInitializing) => set({ isInitializing }),
}));

// access token 갱신이 최종 실패하면(재로그인 필요) shared/api가 이 이벤트를 쏘고,
// 여기서 구독해 로그인 UI 상태를 함께 초기화한다.
subscribeSessionExpired(() => {
  useAuthStore.getState().logout();
});
