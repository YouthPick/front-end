import { useNavigate } from 'react-router';

import { SocialLoginPanel, useOAuthLogin } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import { useSeo } from '@/shared/hooks';

export function LoginPage() {
  useSeo({ title: '로그인', noindex: true });
  const { startOAuthLogin, isRedirecting } = useOAuthLogin();
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-300 max-w-md mx-auto py-8">
      <SocialLoginPanel
        onSocialLogin={startOAuthLogin}
        onBackToHome={() => navigate(ROUTES.home)}
        isRedirecting={isRedirecting}
      />
    </div>
  );
}
