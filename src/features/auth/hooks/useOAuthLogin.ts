import { useState } from 'react';
import { useLocation } from 'react-router';

import { parseApiError } from '@/shared/api';
import { useToast } from '@/shared/ui';
import { getRedirectPath } from '@/shared/utils';

import type { OAuthProviderId } from '../api/auth.dto';
import { fetchOAuthAuthorizationUrl } from '../api/authApi';
import { getAuthErrorMessage } from '../api/authErrorMessages';
import { saveOAuthSession } from '../lib/oauthSession';

export function useOAuthLogin() {
  const location = useLocation();
  const { showToast } = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const startOAuthLogin = async (provider: OAuthProviderId) => {
    setIsRedirecting(true);
    try {
      const authorizationUrl = await fetchOAuthAuthorizationUrl(provider);
      saveOAuthSession(provider, getRedirectPath(location.state));
      window.location.href = authorizationUrl;
    } catch (error) {
      setIsRedirecting(false);
      showToast(getAuthErrorMessage(parseApiError(error)), 'warning');
    }
  };

  return { startOAuthLogin, isRedirecting };
}
