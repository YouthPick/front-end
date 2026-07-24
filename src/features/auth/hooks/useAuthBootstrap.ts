import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/entities/user';
import { requestNewAccessToken } from '@/shared/api';

import { fetchCurrentUser } from '../api/authApi';
import { mapAuthUserDtoToAuthUser } from '../api/authMapper';
import { syncOnboardedStatus } from '../lib/syncOnboardedStatus';

// 앱 시작 시 1회, HttpOnly refresh 쿠키로 세션 복원을 시도한다. provider는 /auth/me에 없어 알 수 없다.
// AuthBootstrap은 앱 루트에 고정 마운트되어 실질적으로 언마운트되지 않으므로 cleanup은 두지 않고,
// ranOnceRef로 React StrictMode의 개발 모드 이펙트 이중 실행에도 복원 시도가 정확히 한 번만
// 일어나도록 막는다 — 그렇지 않으면 1회용으로 회전되는 refresh token이 동시 요청 중 하나 때문에
// 401로 실패할 수 있다.
//
// 주의: ranOnceRef는 컴포넌트가 재마운트돼도 다시 실행되지 않는 영구 1회성 가드다. 이 훅은
// "호출부가 언마운트되지 않는 단일 인스턴스"라는 전제 위에서만 안전하다. AuthBootstrap을 조건부
// 렌더로 바꾸거나 이 훅을 다른 곳에서 재사용하면 세션 복원이 조용히 스킵될 수 있으니 주의한다.
export function useAuthBootstrap() {
  const login = useAuthStore((state) => state.login);
  const setInitializing = useAuthStore((state) => state.setInitializing);
  const ranOnceRef = useRef(false);

  useEffect(() => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;

    async function restoreSession() {
      try {
        await requestNewAccessToken();
        const userDto = await fetchCurrentUser();
        login(mapAuthUserDtoToAuthUser(userDto));
        await syncOnboardedStatus();
      } catch {
        // refresh 쿠키가 없거나 만료된 경우: 비로그인 상태로 둔다.
      } finally {
        setInitializing(false);
      }
    }

    restoreSession();
  }, [login, setInitializing]);
}
