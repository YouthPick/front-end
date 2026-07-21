import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useAuthStore, useProfileStore } from '@/entities/user';
import { parseApiError, setAccessToken } from '@/shared/api';
import { ROUTES } from '@/shared/constants';
import { useToast } from '@/shared/ui';
import { isInternalPath } from '@/shared/utils';

import { exchangeOAuthCallback, fetchCurrentUser } from '../api/authApi';
import { getAuthErrorMessage } from '../api/authErrorMessages';
import { mapAuthUserDtoToAuthUser } from '../api/authMapper';
import { consumeOAuthSession } from '../lib/oauthSession';
import { getProviderLabel } from '../lib/providerLabel';
import { syncOnboardedStatus } from '../lib/syncOnboardedStatus';

export function useOAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ranOnceRef = useRef(false);

  // searchParams/navigate/login/showToast가 바뀌어도 재실행하지 않는다.
  // code는 1회용이라 재교환하면 실패하므로, ranOnceRef로 최초 마운트 시 정확히 한 번만 실행한다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: 의도적으로 최초 마운트 시 1회만 실행
  useEffect(() => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;

    async function completeLogin() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const { provider, redirectTo } = consumeOAuthSession();

      if (!code || !state || !provider) {
        setErrorMessage('로그인 정보가 올바르지 않습니다. 로그인 화면에서 다시 시도해 주세요.');
        return;
      }

      try {
        const tokenDto = await exchangeOAuthCallback(provider, code, state);
        setAccessToken(tokenDto.accessToken);
        const userDto = await fetchCurrentUser();

        const providerLabel = getProviderLabel(provider);
        login(mapAuthUserDtoToAuthUser(userDto, providerLabel));
        // 로컬 isOnboarded 플래그는 새 기기/브라우저에서 기본값(false)일 수 있어, 여기서 서버
        // 기준으로 다시 맞춘 뒤(아래) 그 값으로 라우팅을 결정한다 — 훅 렌더 시점에 구독한 값을
        // 쓰면 이 세션에서 처음 로그인한 경우 갱신 전 값을 참조하게 된다.
        await syncOnboardedStatus();
        showToast(
          `🎉 ${providerLabel} 계정으로 환영합니다! 맞춤 청년 정책 매칭이 활성화되었습니다.`,
          'success',
        );

        if (!useProfileStore.getState().profile.isOnboarded) {
          navigate(ROUTES.profileSetup, { replace: true, state: { from: redirectTo } });
          return;
        }
        navigate(isInternalPath(redirectTo) ? redirectTo : ROUTES.home, { replace: true });
      } catch (error) {
        setErrorMessage(getAuthErrorMessage(parseApiError(error)));
      }
    }

    completeLogin();
  }, []);

  return { errorMessage };
}
