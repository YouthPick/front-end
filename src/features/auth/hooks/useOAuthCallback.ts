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

export function useOAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const profile = useProfileStore((state) => state.profile);
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const ranOnceRef = useRef(false);

  useEffect(() => {
    if (ranOnceRef.current) return;
    ranOnceRef.current = true;
    let cancelled = false;

    async function completeLogin() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const { provider, redirectTo } = consumeOAuthSession();

      if (!code || !state || !provider) {
        if (!cancelled) {
          setErrorMessage('로그인 정보가 올바르지 않습니다. 로그인 화면에서 다시 시도해 주세요.');
        }
        return;
      }

      try {
        const tokenDto = await exchangeOAuthCallback(provider, code, state);
        if (cancelled) return;
        setAccessToken(tokenDto.accessToken);
        const userDto = await fetchCurrentUser();
        if (cancelled) return;

        const providerLabel = getProviderLabel(provider);
        login(mapAuthUserDtoToAuthUser(userDto, providerLabel));
        showToast(
          `🎉 ${providerLabel} 계정으로 환영합니다! 맞춤 청년 정책 매칭이 활성화되었습니다.`,
          'success',
        );

        if (!profile.isOnboarded) {
          navigate(ROUTES.profileSetup, { replace: true, state: { from: redirectTo } });
          return;
        }
        navigate(isInternalPath(redirectTo) ? redirectTo : ROUTES.home, { replace: true });
      } catch (error) {
        if (!cancelled) setErrorMessage(getAuthErrorMessage(parseApiError(error)));
      }
    }

    completeLogin();
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate, login, profile.isOnboarded, showToast]);

  return { errorMessage };
}
