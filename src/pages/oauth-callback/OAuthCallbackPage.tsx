import { useNavigate } from 'react-router';

import { useOAuthCallback } from '@/features/auth';
import { ROUTES } from '@/shared/constants';
import { useSeo } from '@/shared/hooks';
import { ErrorState, Skeleton } from '@/shared/ui';

export function OAuthCallbackPage() {
  useSeo({ title: '로그인 처리 중', noindex: true });
  const { errorMessage } = useOAuthCallback();
  const navigate = useNavigate();

  if (errorMessage) {
    return (
      <div className="max-w-md mx-auto py-8">
        <ErrorState
          title={errorMessage}
          retryLabel="로그인 화면으로 돌아가기"
          onRetry={() => navigate(ROUTES.login, { replace: true })}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 space-y-4">
      <Skeleton className="h-10 w-1/2 mx-auto" />
      <Skeleton className="h-40" />
    </div>
  );
}
