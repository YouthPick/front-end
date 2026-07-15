import { useEffect } from 'react';

import { useAuthStore } from '@/entities/user';
import { setAccessToken } from '@/shared/api';

import { fetchCurrentUser, refreshAccessToken } from '../api/authApi';
import { mapAuthUserDtoToAuthUser } from '../api/authMapper';

// 앱 시작 시 1회, HttpOnly refresh 쿠키로 세션 복원을 시도한다. provider는 /auth/me에 없어 알 수 없다.
export function useAuthBootstrap() {
  const login = useAuthStore((state) => state.login);
  const setInitializing = useAuthStore((state) => state.setInitializing);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const tokenDto = await refreshAccessToken();
        setAccessToken(tokenDto.accessToken);
        const userDto = await fetchCurrentUser();
        if (!cancelled) login(mapAuthUserDtoToAuthUser(userDto));
      } catch {
        // refresh 쿠키가 없거나 만료된 경우: 비로그인 상태로 둔다.
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, [login, setInitializing]);
}
