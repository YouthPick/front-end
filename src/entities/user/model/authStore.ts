import { create } from 'zustand';

import { clearAccessToken, queryClient, subscribeSessionExpired } from '@/shared/api';

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
  login: (user) => {
    // logout 없이 탭/브라우저를 닫은 뒤 같은 기기에서 다른 사용자가 로그인하는 경우를 대비해,
    // 저장된 프로필의 소유자(userId)가 새로 로그인한 사용자와 다르면 이전 온보딩 상태를 버린다.
    const profileStore = useProfileStore.getState();
    if (profileStore.userId !== null && profileStore.userId !== user.id) {
      profileStore.resetProfile();
    }
    useProfileStore.getState().setUserId(user.id);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    clearAccessToken();
    // 사용자 범위 queryKey가 없는 캐시가 남으면 다른 계정 로그인 뒤 이전 정보가 잠시 보일 수 있다.
    queryClient.clear();
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
